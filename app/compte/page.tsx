import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default async function ComptePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 600, margin: '60px auto', padding: '0 24px', fontFamily: 'Inter, sans-serif' }}>
        <h1 style={{ fontFamily: 'Oswald, sans-serif' }}>Mon compte</h1>
        <p>✅ Connecté en tant que : <strong>{user.email}</strong></p>
        <p style={{ color: 'var(--text-dim)', fontSize: 14, marginTop: 20 }}>
          Vos favoris et commandes s&apos;afficheront ici prochainement.
        </p>
      </main>
      <Footer />
    </>
  )
}