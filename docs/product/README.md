# Matriz de Produto × Repositório (SCHEMA V2.2 · P0 FINAL)

**[`SCHEMA_MATRIZ_PRODUTO_REPO_V2.2_P0_FINAL.csv`](./SCHEMA_MATRIZ_PRODUTO_REPO_V2.2_P0_FINAL.csv)**
— inventário de 105 linhas (78 features, 22 requirements em aberto, 5 deliverables-âncora de P0)
cruzando o que o AppScanner atual (`Executar-26/Executar-app-scanner`) já implementa com o
contrato de produto formalizado em 19/08/2026 (Canonical Work Model, Adaptive Execution
Dispatcher, Cycle 72 Execution Contract, UX/UI Acceptance Contract, Fractal Design System).

## Colunas de entrega (engenharia)

`delivery_tier`, `delivery_order`, `depends_on`, `definition_of_done`, `acceptance_criteria` —
preenchidas mapeando cada `product_domain` a um ou mais dos 5 deliverables-âncora já definidos na
planilha. `P0`=46, `P1`=50, `P2`=4 (a única `P2` com dependência *externa*, não do próprio
AppScanner, é `Colaboração`/"Share" — FTR-012 —, que depende da Fase 1 de `teams`/RLS deste
repositório). DoD/critérios de aceite vêm do `feature_intent`/`missing_scope`/`implemented_scope`
que cada linha já trazia.

## Colunas de correlação clínica/científica (TDAH × gestão de projetos)

Preenchidas a partir de **[`DATA-ADHD-PM-001`](./DATA-ADHD-PM-001.md)** — pesquisa fornecida com
citações reais e verificáveis (NIMH, PubMed, PMBOK® Guide 8, NICE NG87), não gerada por inferência
solta. Essa pesquisa formaliza uma matriz de 11 funções de gestão de projetos (`GP-01` Iniciação e
escopo → `GP-11` Capacidade e forecasting), cada uma com: função executiva cognitiva envolvida,
fonte clínica, fonte científica, classe de evidência (`B`/`C` para a associação clínica geral,
nunca `A`), impacto operacional (mecanismo → consequência → compensação) e uma conclusão de design
explicitamente marcada `E · Inferido`.

**Metodologia de preenchimento:** cada uma das 100 linhas de feature/requirement foi mapeada à
função `GP-0X` mais próxima com base em `product_domain`/`feature_intent` (ex.: `FTR-021` "Action
Now / Best Next Action" → `GP-03` Priorizar e sequenciar; `FTR-025` "Capacity filtering" → `GP-11`
Capacidade e forecasting; `FTR-024` "WIP control" → `GP-06` Execução). 62 linhas mapeiam a alguma
`GP-0X`; 38 são infraestrutura/implementação sem correlação direta (ex.: `FTR-076` Rate limiting,
`FTR-069` Supabase persistence) e foram marcadas `N/A_CAMADA_TECNICA` / `not_applicable_infra_layer`
— **não** força-se uma correlação em item que não a tem. As 5 linhas `Agentes ·` já continham
conteúdo próprio (`correlation_status=approved_architecture`) de uma passada anterior; esse
conteúdo foi preservado, e só as células ainda vazias (as 4 estritamente clínicas —
`funcao_deficit_tdah`, `fonte_clinica`, `fonte_cientifica`, `funcao_executiva_cognitiva`, mais
`capacidades_humanas_operacionais_exigidas`) foram completadas.

## Disciplina epistêmica mantida

A associação clínica geral (**"gestão de projetos convencional exige planejamento, memória
prospectiva, atenção sustentada, gestão de tempo e autocontrole — domínios em que adultos com TDAH
podem, com heterogeneidade individual, apresentar dificuldade"**) é sustentada por
`DATA-ADHD-PM-001` com classe de evidência `B`/`C` (publicada, mas heterogênea — nunca universal).
**A ligação entre isso e uma feature específica do EXECUTAR é sempre `E · Inferido`** — nenhuma
linha desta planilha afirma que uma feature do AppScanner foi clinicamente validada para reduzir
um déficit específico em usuários reais. Isso é reforçado em duas colunas: `evidencia` carrega a
classe de evidência do próprio `DATA-ADHD-PM-001` (ex.: `"C · moderada"`, nunca `A`), e
`correlation_status=inferred_from_DATA-ADHD-PM-001` (distinto de `approved_architecture`, que só
se aplica às 5 linhas com decisão de produto já formalizada). `conclusao_produto_design` sempre
termina com o rótulo `E · Inferido` explícito.

**O que ainda não existe:** validação empírica de que qualquer feature do EXECUTAR de fato reduz
fricção operacional em usuários com TDAH. `DATA-ADHD-PM-001` é explícito sobre isso — é
precisamente o claim que o produto deverá testar, não algo já demonstrado.

## Contexto de origem

Os memorandos de pesquisa que acompanharam esta matriz — **OPS-CAP-001** (viabilidade do motor de
capacidade/previsão), **REV-MODEL-003** (TAM/SAM/SOM de trabalhadores neurodivergentes) e
**DATA-ADHD-PM-001** (matriz de correlação TDAH × gestão de projetos) — estão sintetizados em
[`docs/EXECUTIVE_SUMMARY.md`](../EXECUTIVE_SUMMARY.md).
