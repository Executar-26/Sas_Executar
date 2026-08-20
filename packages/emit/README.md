# @sas-executar/emit

**Fase:** 2 (portável como está).
**Origem:** `Executar-26/Executar-app-scanner`, `src/emit/**` (`engine.ts`, `document-factory/`,
`document-rendering/` — ~5.100 LOC).

Motor de emissão/impressão: gera SVG/HTML server-side (calendários, sprints, go-cards, portfolio
sheets, kits de impressão A4) a partir de objetos em memória — sem tocar banco, sem DOM/browser.
Roda em rotas de API Node.js (`export const runtime = "nodejs"`).

Inclui o runtime genérico "TECH-SCHEMA-001" (`document-factory/`): `Document Instance + Form +
View + Bindings + Scanner Manifest → materialize → CanonicalDocument V2 → renderDocument()`, com
autoridade de escrita por campo e hashing determinístico.

**Nota:** o pipeline de renderização de PDF (`server/pdf-contract.ts` no AppScanner) define uma
interface `PdfRenderService` sem implementação concreta — `@sparticuz/chromium` está nas
dependências mas não é usado em lugar nenhum. Não assumir que geração de PDF funciona; é um ponto
em aberto real, não um detalhe de porte.
