import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
  const requiredEnv = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'SUPABASE_URL',
    'PUBLIC_SUPABASE_ANON_KEY',
  ]

  const missing = requiredEnv.filter((key) => !process.env[key])

  if (missing.length > 0) {
    console.warn('⚠️ Missing environment variables:', missing)
    return {
      props: {
        envError: missing.length > 0,
        missing,
      },
    }
  }

  // Se todas as variáveis estão corretas, renderiza normalmente
  return {
    props: {
      envError: false,
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
        <p>Verifique as Environment Variables no painel da Vercel (Settings → Environment Variables → Production)</p>
      </div>
    )
  }

  // ✅ Aqui você pode colocar a tela principal (login, dashboard, etc.)
  return (
    <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Task Manager</h1>
      <p>Bem-vindo!</p>
      <a
        href="/login"
        style={{
          display: 'inline-block',
          marginTop: 20,
          padding: '10px 20px',
          background: '#2563eb',
          color: 'white',
          borderRadius: 8,
          textDecoration: 'none',
        }}
      >
        Ir para Login
      </a>
    </div>
  )
}
