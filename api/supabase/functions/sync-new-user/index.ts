// @ts-nocheck
import { createClient } from 'jsr:@supabase/supabase-js@2'

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
  type?: string
  table?: string
  record?: AuthRecord
  schema?: string
  old_record?: AuthRecord | null
}

console.log('Função "sync-new-user" pronta para receber eventos.')

Deno.serve(async req => {
  try {
    console.log('=== INÍCIO DA EXECUÇÃO DA EDGE FUNCTION ===')

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    console.log('Variáveis de ambiente:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!serviceRoleKey,
      url: supabaseUrl,
    })

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('ERRO: Variáveis de ambiente não encontradas')
      throw new Error(
        'Variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não encontradas'
      )
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const raw = await req.json()
    const body = raw as WebhookBody
    console.log('Payload recebido:', JSON.stringify(body, null, 2))

    // Webhook do Supabase Auth envia o registro do auth.users
    const authUser = body.record

    console.log(
      'AuthUser extraído:',
      authUser ? { id: authUser.id, email: authUser.email } : 'null'
    )

    if (!authUser || !authUser.id) {
      console.error(
        'ERRO: Payload inesperado do webhook:',
        JSON.stringify(body)
      )
      return new Response(JSON.stringify({ message: 'Payload inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const email = authUser.email ?? ''
    console.log(
      `✓ Recebido evento para o usuário: ${email} (ID: ${authUser.id})`
    )

    // Checar se usuário já existe
    console.log('Checando se usuário já existe...')
    const { data: existing, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', authUser.id)
      .maybeSingle()

    if (checkError) {
      console.error('ERRO ao checar usuário:', checkError)
      throw checkError
    }

    console.log('Resultado da checagem:', existing)

    if (existing) {
      console.log(`✓ Usuário ${email} já existe no banco de dados.`)
      return new Response(
        JSON.stringify({ message: `Usuário ${email} já existe` }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Inserir novo usuário
    const userData = {
      id: authUser.id,
      email: email,
      name:
        authUser.raw_user_meta_data?.full_name ??
        (email ? email.split('@')[0] : null),
      avatar_url: authUser.raw_user_meta_data?.avatar_url ?? null,
      plan: 'FREE',
      is_register_complete: false,
    }

    console.log('Inserindo novo usuário:', userData)
    const { data: insertedUser, error: insertError } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single()

    if (insertError) {
      console.error('ERRO ao inserir usuário:', insertError)
      throw insertError
    }

    console.log('✓✓✓ Usuário sincronizado com sucesso:', insertedUser)
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
