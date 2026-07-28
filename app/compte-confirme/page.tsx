'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/LanguageContext'

export default function CompteConfirme() {
  const { t } = useLanguage()
  const [connected, setConnected] = useState<boolean | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setConnected(!!data.user)
    })
  }, [])

  return (
    <>
      <Header />
      <main style={{ maxWidth: 440, margin: '80px auto', padding: '0 24px', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>✅</div>
        <h1 style={{ fontFamily: 'Oswald, sans-serif' }}>{t.auth.confirmedTitle}</h1>

        {connected ? (
          <>
            <p style={{ color: 'var(--text-dim)', marginBottom: 28 }}>{t.auth.alreadyConnected}</p>
            <a href="/">
              <button
                style={{
                  background: '#16130f', color: '#fff', border: 'none', padding: '13px 28px',
                  borderRadius: 8, fontFamily: 'Oswald, sans-serif', fontWeight: 600,
                  fontSize: 14, textTransform: 'uppercase', cursor: 'pointer',
                }}
              >
                {t.auth.goHome}
              </button>
            </a>
          </>
        ) : (
          <>
            <p style={{ color: 'var(--text-dim)', marginBottom: 28 }}>{t.auth.confirmedText}</p>
            <a href="/connexion">
              <button
                style={{
                  background: '#16130f', color: '#fff', border: 'none', padding: '13px 28px',
                  borderRadius: 8, fontFamily: 'Oswald, sans-serif', fontWeight: 600,
                  fontSize: 14, textTransform: 'uppercase', cursor: 'pointer',
                }}
              >
                {t.auth.goToLogin}
              </button>
            </a>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}