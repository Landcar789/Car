'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function ConfirmContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [message, setMessage] = useState('Confirmation en cours...')

  useEffect(() => {
    const confirm = async () => {
      const token_hash = searchParams.get('token_hash')
      const type = searchParams.get('type')

      if (!token_hash) {
        setMessage('Lien invalide.')
        return
      }

      const supabase = createClient()
      const { error } = await supabase.auth.verifyOtp({
        type: (type as 'email') ?? 'email',
        token_hash,
      })

      if (error) {
        setMessage('Erreur : ' + error.message)
      } else {
        setMessage('Compte confirmé ! Redirection...')
        setTimeout(() => router.push('/compte-confirme'), 1000)
      }
    }
    confirm()
  }, [searchParams, router])

  return (
    <main style={{ maxWidth: 420, margin: '80px auto', padding: '0 24px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontFamily: 'Oswald, sans-serif' }}>Confirmation du compte</h1>
      <div style={{ fontSize: 40, margin: '20px 0' }}>✅</div>
      <p style={{ color: 'var(--text-dim)' }}>{message}</p>
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