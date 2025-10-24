---
name: Bug report
about: Reportar um bug para ajudar a melhorar o projeto
title: "[Bug] <título curto>"
labels: [bug]
assignees: []
---

## Descrição
Explique claramente o problema observado.

## Passos para reproduzir
1.
2.
3.

## Comportamento esperado
Descreva o comportamento correto esperado.

## Evidências
Inclua logs, screenshots, vídeos ou links relevantes.

## Ambiente
- SO/Navegador/Versão (quando aplicável):
- Node/PNPM/NPM:
- Versão da aplicação:

## Impacto
Qual impacto do bug (usuários afetados, severidade, áreas)?

## Checklist de alinhamento (AI_STANDARDS)
- [ ] A correção seguirá `docs/AI_STANDARDS.md` (server actions/validação/navegação/DB/i18n)
- [ ] Adicionará/ajustará rate-limit e validação Zod quando aplicável
- [ ] Evitará duplicar fluxos existentes (usar `supabase/server|client`, `FlashToastClient`, `AuthListener`)

## Tarefas (opcional)
- [ ] Identificar causa raiz
- [ ] Implementar correção
- [ ] Cobertura de testes manual/automática

