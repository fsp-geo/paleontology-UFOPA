# Paleontology UFOPA

Aplicacao web em Next.js para o portal institucional de paleontologia da UFOPA, com foco em acervo digital, portal interno, dashboards academicos, publicacoes e prestacao de contas.

## Rodar localmente

Pre-requisito: Node.js 20+ e npm.

1. Copie `.env.example` para `.env.local`.
2. Para testar so a interface, defina `NEXT_PUBLIC_LOCAL_DEMO=true`.
3. Instale as dependencias com `npm install`.
4. Inicie com `npm run dev`.
5. Acesse `http://localhost:3000`.

## Modo demo local

Quando `NEXT_PUBLIC_LOCAL_DEMO=true` ou quando as chaves do Supabase nao estiverem configuradas, o projeto abre em modo demonstracao:

- bypass de autenticacao real
- portal acessivel localmente
- rotas de API respondendo com dados mockados

## Integracao real

Para usar autenticacao e banco reais, preencha no `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `DATABASE_URL`
- `DIRECT_URL`

Depois disso, opcionalmente defina `NEXT_PUBLIC_LOCAL_DEMO=false`.

## Deploy na Vercel

Para subir o projeto com seguranca:

1. Conecte o repositório do GitHub na Vercel.
2. Configure as variaveis de ambiente abaixo no projeto da Vercel:
   - `NEXT_PUBLIC_LOCAL_DEMO=false`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`
   - `DATABASE_URL`
   - `DIRECT_URL`
3. Em `NEXT_PUBLIC_SITE_URL`, use a URL publica do deploy.
4. O build ja executa `prisma generate` automaticamente antes do `next build`.
5. Depois do primeiro deploy, teste:
   - login
   - logout
   - permissao por perfil
   - convites
   - dashboard do aluno
