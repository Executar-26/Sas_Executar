# @sas-executar/domain

**Fase:** 2 (portável como está).
**Origem:** `Executar-26/Executar-app-scanner`, `src/domain/*.ts` (8 arquivos, 1.114 LOC).

Modelo de entidade central: **Project → Area ("Epic") → Deliverable → Action**, mais Sprint e
ContextLink. Zero I/O, zero acoplamento a Supabase — TypeScript puro, o candidato de porte de
menor risco de todo o plano.

Arquivos a portar (copiar e ajustar imports só, ver `docs/PLAN.md` §2/§5 Fase 2):

- `execution.ts` — tipos canônicos, máquina de estado, cálculo de progresso ponderado,
  `resolveExecutionContext`.
- `canonical-state.ts` — `evaluateActionReadiness` (contrato Action V2), ordenação topológica +
  caminho crítico, cálculo de capacidade 72h, `evaluateCompletionAuthority` (espelho client-side
  da "Completion Authority" do banco — ver `packages/db`).
- `qr-route.ts` + `qr-token.ts` — domínio de roteamento QR (`QrIntent`, validação/hash de token,
  máquina de estado de resolução).
- `scanner-command.ts` — comandos físicos do scanner (play/pause/redo/recycle).
- `task-dashboard.ts` + `project-selector.ts` — seletores de view-model.
- `weekdays.ts` — domínio de pastas físicas por dia da semana (marcadores de cor, aliases OCR).

**Cuidado ao portar:** esses tipos são escopados por projeto (Project/Area/Deliverable/Action).
Ao integrar com o schema novo (`packages/db`), cada entidade que hoje é `owner_id`-only precisa
carregar `team_id` — ver `docs/PLAN.md` §3.
