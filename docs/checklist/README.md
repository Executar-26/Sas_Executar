# Checklist de entrypoint do projeto

**[`EXECUTAR_projetosaasentrypoint.xlsx`](./EXECUTAR_projetosaasentrypoint.xlsx)** — planilha
única de entrada estruturada do projeto: um formulário de 7 domínios que, uma vez preenchido,
serve como fonte da verdade compacta para quem (humano ou agente de AI) entra no projeto sem
contexto prévio.

## Origem

Convertida de um modelo em branco (`EXECUTAR_projetosaasentrypoint_MODELO_EM_BRANCO 2.numbers`,
Apple Numbers) para `.xlsx` — a própria aba `00_Leia-me` do arquivo já declara compatibilidade
com Excel/LibreOffice/Numbers como formato de intercâmbio pretendido.

## Estrutura

- **`00_Leia-me`** — instruções de uso e convenção de cores, preservadas do modelo original.
- **`01_Formulario`** — **a única aba editável.** 7 domínios, cada linha com um ID (`D#.##`) e uma
  célula "Resposta" (coluna E, preenchimento amarelo-claro). Todas as outras abas são leitura.
- **`02_Visao_Geral`**, **`03_Arquitetura_Tecnica`**, **`04_Operacao_Seguranca`** — vistas
  derivadas por domínio (rótulos herdados do modelo original).
- **`05_Indice_IDs`** — mapa reverso ID → nome do campo → domínio → aba de destino.

## O que foi preenchido nesta versão

**Domínios 2–7 (47 dos 59 campos)** — Produto, Arquitetura & Full Stack, Implementação, Operação,
Governança & Segurança, Documentação Fundacional — preenchidos com base no que já está decidido e
commitado em [`docs/PLAN.md`](../PLAN.md) e no estado real deste repositório nesta data. Onde o
plano ainda não decidiu ou implementou algo (ex.: endpoints de API reais, checklist de deploy),
a resposta diz isso explicitamente em vez de inventar conteúdo — consistente com a regra do
próprio `00_Leia-me`: "nunca invente conteúdo... se relevante, sinalize a lacuna."

**Domínio 1 — Negócio & GTM (12 campos) foi deixado em branco deliberadamente.** É a área de
responsabilidade de negócio/GTM (proposta de valor, canais de aquisição, CAC/LTV, teto de gasto de
infraestrutura) — decisões que cabem ao dono do produto, não ao agente de engenharia. O contador
de progresso na aba `01_Formulario` (`=COUNTA(E5:E85)&" / 59"`) reflete isso: 47/59.

## Lacuna conhecida, não corrigida nesta versão

O `00_Leia-me` do modelo original descreve `02_Visao_Geral`/`03_Arquitetura_Tecnica`/
`04_Operacao_Seguranca` como saídas por **fórmula** que leem de `01_Formulario`
(`=01_Formulario!D12`, por exemplo). Na prática, o modelo recebido não tinha nenhuma fórmula
implementada nessas três abas — só os rótulos/estrutura. Esta versão preserva esse estado
exatamente como recebido (não inventei a fórmula de ligação, já que a estrutura tem
inconsistências reais entre linhas — algumas mescladas, outras não — que exigiriam uma decisão de
schema, não só preenchimento de conteúdo). Se quiser que eu implemente a ligação por fórmula entre
`01_Formulario` e as três abas derivadas, isso é um passo separado e deliberado, não implícito
neste PR.
