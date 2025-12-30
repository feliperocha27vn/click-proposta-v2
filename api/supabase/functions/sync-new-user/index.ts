// @ts-nocheck
// Edge Function: sync-new-user
// Recebe webhook do Supabase Auth e insere/atualiza um registro na tabela `users` via REST API

interface RawUserMeta {
  full_name?: string
  avatar_url?: string
}

interface AuthRecord {
  id: string
  email?: string
  raw_user_meta_data?: RawUserMeta
  user_metadata?: RawUserMeta
}

type WebhookBody = {
  event?: string
  record?: AuthRecord
  user?: AuthRecord
  // alguns payloads usam `record`, outros `user` — aceitaremos ambos
  [k: string]: unknown
}

console.log('Função "sync-new-user" pronta para receber eventos.')

Deno.serve(async req => {
  try {
    // Aceita tanto as variáveis padrão do runtime Supabase (SUPABASE_...)
    // quanto nomes sem prefixo para permitir criação via CLI:
    // CLI não permite criar secrets que comecem com SUPABASE_
    const supabaseUrl =
      Deno.env.get('SUPABASE_URL') ??
      Deno.env.get('PROJECT_URL') ??
      Deno.env.get('PROJECT_SUPABASE_URL')

    const serviceRoleKey =
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ??
      Deno.env.get('SERVICE_ROLE_KEY') ??
      Deno.env.get('SERVICE_ROLE')

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error(
        'Variáveis de ambiente não encontradas. Defina SERVICE_ROLE_KEY e PROJECT_URL (ou SUPABASE_SERVICE_ROLE_KEY / SUPABASE_URL no runtime do Supabase).'
      )
    }

    const raw = await req.json()
    const body = raw as WebhookBody

    // Compatível com diferentes formatos: record || user || payload.record || payload.user
    // helper para acessar deep properties com `unknown`
    const getNested = <T>(obj: unknown, path: string[]): T | undefined => {
      let cur: unknown = obj
      for (const key of path) {
        if (
          cur &&
          typeof cur === 'object' &&
          key in (cur as Record<string, unknown>)
        ) {
          cur = (cur as Record<string, unknown>)[key]
        } else {
          return undefined
        }
      }
      return cur as T | undefined
    }

    const authUser =
      (body.record as AuthRecord) ??
      (body.user as AuthRecord) ??
      getNested<AuthRecord>(body, ['payload', 'record']) ??
      null

    if (!authUser || !authUser.id) {
      console.warn('Payload inesperado do webhook:', body)
      return new Response(JSON.stringify({ message: 'Payload inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const email = authUser.email ?? ''
    console.log(`Recebido evento para o usuário: ${email} (ID: ${authUser.id})`)

    const userData = {
      id: authUser.id,
      email: email,
      name:
        authUser.raw_user_meta_data?.full_name ??
        authUser.user_metadata?.full_name ??
        (email ? email.split('@')[0] : null),
      avatar_url:
        authUser.raw_user_meta_data?.avatar_url ??
        authUser.user_metadata?.avatar_url ??
        '',
      plan: 'FREE',
    } as Record<string, unknown>

    // Check if exists by id
    const checkUrl = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/users?id=eq.${encodeURIComponent(authUser.id)}&select=*`
    const commonHeaders = {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    } as Record<string, string>

    const checkResponse = await fetch(checkUrl, {
      method: 'GET',
      headers: commonHeaders,
    })

    if (!checkResponse.ok) {
      const txt = await checkResponse.text()
      throw new Error(
        `Erro ao checar usuário existente: ${checkResponse.status} - ${txt}`
      )
    }

    const existing = await checkResponse.json()
    if (Array.isArray(existing) && existing.length > 0) {
      console.log(`Usuário ${email} já existe no banco de dados.`)
      return new Response(
        JSON.stringify({ message: `Usuário ${email} já existe` }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Inserir novo usuário
    const insertUrl = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/users`
    const insertResponse = await fetch(insertUrl, {
      method: 'POST',
      headers: {
        ...commonHeaders,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(userData),
    })

    if (!insertResponse.ok) {
      const err = await insertResponse.text()
      throw new Error(
        `Erro ao inserir usuário: ${insertResponse.status} - ${err}`
      )
    }

    console.log(
      `Usuário ${email} sincronizado com sucesso na tabela public.users.`
    )
    return new Response(
      JSON.stringify({ message: `Usuário ${email} sincronizado` }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    // Não retornar 500 ao Supabase Auth: se a edge function falhar com 5xx,
    // o fluxo de autenticação do provedor (Google) pode tratar isso como
    // "Database error saving new user" e abortar o login do usuário.
    //
    // Registramos o erro nos logs para investigação, mas retornamos 200
    // para que o callback OAuth não seja rejeitado devido a falhas secundárias
    // nesta função.
    console.error('Ocorreu um erro na função:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido'

    // Retorna 200 para evitar que Supabase trate o webhook como falha.
    return new Response(
      JSON.stringify({
        message:
          'Erro interno processando webhook; verifique os logs da função.',
        error: errorMessage,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
