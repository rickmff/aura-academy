# Aura Academy – AI Engineering Guide

Este documento fornece contexto arquitetural e padrões para agentes de IA e desenvolvedores humanos continuarem o projeto de forma consistente e escalável.

## Stack
- Next.js (App Router, TypeScript)
- Tailwind CSS v4
- React Query (@tanstack/react-query)
- Supabase (Database + Auth)
- Drizzle ORM (+ drizzle-kit)
- shadcn/ui (componentes utilitários – Button de exemplo)

## Organização de Pastas
- `src/app`: rotas, layouts e páginas (App Router)
- `src/components`: componentes de UI e providers
  - `src/components/ui`: átomos e componentes shadcn-like
  - `src/components/providers`: provedores de contexto (ex.: React Query)
- `src/lib`: utilitários e integrações
  - `src/lib/env.ts`: validação de variáveis de ambiente
  - `src/lib/supabase`: clients `server`/`client`
  - `src/lib/utils.ts`: helpers (`cn`)
- `src/db`: ORM e schema
  - `src/db/schema.ts`: tabelas Drizzle
  - `src/db/client.ts`: cliente do banco via `drizzle-orm/node-postgres`
- `src/middleware`: middlewares server-side reutilizáveis (ex.: `requireAuth`)
- `docs`: documentação (este guia)
  - `docs/AI_STANDARDS.md`: referência normativa. Sempre siga este arquivo primeiro.

## Variáveis de Ambiente
Defina um `.env` (ou `.env.local`) com:
- `DATABASE_URL`: string Postgres (use a instância do Supabase)
- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: chave pública anon
- `SUPABASE_SERVICE_ROLE_KEY`: opcional, nunca expor ao cliente

Exemplo de template:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Validação em `src/lib/env.ts` com Zod impede boot com env inválido.

## Autenticação (Supabase)
- Browser: `createSupabaseBrowserClient()`
- Server: `createSupabaseServerClient()` com cookies do Next
- Proteção de rotas server: `requireAuth(req)` redireciona para `/signin` se guest
- Exemplo de fluxo OAuth GitHub em `src/app/(auth)/signin/page.tsx`

## Dados e React Query
- `QueryProvider` configura `QueryClient` e Devtools em dev
- Use hooks por recurso e chaves de cache estáveis
- SSR/Streaming: preferir hidratação no client quando possível ou fetch server-first e expor via props/headers

## Banco de Dados (Drizzle)
- Schema em `src/db/schema.ts`
- Cliente em `src/db/client.ts`
- Configuração do drizzle-kit em `drizzle.config.ts`
- Scripts:
  - `npm run db:generate`
  - `npm run db:migrate`
  - `npm run db:studio`

## UI e Acessibilidade
- Tailwind v4 com tokens em `globals.css`
- `Button` baseado em `cva` com variantes `variant` e `size`
- Use `cn` para combinar classes

## Padrões de Código
- TypeScript estrito
- Funções com nomes verbais; variáveis descritivas
- Early-returns em vez de aninhamento profundo
- Comentários apenas para contexto não óbvio
- Não englobar try/catch sem tratamento útil

## Convenções de Commit e Pull Request
- Commits atômicos e descritivos
- PRs pequenos, com descrição clara do efeito e riscos

## Roadmap Próximo
- Adicionar componentes shadcn adicionais (Input, Card, Form)
- Layout de dashboard com navegação lateral
- Tabelas e relacionamentos no Drizzle
- RLS e policies no Supabase
- Testes (unitários e e2e)

## Como contribuir
- Configure `.env.local`
- `npm run dev`
- Execute scripts de DB se necessário
- Siga as decisões deste documento ao criar novos módulos


