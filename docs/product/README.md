# Matriz de Produto × Repositório (SCHEMA V2.2 · P0 FINAL)

**[`SCHEMA_MATRIZ_PRODUTO_REPO_V2.2_P0_FINAL.csv`](./SCHEMA_MATRIZ_PRODUTO_REPO_V2.2_P0_FINAL.csv)**
— inventário de 105 linhas (78 features, 22 requirements em aberto, 5 deliverables-âncora de P0)
cruzando o que o AppScanner atual (`Executar-26/Executar-app-scanner`) já implementa com o
contrato de produto formalizado em 19/08/2026 (Canonical Work Model, Adaptive Execution
Dispatcher, Cycle 72 Execution Contract, UX/UI Acceptance Contract, Fractal Design System).

## O que foi preenchido nesta versão

**Colunas `delivery_tier`, `delivery_order`, `depends_on`, `definition_of_done`,
`acceptance_criteria` — as 100 linhas de feature/requirement que chegaram em branco.** Essa é a
área de responsabilidade de engenharia/entrega: dado o que cada linha já declara sobre si mesma
(`feature_intent`, `implementation_state`, `implemented_scope`, `missing_scope`), decidir em qual
onda de entrega ela cai, do que ela depende estruturalmente, e o que "pronto" significa de forma
verificável.

**Metodologia (determinística, não inventada linha a linha):**

1. **`delivery_tier` + `depends_on`** — cada `product_domain` foi mapeado para um ou mais dos 5
   deliverables-âncora (`P0-FINAL-01` a `05`, já preenchidos no arquivo original como exemplo do
   schema esperado). Domínios que são o núcleo do modelo canônico, do dispatcher, da acessibilidade
   ou do contrato de IA/schema foram classificados `P0`; domínios adjacentes (EMITIR, Observabilidade,
   Copiloto/MCP, Scanner) foram classificados `P1`; domínios que dependem de infraestrutura ainda
   não construída **neste** repositório (`Sas_Executar`) foram classificados `P2` com uma
   dependência externa explícita — é o caso de `Colaboração` (ex.: FTR-012 "Share"), que depende do
   modelo de `teams`/RLS multiusuário da Fase 1 do [`docs/PLAN.md`](../PLAN.md), não de nada dentro
   do próprio AppScanner. Essa é a única ponte deliberada entre esta matriz (produto AppScanner) e
   o plano de reconstrução SaaS.
2. **`delivery_order`** — sequencial dentro de cada tier, na ordem original das linhas.
3. **`definition_of_done` / `acceptance_criteria`** — derivados do texto que a própria linha já
   trazia (`missing_scope` quando existe gap; `implemented_scope`/`feature_intent`/`test_evidence`
   quando não há gap declarado), não de texto genérico solto. Onde `missing_scope` já descrevia a
   lacuna, o DoD reaproveita essa descrição quase literalmente — é a fonte mais confiável disponível
   para "o que falta", vinda de quem fez o levantamento original do código.

## O que **não** foi preenchido — e por quê

**As colunas de correlação clínica/científica (`funcao_deficit_tdah`, `fonte_clinica`,
`fonte_cientifica`, `funcao_executiva_cognitiva`, `evidencia`, `impacto_operacional_*`,
`principio_compensatorio`, `classe_epistemica`, `estado_validacao`, `correlation_status`) foram
deixadas exatamente como chegaram — `PENDING_RESEARCH`/`PENDING_TRIANGULATION`.**

Essa é a mesma divisão de responsabilidade já registrada em
[`docs/checklist/README.md`](../checklist/README.md#o-que-foi-preenchido-nesta-versão): mapear uma
feature de produto a um déficit específico de função executiva do TDAH, com fonte clínica/
científica real e triangulação (`A · Observado`, `B · Verificável`, `E · Inferido`), é trabalho de
pesquisa clínica/produto — não de engenharia. Preencher essas 15 colunas × 100 linhas sem
literatura real por trás seria fabricar evidência científica num documento que o próprio schema
trata como epistemicamente sensível (`classe_epistemica`, `estado_validacao` existem exatamente
para impedir isso). Ficam como estão, sinalizadas, não escondidas.

## Contexto de origem

Os dois memorandos de pesquisa que acompanharam esta matriz —
**OPS-CAP-001** (viabilidade computacional de um motor de capacidade/previsão baseado em execução
atômica observada) e **REV-MODEL-003** (TAM/SAM/SOM probabilístico para trabalhadores brasileiros
neurodivergentes) — não geram linhas nesta matriz diretamente, mas influenciam a leitura de duas
famílias de `product_domain` já presentes: `Capacidade` (que hoje é filtro de elegibilidade no
dispatcher — RF-025 — e é exatamente a camada que OPS-CAP-001 propõe evoluir para previsão
probabilística P50/P85/P95) e o próprio contrato `Cycle 72h` (`P0-FINAL-03`). Ver o resumo executivo
em [`docs/EXECUTIVE_SUMMARY.md`](../EXECUTIVE_SUMMARY.md) para a síntese completa.
