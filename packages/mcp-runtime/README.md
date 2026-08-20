# @sas-executar/mcp-runtime

**Fase:** misto — 2 para as partes puras, 3 para as que dependem de tabela.
**Origem:** `Executar-26/Executar-app-scanner`, `src/mcp/**`.

Protocolo MCP 2025-06-18, contrato de servidor v2.4.0. Autenticação via OAuth 2.1 + bearer do
Supabase Auth (`validateMcpBearer`).

**Portável como está (Fase 2):**
- `registry.ts` — catálogo de ferramentas (13 no total: 10 v22 "skill", 5 v23 domínio — inclui
  `executar_actions` que nunca completa uma Action, DONE é reservado à Completion Authority do
  banco —, 3 v24 somente-leitura).
- `xlsx-runtime.ts` — escritor OOXML/XLSX feito à mão, sem dependências.
- `binary-artifact-runtime.ts` — escritor ZIP feito à mão (CRC32), sem dependências.
- `schema-validator.ts` — validação de argumentos por JSON schema.

**Precisa do rework de `packages/db` (Fase 3):**
- `execution-state-engine.ts` — derivação de posição/estado (PENDING/ELIGIBLE/ACTIVE/VERIFYING/
  COMPLETED/BLOCKED), métricas de caminho crítico/carga diária projetada.
- `copilot-runtime.ts` — sessões "bom dia copiloto" (`copilot_sessions`/`copilot_session_blocks`).
- `skill-runtime.ts` — executa as 10 skills v22, chama `xlsx-runtime`/`binary-artifact-runtime`.

O algoritmo dessas três últimas porta direto; só as chamadas a tabela precisam trocar
`owner_id = auth.uid()` por `is_team_member(team_id)`.
