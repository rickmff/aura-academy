---
name: Feature request
about: Sugerir uma ideia para o projeto
title: "[Feature] <título curto>"
labels: [enhancement]
assignees: []
---

## Contexto
Que problema esta feature resolve? Qual o valor para o usuário?

## Descrição da solução
Descreva a solução proposta no alto nível.

## Critérios de aceitação
- [ ]
- [ ]

## Considerações técnicas
- Fluxos e padrões: seguir `docs/AI_STANDARDS.md` (server actions/validação/navegação/DB/i18n)
- Rate-limit e validação Zod para novas server actions
- Reutilizar `supabase/server|client`, `FlashToastClient`, `AuthListener`
- Reuso do pool do DB e idempotência quando aplicável

## Riscos
Liste riscos e mitigação.

## Tarefas (opcional)
- [ ] Design/UX
- [ ] Implementação
- [ ] Testes

