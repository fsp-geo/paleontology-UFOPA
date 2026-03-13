const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const roles = [
  {
    code: 'admin',
    name: 'Administrador',
    description: 'Acesso total ao sistema e gerenciamento de perfis.',
  },
  {
    code: 'gestor',
    name: 'Gestor',
    description: 'Gerencia fluxos administrativos, aprovacoes e prestacao de contas.',
  },
  {
    code: 'professor',
    name: 'Professor',
    description: 'Acompanha estudantes, revisa conteudo e acessa dashboards academicos.',
  },
  {
    code: 'pesquisador',
    name: 'Pesquisador',
    description: 'Acessa conteudos internos de pesquisa e recursos do acervo.',
  },
  {
    code: 'aluno',
    name: 'Aluno',
    description: 'Acessa dashboard academico, submisssoes e feedbacks.',
  },
  {
    code: 'visitante',
    name: 'Visitante',
    description: 'Perfil basico para usuarios autenticados ainda nao aprovados.',
  },
];

async function main() {
  for (const role of roles) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: {
        name: role.name,
        description: role.description,
      },
      create: role,
    });
  }

  console.log(`Roles seeded: ${roles.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
