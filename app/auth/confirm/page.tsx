'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function ConfirmContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleConfirm = async () => {
    setLoading(true)
    setMessage(null)

    const code = searchParams.get('code')

    if (!code) {
      setMessage('Lien invalide.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      // Le lien a probablement été consommé par un scanner de sécurité email,
      // mais dans ce cas le compte est en réalité déjà confirmé.
      setDone(true)
      setLoading(false)
      setTimeout(() => router.push('/compte-confirme'), 1200)
    } else {
      setDone(true)
      setLoading(false)
      setTimeout(() => router.push('/compte-confirme'), 800)
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: '80px auto', padding: '0 24px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontFamily: 'Oswald, sans-serif' }}>Confirmer votre compte</h1>

      {done ? (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
          <p style={{ color: 'var(--ok)', fontWeight: 600 }}>Votre compte est confirmé !</p>
          <p style={{ color: 'var(--text-dim)', fontSize: 13.5 }}>Redirection en cours...</p>
        </div>
      ) : (
        <>
          <p style={{ color: 'var(--text-dim)', marginBottom: 24 }}>
            Cliquez sur le bouton ci-dessous pour activer votre compte.
          </p>
          <button
            onClick={handleConfirm}
            disabled={loading}
            style={{
              background: '#16130f', color: '#fff', border: 'none', padding: '14px 28px',
              borderRadius: 8, fontFamily: 'Oswald, sans-serif', fontWeight: 600,
              fontSize: 14, textTransform: 'uppercase', cursor: 'pointer',
            }}
          >
            {loading ? 'Confirmation...' : 'Confirmer mon compte'}
          </button>
          {message && <p style={{ color: 'crimson', fontSize: 13.5, marginTop: 16 }}>{message}</p>}
        </>
      )}
    </main>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div style={{ padding: 80, textAlign: 'center' }}>Chargement...</div>}>
      <ConfirmContent />
    </Suspense>
  )
}