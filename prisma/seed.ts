import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('123456', 10)

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@example.com',
      password,
      role: 'ADMIN'
    }
  })

  await prisma.project.create({
    data: {
      type: 'PROJECT',
      name: 'Projeto Exemplo',
      description: 'Projeto criado por seed',
      value: 1000
    }
  })

  console.log('Seed concluído')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
