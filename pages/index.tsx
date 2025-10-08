import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
  // 🔍 Lista das variáveis essenciais
  const requiredEnv = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
  ]

  // 🔎 Log no servidor (visível nos Logs da Vercel)
  console.log('===== VARIÁVEIS DE AMBIENTE DETECTADAS PELA VERCEL =====')
  requiredEnv.forEach((key) => {
    if (process.env[key]) {
      console.log(`${key}: OK ✅`)
    } else {
      console.log(`${key}: MISSING ❌`)
    }
  })
  console.log('=========================================================')

  const missing = requiredEnv.filter((key) => !process.env[key])

  return {
    props: {
      envError: missing.length > 0,
      missing,
    },
  }
}

export default function Home({
  envError,
  missing,
}: {
  envError?: boolean
  missing?: string[]
}) {
  if (envError) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <h1>⚠️ Task Manager</h1>
        <p>As variáveis de ambiente necessárias não estão configuradas corretamente.</p>
        {missing && (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {missing.map((v) => (
              <li key={v}>
                <code>{v}</code>
              </li>
            ))}
          </ul>
        )}
        <p style={{ marginTop: 20 }}>
          Veja os logs do deploy na Vercel → “Functions / Logs” para detalhes.
        </p>
      </div>
    )
  }

  return (
    <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>✅ Task Manager</h1>
      <p>Todas as variáveis foram detectadas com sucesso!</p>
    </div>
  )
}
