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
      // On récupère TOUT ce qui est dans l'URL (query + hash)
      const allParams: Record<string, string> = {}
      searchParams.forEach((v, k) => { allParams[k] = v })
      const hash = typeof window !== 'undefined' ? window.location.hash : ''

      const supabase = createClient()

      const token_hash = searchParams.get('token_hash')
      const code = searchParams.get('code')
      const type = searchParams.get('type') || 'email'

      if (token_hash) {
        const { error } = await supabase.auth.verifyOtp({ type: type as 'email', token_hash })
        if (error) { setMessage('verifyOtp erreur: ' + error.message); return }
        setMessage('Confirmé (otp) ! Redirection...')
        setTimeout(() => router.push('/compte-confirme'), 1000)
        return
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) { setMessage('exchangeCode erreur: ' + error.message); return }
        setMessage('Confirmé (code) ! Redirection...')
        setTimeout(() => router.push('/compte-confirme'), 1000)
        return
      }

      // Rien trouvé : on montre ce qu'il y avait dans l'URL
      setMessage('Aucun token. Query=' + JSON.stringify(allParams) + ' Hash=' + hash)
    }
    confirm()
  }, [searchParams, router])

  return (
    <main style={{ maxWidth: 520, margin: '80px auto', padding: '0 24px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontFamily: 'Oswald, sans-serif' }}>Confirmation du compte</h1>
      <p style={{ color: 'var(--text-dim)', marginTop: 20, wordBreak: 'break-all' }}>{message}</p>
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