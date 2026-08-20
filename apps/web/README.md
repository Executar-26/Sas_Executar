# apps/web

Next.js App Router — nasce na Fase 0 (scaffold + CI/CD + observabilidade + rate limiting) e
ganha auth real na Fase 1. Estrutura de rota alvo (ver `docs/PLAN.md` §1):

```
app/(dashboard)/   produto autenticado
app/(login)/       auth (Supabase Auth: e-mail/senha, magic link, Google, Apple)
app/api/{stripe,team,user,emit,ai,resolve,qr,mcp}/
components/ui/     shadcn/ui (de @sas-executar/ui)
lib/{auth,db,payments}/
```

Auth é **Supabase Auth**, não a JWT/bcrypt hand-rolled do `nextjs/saas-starter` — ver
`docs/PLAN.md` §4 para o que é descartado vs. adaptado dessa referência.

Vazio propositalmente até a Fase 0 começar de verdade (não vale gerar um `create-next-app`
genérico sem as decisões de Supabase Auth/CI/observabilidade já resolvidas — geraria retrabalho).
