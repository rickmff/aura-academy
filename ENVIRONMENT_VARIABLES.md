# Variáveis de Ambiente

Este arquivo documenta todas as variáveis de ambiente necessárias para o projeto.

## Configuração do Banco de Dados

### DATABASE_URL
- **Descrição**: URL de conexão com o banco de dados PostgreSQL
- **Formato**: `postgresql://username:password@localhost:5432/database_name`
- **Exemplo**: `postgresql://postgres:password@localhost:5432/saas_template`

## Configuração do Supabase

### NEXT_PUBLIC_SUPABASE_URL
- **Descrição**: URL pública do seu projeto Supabase
- **Onde encontrar**: Dashboard do Supabase > Settings > API > Project URL
- **Exemplo**: `https://your-project.supabase.co`

### NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Descrição**: Chave pública anônima do Supabase
- **Onde encontrar**: Dashboard do Supabase > Settings > API > Project API keys > anon public
- **Exemplo**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### SUPABASE_SERVICE_ROLE_KEY
- **Descrição**: Chave de serviço do Supabase (para operações administrativas)
- **Onde encontrar**: Dashboard do Supabase > Settings > API > Project API keys > service_role secret
- **Exemplo**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Configuração do Stripe

### NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- **Descrição**: Chave pública do Stripe (para o frontend)
- **Onde encontrar**: Dashboard do Stripe > Developers > API keys > Publishable key
- **Modo de Teste**: `pk_test_...`
- **Modo de Produção**: `pk_live_...`

### STRIPE_SECRET_KEY
- **Descrição**: Chave secreta do Stripe (para o backend)
- **Onde encontrar**: Dashboard do Stripe > Developers > API keys > Secret key
- **Modo de Teste**: `sk_test_...`
- **Modo de Produção**: `sk_live_...`

### STRIPE_WEBHOOK_SECRET
- **Descrição**: Chave secreta do webhook do Stripe
- **Onde encontrar**: Dashboard do Stripe > Developers > Webhooks > [Seu webhook] > Signing secret
- **Exemplo**: `whsec_...`

## Configuração do Ambiente

### NODE_ENV
- **Descrição**: Ambiente de execução da aplicação
- **Valores possíveis**: `development`, `production`, `test`
- **Padrão**: `development`

## Como Configurar

1. **Copie o arquivo de exemplo**:
   ```bash
   cp env.example .env.local
   ```

2. **Preencha as variáveis** com seus valores reais

3. **Para desenvolvimento local**, use as chaves de teste do Stripe

4. **Para produção**, substitua pelas chaves de produção

## Segurança

- ⚠️ **NUNCA** commite o arquivo `.env.local` para o repositório
- ⚠️ **NUNCA** compartilhe suas chaves secretas
- ⚠️ Use chaves de teste durante o desenvolvimento
- ⚠️ Use chaves de produção apenas em ambiente de produção

## Verificação

Para verificar se todas as variáveis estão configuradas corretamente, execute:

```bash
npm run build
```

Se houver variáveis faltando, você verá erros de validação do Zod.
