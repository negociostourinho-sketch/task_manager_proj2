import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import authOptions from './auth/[...nextauth]'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  switch (req.method) {
    case 'GET':
      return await getProjects(res)
    case 'POST':
      return await createProject(req, res)
    default:
      return res.status(405).json({ error: 'Método não permitido' })
  }
}

async function getProjects(res: NextApiResponse) {
  try {
    const projects = await prisma.project.findMany({
      include: {
        tasks: true,
        checklists: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const formatted = projects.map((project) => {
      const overdueTasks = project.tasks.filter((t) => t.status === 'OVERDUE').length
      const completedTasks = project.tasks.filter((t) => t.status === 'COMPLETED').length
      const upcomingTasks = project.tasks.filter((t) => t.status === 'PENDING').length

      const overdueChecklists = project.checklists.filter((c) => c.status === 'OVERDUE').length
      const completedChecklists = project.checklists.filter((c) => c.status === 'COMPLETED').length
      const upcomingChecklists = project.checklists.filter((c) => c.status === 'PENDING').length

      return {
        id: project.id,
        name: project.name,
        overdueTasks,
        completedTasks,
        upcomingTasks,
        overdueChecklists,
        completedChecklists,
        upcomingChecklists,
      }
    })

    return res.status(200).json(formatted)
  } catch (error) {
    console.error('Erro ao buscar projetos:', error)
    return res.status(500).json({ error: 'Erro interno ao buscar projetos' })
  }
}

async function createProject(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, description } = req.body

    if (!name) {
      return res.status(400).json({ error: 'O campo nome é obrigatório' })
    }

    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        type: 'PROJECT', // ✅ campo exigido pelo Prisma
      },
    })

    return res.status(201).json(newProject)
  } catch (error) {
    console.error('Erro ao criar projeto:', error)
    return res.status(500).json({ error: 'Erro ao criar projeto' })
  }
}
