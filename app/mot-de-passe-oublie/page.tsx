'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/LanguageContext'

export default function MotDePasseOublie() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/nouveau-mot-de-passe`,
    })

    setLoading(false)
    setSent(true)
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 400, margin: '60px auto', padding: '0 24px', fontFamily: 'Inter, sans-serif' }}>
        <h1 style={{ fontFamily: 'Oswald, sans-serif' }}>{t.auth.resetTitle}</h1>

        {sent ? (
          <p style={{ color: 'green', marginTop: 16 }}>{t.auth.resetSent}</p>
        ) : (
          <>
            <p style={{ color: 'var(--text-dim)', marginBottom: 20 }}>{t.auth.resetText}</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="email"
                placeholder={t.auth.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ padding: 10, fontSize: 16 }}
              />
              <button type="submit" disabled={loading} style={{ padding: 10, fontSize: 16 }}>
                {loading ? t.auth.resetSending : t.auth.resetBtn}
              </button>
            </form>
          </>
        )}

        <p style={{ marginTop: 20 }}>
          <a href="/connexion">← {t.auth.loginBtn}</a>
        </p>
      </main>
      <Footer />
    </>
  )
}