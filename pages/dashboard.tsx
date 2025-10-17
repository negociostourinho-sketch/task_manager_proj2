import { getSession } from "next-auth/react"
import DonutChart from "../components/DonutChart"
import { useEffect, useState } from "react"

export default function Dashboard({ user }: any) {
  const [projects, setProjects] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects")
        if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
        const data = await res.json()
        setProjects(data)
      } catch (err: any) {
        console.error("❌ Erro ao carregar projetos:", err.message)
        setError("Erro ao carregar dados.")
      }
    }
    fetchProjects()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">
        Bem-vindo, {user?.name ?? "Usuário"}
      </h1>

      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Resumo Geral
          </h2>
          <DonutChart
            data={[
              { name: "Atrasadas", value: 2 },
              { name: "Concluídas", value: 5 },
              { name: "Futuras", value: 3 },
            ]}
            total={10}
          />
        </div>
      )}
    </div>
  )
}

export async function getServerSideProps(context: any) {
  try {
    const session = await getSession(context)

    if (!session) {
      console.warn("⚠️ Sessão ausente - redirecionando para login.")
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      }
    }

    console.log("✅ Sessão SSR detectada:", session.user?.email)

    return {
      props: {
        user: session.user,
      },
    }
  } catch (err: any) {
    console.error("❌ Erro no getServerSideProps:", err.message)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }
}
