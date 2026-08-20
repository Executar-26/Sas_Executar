# @sas-executar/db

**Fase:** 1 (fundação teams/RLS) e 3 (persistência de produto).
**Origem:** `Executar-26/Executar-app-scanner`, `supabase/migrations/**` (38 arquivos, 7.692 LOC,
reimplementadas contra o schema novo) + `src/persistence/**` (7 repositórios).

Cliente Supabase tipado + wrappers de RPC + tipos gerados. A migration inicial
(`supabase/migrations/0001_teams_foundation.sql`, na raiz do repo) já cria `teams`,
`team_members`, `invitations`, `activity_logs` e a função `is_team_member(team_id)` que toda
política RLS de recurso vai usar — ver `docs/PLAN.md` §3.

Repositórios a portar (mantendo a lógica TypeScript real que alguns já têm — não é wrapper puro
em todos os casos):

| Repositório original | LOC | Nota |
|---|---|---|
| `execution-repository.ts` | 518 | Wrapper fino — lógica real está nos RPCs Postgres |
| `qr-route-repository.ts` | 268 | Tem lógica real: `resolveDestination()` mapeia `QrIntent` → URL |
| `vault-repository.ts` | 400 | Tem lógica real: parsing de wikilink (`[[ref\|label]]`), resolução de alvo |
| `document-instance-repository.ts` | 205 | Wrapper fino |
| `document-repository.ts` | 179 | Wrapper fino |
| `document-qr-route-repository.ts` | 34 | Wrapper fino |
| `fractal-execution-structure-repository.ts` | 21 | Pass-through |

Sequência de RPCs (Nível 1/2/3) e a regra de "todo RPC de Nível 2/3 leva teste de isolamento no
mesmo PR" estão em `docs/PLAN.md` §3.2 — não pular essa regra.
