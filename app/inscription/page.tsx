'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/lib/LanguageContext'

export default function InscriptionPage() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })

    setLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: t.auth.signupSuccessFull })
    }
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 400, margin: '60px auto', padding: '0 24px', fontFamily: 'Inter, sans-serif' }}>
        <h1 style={{ fontFamily: 'Oswald, sans-serif' }}>{t.auth.signupTitle}</h1>

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
            placeholder={t.auth.passwordMin}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ padding: 10, fontSize: 16 }}
          />
          <button type="submit" disabled={loading} style={{ padding: 10, fontSize: 16 }}>
            {loading ? t.auth.signupLoading : t.auth.signupBtn}
          </button>
        </form>

        {message && (
          <p style={{ color: message.type === 'success' ? 'green' : 'crimson', marginTop: 16 }}>
            {message.text}
          </p>
        )}
        <p style={{ marginTop: 20 }}>
          {t.auth.alreadyHaveAccount} <a href="/connexion">{t.auth.loginBtn}</a>
        </p>
      </main>
      <Footer />
    </>
  )
}