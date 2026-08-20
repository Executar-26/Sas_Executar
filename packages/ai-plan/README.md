# @sas-executar/ai-plan

**Fase:** 2 (portável como está — decisão travada: mantém OpenAI).
**Origem:** `Executar-26/Executar-app-scanner`, `src/ai/plan-generator.ts` (473 LOC) +
`guided-plan-method.ts` (103 LOC, config estática).

`plan-generator.ts` chama a API Responses da OpenAI diretamente via `fetch`
(`https://api.openai.com/v1/responses`), modelo configurável por `OPENAI_PLAN_MODEL` (env,
default histórico `"gpt-5.6"`), requer `OPENAI_API_KEY`. Schemas Zod de saída estruturada
impedem alucinação de fatos (orçamento/prazo/aprovações ficam em `missing_information` quando
não informados pelo usuário). Produz um `GeneratedPlanExchange` consumido por
`packages/fractal`'s `plan-exchange-source.ts`.

Este pacote foi deliberadamente isolado dos demais justamente para que a decisão de provedor de
IA (OpenAI vs. Claude) não bloqueasse o porte do resto do produto — a decisão já foi tomada
(manter OpenAI), mas o isolamento continua valendo: se essa decisão mudar no futuro, o raio de
impacto fica contido aqui.
