sync-new-user (Edge Function)

Função Deno para sincronizar novos usuários do Supabase Auth para a tabela users via REST API.

Variáveis de ambiente necessárias:
- SUPABASE_URL (ex: https://<project-ref>.supabase.co)
- SUPABASE_SERVICE_ROLE_KEY (service_role)

Deploy local / teste:
- npx supabase functions serve sync-new-user
- ou deno run --allow-net --allow-env supabase/functions/sync-new-user/index.ts

Deploy para o Supabase:
- npx supabase functions deploy sync-new-user --project-ref <PROJECT_REF>
- Registrar webhook em Auth > Webhooks para o evento user.created

Observações:
- A função usa a REST API rest/v1/users. Use service_role apenas em servidores.
