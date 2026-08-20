# @sas-executar/fractal

**Fase:** 2 (portável como está).
**Origem:** `Executar-26/Executar-app-scanner`, `src/fractal/**`.

Formato de intercâmbio de plano (`FractalPlan` = meta + epics[] + deliverables[] + tasks[]) e os
adapters que importam para esse formato:

- `adapters/source-adapters.ts` — `fromJsonSource()` e `fromMarkdownSource()`.
- `adapters/json-source-router.ts`, `language-layer-source.ts`, `plan-exchange-source.ts` —
  dialetos adicionais de JSON (inclui o formato usado por `@sas-executar/ai-plan`).
- `adapters/execution-adapter.ts` — round-trip `ExecutionProject` (formato de banco) ↔
  `FractalPlan` (formato de intercâmbio).
- `preflight/preflight.ts` — `preflightFractalPlan()`: valida título, ≥1 epic, datas ISO, IDs
  duplicados, regras por superfície (web/mobile/print).
- `selectors/` — seletores de leitura sobre `FractalExecutionStructure`.

Sem acoplamento a Supabase em nenhum desses arquivos — porte direto.
