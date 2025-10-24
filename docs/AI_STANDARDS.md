# Aura Academy – Engineering Standards (para agentes e devs)

Documento de referência curto e normativo. Siga estes padrões ao implementar qualquer mudança. O objetivo é evitar fluxos duplicados e manter consistência com a stack e decisões do projeto.

## Stack e versões
- Next.js App Router (TypeScript) – `next@15`
- React 19 – componentes client/server explícitos
- Tailwind CSS v4 – tokens em `src/app/globals.css`
- shadcn/ui style – `Button` com `asChild`, `DropdownMenu` etc
- TanStack Query v5 – `src/components/providers/query-provider.tsx`
- Supabase – Auth + DB; clients em `src/lib/supabase`
- Drizzle ORM – `src/db` (pool com reuso em dev)
- Zod – validações server-side e env

## Layout, tema e i18n
- Layout raiz em `src/app/layout.tsx`:
  - Pré-aplica tema no `<head>` com script sem flash.
  - `QueryProvider` no body.
  - `AuthListener` para refletir alterações de sessão.
  - `FlashToastClient` consome cookie `flash` e apaga-o.
- Tema:
  - CSS Vars em `:root` e `.dark` (Tailwind v4).
  - Cookie `theme` com `sameSite=lax`, `httpOnly=false`, `path=/`, `maxAge=1y`.
  - `ThemeSelector` chama `setThemeAction`.
- i18n:
  - Locale em cookie `locale`; detecção inicial por `accept-language`.
  - Use `getLocaleFromCookies()` + `getDictionary(locale)` + `translate`.
  - `setLocaleAction` atualiza cookie e metadata do usuário no Supabase.

## Autenticação (Supabase)
- Client: `createSupabaseBrowserClient()`.
- Server: `createSupabaseServerClient()` com cookies do Next.
- Proteção de rotas:
  - Middleware central em `src/middleware.ts` para redirecionar entre auth e `/dashboard`.
  - Para trechos isolados, `requireAuth` em `src/middleware/auth.ts`.
- Pós-login no server: garantir `ensureUserRecord` (idempotente via `onConflictDoUpdate`).

## Server Actions – padrões obrigatórios
- Sempre no topo: "use server".
- Segurança:
  - Aplique rate-limit por IP usando `enforceRateLimitOrThrow` de `src/lib/rate-limit.ts`.
  - Valide inputs com Zod. Nunca confie em `FormData` sem validação.
- Cookies:
  - Para flash messages, grave cookie `flash` (não httpOnly) e consuma no layout via `FlashToastClient`.
- Navegação:
  - Use `redirect()` no server após ações irreversíveis.

Exemplos atuais (limites por IP, já implementados):
- `signOutAction`: 10 req/min
- `deleteMyAccountAction`: 3 req/min
- `setThemeAction` e `setLocaleAction`: 20 req/min + validação com Zod

## Rate limiting
- Util: `src/lib/rate-limit.ts` (in-memory, com reuso em dev).
- Padrão de uso:
  - Obtenha IP: `const ip = await getClientIp()`.
  - Antes da lógica: `await enforceRateLimitOrThrow({ key: `namespace:acao:${ip}`, limit, windowMs })`.
- Produção (opcional recomendado): migrar para Upstash Redis no mesmo util mantendo a mesma API.

## UI e Navegação
- Nunca aninhar `<Link><Button/></Link>`.
  - Use `Button asChild` e aninhe o `Link` dentro.
- Em `DropdownMenuItem`, use `asChild` com `Link` para evitar wrappers inválidos.
- Utilize componentes de `src/components/ui` para consistência visual e de acessibilidade.

## Banco de Dados (Drizzle + Postgres)
- Cliente: `src/db/client.ts` – reusa `Pool` e instância Drizzle em dev para evitar múltiplas conexões durante HMR.
- Esquema: `src/db/schema.ts`.
- Idempotência: prefira `onConflictDoUpdate` (ex.: `ensureUserRecord`).
- O client admin do Supabase (`service role`) é server-only (nunca importar em client components).

## Middleware
- `src/middleware.ts` decide fluxo auth/guest e ignora estáticos e `/api`.
- Mantenha a lógica mínima e focada em roteamento/guard; evite efeitos colaterais pesados.

## Componentes client/server
- Componentes server by default. Use "use client" somente quando necessário (estado, efeitos, eventos).
- Hidratação de usuário:
  - Server component `UserMenu` obtém `initialEmail`.
  - `UserMenuHydrated` atualiza email via `supabase.auth.onAuthStateChange`.

## Variáveis de ambiente
- Cliente: `src/lib/env-client.ts` valida `NEXT_PUBLIC_*`.
- Server: `src/lib/env-server.ts` valida `DATABASE_URL`, `NODE_ENV`, opcional `SUPABASE_SERVICE_ROLE_KEY`.
- Não introduzir novos usos de `process.env` sem passar pela validação Zod dos módulos `env-*`.

## Estilo de código
- TypeScript estrito, nomes descritivos, early return.
- Evitar `try/catch` sem tratamento útil; não engolir erros.
- Comentários só para contexto não óbvio.
- UI: preferir util `cn` e variantes `cva`.

## Definition of Done (checklist por PR)
- [ ] Aplicado rate-limit e validação Zod em novas server actions.
- [ ] Navegação segura: `redirect()` pós-ação e `Button asChild` com `Link`.
- [ ] Reuso de DB Pool preservado; queries idempotentes quando aplicável.
- [ ] i18n e tema respeitados (cookies/labels via `getDictionary`).
- [ ] Sem duplicar fluxos: reutilizar `supabase/server|client`, `FlashToastClient`, `AuthListener`.
- [ ] Lint ok (`npm run lint`).

## Como estender (sem romper padrões)
- Novas ações: seguir seção "Server Actions – padrões obrigatórios".
- Novos endpoints/rotas protegidos: usar middleware existente e, se necessário, `requireAuth`.
- Integrações externas: isolar em `src/lib/<integ>` e validar config com Zod em `env-*`.
- Rate-limit externo (futuro): implementar driver Upstash no mesmo util sem mudar assinatura pública.
