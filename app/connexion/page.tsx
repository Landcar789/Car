'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/LanguageContext'

export default function ConnexionPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 400, margin: '60px auto', padding: '0 24px', fontFamily: 'Inter, sans-serif' }}>
        <h1 style={{ fontFamily: 'Oswald, sans-serif' }}>{t.auth.loginTitle}</h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email"
            placeholder={t.auth.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: 10, fontSize: 16 }}
          />
          <input
            type="password"
            placeholder={t.auth.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: 10, fontSize: 16 }}
          />
          <button type="submit" disabled={loading} style={{ padding: 10, fontSize: 16 }}>
            {loading ? t.auth.loginLoading : t.auth.loginBtn}
          </button>
        </form>

        {error && <p style={{ color: 'crimson', marginTop: 16 }}>{error}</p>}
        <p style={{ marginTop: 16 }}>
          <a href="/mot-de-passe-oublie">{t.auth.forgotPassword}</a>
        </p>

        <p style={{ marginTop: 20 }}>
          {t.auth.noAccount} <a href="/inscription">{t.auth.signupLink}</a>
        </p>
      </main>
      <Footer />
    </>
  )
}