'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { type EmailOtpType } from '@supabase/supabase-js'

function ConfirmContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setLoading(true)
    setError(null)

    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null

    if (!token_hash || !type) {
      setError('Lien invalide.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })

    if (error) {
      setError('Ce lien a déjà été utilisé ou a expiré. Réessaie de te connecter directement, ton compte est peut-être déjà confirmé.')
      setLoading(false)
    } else {
      router.push('/compte-confirme')
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: '80px auto', padding: '0 24px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontFamily: 'Oswald, sans-serif' }}>Confirmer votre compte</h1>
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
      {error && (
        <div style={{ marginTop: 20 }}>
          <p style={{ color: 'crimson', fontSize: 13.5 }}>{error}</p>
          <a href="/connexion" style={{ color: 'var(--petrol)', fontSize: 13.5 }}>Aller à la page de connexion →</a>
        </div>
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