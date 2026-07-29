'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/LanguageContext'

export default function NouveauMotDePasse() {
  const { t } = useLanguage()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setDone(true)
      setTimeout(() => router.push('/connexion'), 2000)
    }
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 400, margin: '60px auto', padding: '0 24px', fontFamily: 'Inter, sans-serif' }}>
        <h1 style={{ fontFamily: 'Oswald, sans-serif' }}>{t.auth.newPasswordTitle}</h1>

        {done ? (
          <p style={{ color: 'green', marginTop: 16 }}>{t.auth.newPasswordDone}</p>
        ) : (
          <>
            <p style={{ color: 'var(--text-dim)', marginBottom: 20 }}>{t.auth.newPasswordText}</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="password"
                placeholder={t.auth.newPasswordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{ padding: 10, fontSize: 16 }}
              />
              <button type="submit" disabled={loading} style={{ padding: 10, fontSize: 16 }}>
                {loading ? t.auth.newPasswordSaving : t.auth.newPasswordBtn}
              </button>
            </form>
            {error && <p style={{ color: 'crimson', marginTop: 16 }}>{error}</p>}
          </>
        )}
      </main>
      <Footer />
    </>
  )
}