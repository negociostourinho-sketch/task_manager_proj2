import { getSession, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import DonutChart from "@/components/DonutChart"

interface Project {
  id: string
  name: string
  overdueTasks: number
  completedTasks: number
  upcomingTasks: number
  overdueChecklists: number
  completedChecklists: number
  upcomingChecklists: number
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session) fetchProjects()
  }, [session])

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects")
      if (!res.ok) throw new Error("Erro ao buscar projetos.")
      const data = await res.json()
      setProjects(data)
    } catch (err) {
      console.error(err)
      setError("Erro ao carregar projetos.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Carregando Dashboard...
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-700 mb-2">
          Você precisa estar logado para acessar o dashboard.
        </p>
        <a
          href="/login"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Ir para o Login
        </a>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    )
  }

  const userName =
    session?.user?.name?.split(" ")[0] || "usuário"
  const totalTasks = projects.reduce(
    (acc, p) =>
      acc +
      p.overdueTasks +
      p.completedTasks +
      p.upcomingTasks +
      p.overdueChecklists +
      p.completedChecklists +
      p.upcomingChecklists,
    0
  )

  const chartData = [
    {
      name: "Atrasados",
      value: projects.reduce(
        (acc, p) => acc + p.overdueTasks + p.overdueChecklists,
        0
      ),
      color: "#EF4444",
    },
    {
      name: "Concluídos",
      value: projects.reduce(
        (acc, p) => acc + p.completedTasks + p.completedChecklists,
        0
      ),
      color: "#10B981",
    },
    {
      name: "Futuros",
      value: projects.reduce(
        (acc, p) => acc + p.upcomingTasks + p.upcomingChecklists,
        0
      ),
      color: "#3B82F6",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <a
          href="/api/auth/signout"
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Sair
        </a>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Resumo Geral
        </h2>
        <DonutChart data={chartData} total={totalTasks} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {project.name}
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Total de tarefas e checklists:
            </p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>
                🔴 Atrasados: {project.overdueTasks + project.overdueChecklists}
              </li>
              <li>
                🟢 Concluídos:{" "}
                {project.completedTasks + project.completedChecklists}
              </li>
              <li>
                🔵 Futuros:{" "}
                {project.upcomingTasks + project.upcomingChecklists}
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
// 🔒 SSR: evita erro de build e garante autenticação
export async function getServerSideProps(context: any) {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }
  return {
    props: { session },
  }
}