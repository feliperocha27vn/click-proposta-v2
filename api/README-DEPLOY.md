# Deploy no Fly.io

## Pré-requisitos

1. Instale o Fly CLI: https://fly.io/docs/getting-started/installing-flyctl/
2. Faça login no Fly.io: `fly auth login`

## Deploy

### Primeira vez:

1. **Lance a aplicação:**
   ```bash
   fly launch
   ```
   
2. **Configure as variáveis de ambiente:**
   ```bash
   fly secrets set DATABASE_URL="your_database_url"
   fly secrets set JWT_SECRET="your_jwt_secret"
   ```

3. **Deploy:**
   ```bash
   fly deploy
   ```

### Deploys subsequentes:

```bash
fly deploy
```

## Configuração do Banco de Dados

Para usar um banco PostgreSQL no Fly.io:

```bash
fly postgres create --name click-proposta-db
fly postgres attach --app click-proposta-api click-proposta-db
```

## Monitoramento

- **Ver logs:** `fly logs`
- **Status da app:** `fly status`
- **Abrir a aplicação:** `fly open`

## Variáveis de Ambiente Necessárias

- `DATABASE_URL`: URL de conexão com o banco de dados
- `JWT_SECRET`: Chave secreta para JWT
- `NODE_ENV`: Automaticamente definida como "production"
- `PORT`: Automaticamente definida como "3333"

## Healthcheck

A aplicação inclui um endpoint `/health` que retorna:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```