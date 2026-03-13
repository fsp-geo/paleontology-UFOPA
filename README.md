# Magellan Operational Control

Aplicacao web em Next.js para acompanhamento operacional de sondagem, furos, sondas e indicadores de produtividade.

## Rodar localmente

Pre-requisito: Node.js 20+ e npm.

1. Copie `.env.example` para `.env.local`.
2. Para testar so a interface, mantenha `NEXT_PUBLIC_LOCAL_DEMO=true`.
3. Instale as dependencias com `npm install`.
4. Inicie com `npm run dev`.
5. Acesse `http://localhost:3000`.

## Modo demo local

Quando `NEXT_PUBLIC_LOCAL_DEMO=true` ou quando as chaves do Supabase nao estiverem configuradas, o projeto abre em modo demonstracao:

- bypass de login
- dashboard acessivel localmente
- rotas de API respondendo com dados mockados

## Integracao real

Para usar autenticacao e banco reais, preencha no `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`
- `DIRECT_URL`

Depois disso, opcionalmente defina `NEXT_PUBLIC_LOCAL_DEMO=false`.
