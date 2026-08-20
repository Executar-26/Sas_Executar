# [Pesquisa] · DATA-ADHD-PM-001 — Matriz de evidências e implicações de produto

| Campo | Valor |
|---|---|
| ID | DATA-ADHD-PM-001 |
| Tipo | Pesquisa · Matriz de evidências e implicações de produto |
| Versão | 1.0 |
| Data | 19/08/2026 |
| Fase | Síntese e correlação |
| Para | Produto · Arquitetura neuroinclusiva baseada em evidências |
| Referência | JSON AEVO · HOJE > Preencher(1).md · PMBOK® Guide 8 · NIMH · NICE · literatura científica |

Fonte de verdade das colunas de correlação clínica/científica em
[`SCHEMA_MATRIZ_PRODUTO_REPO_V2.2_P0_FINAL.csv`](./SCHEMA_MATRIZ_PRODUTO_REPO_V2.2_P0_FINAL.csv)
— ver a metodologia de mapeamento em [`README.md`](./README.md).

## Resumo executivo

- **O quê:** matriz paralela Gestão de Projetos → exigência humana → vulnerabilidade associada ao
  TDAH → impacto operacional → compensação sistêmica → decisão de produto.
- **Por quê:** testar a tese de que parte da carga normalmente deixada para o usuário pode ser
  deslocada para arquitetura, regras e automação do sistema.
- **Quem:** adultos com TDAH executando trabalho intelectual/projetos; produto, design e
  engenharia que constroem o sistema.
- **Como:** funções de projeto extraídas do documento-base e confrontadas com PMI, NIMH/NICE e
  estudos sobre funções executivas em TDAH adulto.
- **Progresso:** a hipótese central é **parcialmente sustentada** — convergência forte para
  organização, planejamento, gestão temporal, atenção sustentada e conclusão; evidência moderada
  para memória prospectiva, flexibilidade e metacognição.

## 1. Achado central

A gestão de projetos pressupõe operações cognitivas — planejar, organizar, priorizar, lembrar,
acompanhar, estimar tempo, iniciar e concluir — em domínios nos quais adultos com TDAH **podem**,
com grande heterogeneidade individual, apresentar dificuldades. O NIMH descreve em adultos
dificuldades possíveis com organização, procrastinação, planejamento, gestão de tempo, lembrança
de tarefas, manutenção de foco e conclusão de grandes projetos
([NIMH](https://www.nimh.nih.gov/health/publications/adhd-what-you-need-to-know)). Meta-análises
encontram diferenças de função executiva entre grupos com e sem TDAH, mas também mostram
heterogeneidade substancial — portanto **TDAH ≠ déficit executivo global obrigatório**
([PubMed 16116936](https://pubmed.ncbi.nlm.nih.gov/16116936/)).

O PMBOK® Guide 8 estrutura a gestão de projetos em iniciação/escopo → planejamento → execução →
monitoramento/finalização, com ênfase em governança, escopo, cronograma, stakeholders, recursos e
risco ([PMI](https://www.pmi.org/standards/pmbok)).

## 2. Matriz GP-01 a GP-11

| ID | Função de PM | Déficit TDAH associado | Evidência | Conclusão de produto (E · Inferido) |
|---|---|---|---|---|
| GP-01 | Iniciação e escopo | Organização/planejamento frágeis; procrastinação em tarefas grandes | C · moderada/forte | O sistema deve estruturar o projeto antes de pedir ao usuário que o gerencie. |
| GP-02 | Planejamento | Dificuldades de planejamento/organização | C · forte p/ associação; não universal | Decomposição deve ser função do motor, não trabalho cognitivo repetido do usuário. |
| GP-03 | Priorizar e sequenciar | Priorização/organização prejudicadas | C · moderada | Não oferecer apenas uma lista: oferecer "próxima ação recomendada + por quê". |
| GP-04 | Cronograma e prazos | Má gestão de tempo; percepção temporal heterogênea | C · moderada/heterogênea | Tempo deve ser observado pelo sistema, não presumido pelo usuário. |
| GP-05 | Iniciar execução | Procrastinação; dificuldade de iniciar tarefas | C · moderada | A unidade de interface deve começar executável, não apenas informativa. |
| GP-06 | Execução | Distratibilidade; dificuldade em manter-se na tarefa | B/C · forte | 1 ação dominante + fila secundária é arquitetura coerente com a evidência. |
| GP-07 | Monitorar execução e progresso | Esquecimento de tarefas; memória prospectiva | B/C · moderada/forte | O sistema deve ser memória externa do estado operacional. |
| GP-08 | Detectar desvios e adaptar | Dificuldade de set-shifting (heterogênea) | B/C · moderada | Permitir não-linearidade controlada, não navegação caótica. |
| GP-09 | Comunicação e stakeholders | Esquecimento/distração/impulsividade | C + E p/ efeito específico em PM | Centralizar contexto é mais importante que simplesmente adicionar chat. |
| GP-10 | Finalização e avaliação | Dificuldade em finalizar; diferenças metacognitivas | B/C · moderada | DONE deve ser uma transição verificável, não uma sensação de conclusão. |
| GP-11 | Capacidade e forecasting | Má gestão temporal; desalinhamento metacognitivo possível | C p/ vulnerabilidade; E p/ solução | EB = ação, tempo = medida observada é decisão de operações, não tratamento clínico. |

Fontes clínicas/científicas completas (citação, URL, classe de evidência) por linha estão em
[`SCHEMA_MATRIZ_PRODUTO_REPO_V2.2_P0_FINAL.csv`](./SCHEMA_MATRIZ_PRODUTO_REPO_V2.2_P0_FINAL.csv),
colunas `fonte_clinica`/`fonte_cientifica`/`evidencia` — reproduzidas ali por `GP-0X`, não
transcritas linha a linha aqui para evitar duplicação divergente entre os dois arquivos.

## 3. Síntese como sistema

```text
GESTÃO DE PROJETOS → OPERAÇÕES COGNITIVAS (planejar, organizar, priorizar, sequenciar, lembrar,
iniciar, sustentar atenção, estimar/acompanhar tempo, monitorar, adaptar, finalizar)
      ↓
TDAH pode aumentar vulnerabilidade em parte desses domínios (heterogêneo, não universal)
      ↓
ATRITO OPERACIONAL (início tardio, planejamento incompleto, prioridades instáveis, múltiplos
trabalhos abertos, esquecimento de intenções, perda de contexto, atraso, fechamento incompleto)
      ↓
ARQUITETURA COMPENSATÓRIA (externalizar, decompor, priorizar, ordenar, lembrar, limitar WIP,
mostrar estado, registrar histórico, prever com dados observados)
```

A última seta — de arquitetura compensatória para "maior fração da capacidade cognitiva
disponível para execução" — é **E · hipótese de produto**, ainda não testada empiricamente.

## 4. Correções epistêmicas à tese original

| Hipótese | Estado após pesquisa |
|---|---|
| Dificuldades de planejamento/organização são relevantes no TDAH adulto | Sustentado — C |
| Gestão de tempo pode ser problemática | Sustentado — C |
| Atenção sustentada pode prejudicar execução prolongada | Sustentado — B/C |
| Memória prospectiva pode afetar follow-through | Sustentado — B |
| Flexibilidade/set-shifting pode ser afetada | Sustentado, heterogêneo — B/C |
| Autoavaliação cognitiva sempre é imprecisa no TDAH | **Não sustentado como universal** |
| Sistema deve automaticamente priorizar | E · decisão de produto plausível, não conclusão clínica |
| WIP=1 | E · política de arquitetura, não prescrição clínica |
| Impressão/analógico corrige memória de trabalho | E · hipótese de design, ainda não validada |
| Ciclos fixos corrigem planejamento de longo prazo | E · hipótese de produto, não resultado clínico demonstrado |
| Throughput histórico deve substituir percepção subjetiva de capacidade | E · forte decisão de operações, precisa validação no produto |

## 5. Conclusão de produto/design

Formulação **não** sustentada: *"pessoas com TDAH não conseguem gerir projetos."*

Formulação sustentada pela evidência: **a gestão convencional de projetos transfere ao operador
humano uma quantidade relevante de funções de planejamento, organização, memória prospectiva,
atenção, gestão temporal e autocontrole. Alguns desses domínios apresentam vulnerabilidades
estatisticamente documentadas em adultos com TDAH. Há fundamento para investigar uma arquitetura
de gestão que externalize e automatize parte dessas operações, preservando decisão e autonomia do
usuário.**

Tese arquitetural resultante: **o usuário executa; o sistema sustenta a execução.**

O NICE reconhece modificações ambientais como parte relevante da redução do impacto funcional do
TDAH — reduzir períodos contínuos de foco exigido e reforçar informação verbal com informação
escrita ([NICE NG87](https://www.nice.org.uk/guidance/ng87/chapter/recommendations)). Isso não
valida diretamente as features do EXECUTAR, mas fortalece o princípio geral: o ambiente pode ser
configurado para reduzir demandas desnecessárias sobre o indivíduo.

### Classificação final

- **C · Publicado:** existe sobreposição relevante entre demandas cognitivas da gestão de
  projetos e domínios em que adultos com TDAH podem apresentar dificuldades.
- **E · Inferido:** um sistema que absorva planejamento repetitivo, memória operacional externa,
  priorização, controle de estado e forecasting *pode* reduzir fricção operacional.
- **Ainda não verificado:** que essa arquitetura produza aumento mensurável de execução,
  conclusão ou produtividade em usuários com TDAH reais — esse é o claim que o produto deverá
  testar.

## Fontes citadas

1. NIMH — [ADHD in Adults: 4 Things to Know](https://www.nimh.nih.gov/health/publications/adhd-what-you-need-to-know)
2. [PubMed 16116936](https://pubmed.ncbi.nlm.nih.gov/16116936/) — meta-análise de função executiva em TDAH adulto
3. PMI — [PMBOK® Guide](https://www.pmi.org/standards/pmbok)
4. [PMC2957278](https://pmc.ncbi.nlm.nih.gov/articles/PMC2957278/) — Adult ADHD: Diagnosis, Differential Diagnosis, and Treatment
5. [PubMed 20667287](https://pubmed.ncbi.nlm.nih.gov/20667287/) — papel da função executiva e autorregulação
6. [PMC9962130](https://pmc.ncbi.nlm.nih.gov/articles/PMC9962130/) — Time Perception in Adult ADHD: Findings from a Decade
7. [PubMed 23484020](https://pubmed.ncbi.nlm.nih.gov/23484020/) — Complex prospective memory in adults with ADHD
8. [PubMed 26206605](https://pubmed.ncbi.nlm.nih.gov/26206605/) — Sustained attention in adult ADHD: time-on-task effects
9. [PubMed 22613368](https://pubmed.ncbi.nlm.nih.gov/22613368/) — Set-shifting in adults with ADHD
10. [Springer 10.1007/s00702-020-02293-w](https://link.springer.com/article/10.1007/s00702-020-02293-w) — Metacognition in adult ADHD
11. NICE — [ADHD: diagnosis and management (NG87)](https://www.nice.org.uk/guidance/ng87/chapter/recommendations)
