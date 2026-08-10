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
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-visual">
            <div className="auth-badge"><span className="dot"></span>AutoWelt</div>

            <svg className="auth-globe" viewBox="0 0 200 200" fill="none" stroke="#5b9bf0" strokeWidth="1.2">
              <circle cx="100" cy="100" r="85" />
              <ellipse cx="100" cy="100" rx="38" ry="85" />
              <ellipse cx="100" cy="100" rx="72" ry="85" />
              <line x1="15" y1="100" x2="185" y2="100" />
              <line x1="28" y1="55" x2="172" y2="55" />
              <line x1="28" y1="145" x2="172" y2="145" />
            </svg>

            <h2>{t.auth.visualTitle} <span className="accent">AutoWelt</span>.</h2>

            <div className="auth-pts">
              <div className="auth-pt"><span className="ic">✓</span> {t.auth.perk1}</div>
              <div className="auth-pt"><span className="ic">♡</span> {t.auth.perk2}</div>
              <div className="auth-pt"><span className="ic">★</span> {t.auth.perk3}</div>
            </div>
          </div>

          <div className="auth-form-side">
            <div className="auth-logo"><span className="b">auto</span><span className="o">welt</span></div>
            <h1>{t.auth.signupTitle}</h1>
            <p className="auth-sub">{t.auth.signupSub}</p>

            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label>{t.auth.email}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="vous@email.com" />
              </div>
              <div className="auth-field">
                <label>{t.auth.password}</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" />
              </div>

              {message && <div className={`auth-msg ${message.type}`} style={{ marginTop: 14 }}>{message.text}</div>}

              <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: 18 }}>
                {loading ? t.auth.signupLoading : t.auth.signupBtn}
              </button>
            </form>

            <div className="auth-switch">{t.auth.alreadyHaveAccount} <a href="/connexion">{t.auth.loginBtn}</a></div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}