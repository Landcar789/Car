import { createClient } from '@/lib/supabase/server'

export default async function TestSupabase() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('vehicles').select('*')

  return (
    <main style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Test connexion Supabase</h1>

      {error ? (
        <p style={{ color: 'crimson' }}>❌ Erreur : {error.message}</p>
      ) : (
        <>
          <p style={{ color: 'green' }}>
            ✅ Connexion OK — {data?.length} véhicule(s) trouvé(s)
          </p>
          <pre style={{ background: '#f4f4f4', padding: 16 }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </>
      )}
    </main>
  )
}