'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function InscriptionPage() {
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
      setMessage({
        type: 'success',
        text: 'Compte créé ! Vérifie ta boîte mail et clique sur le lien de confirmation.',
      })
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: '60px auto', fontFamily: 'sans-serif' }}>
      <h1>Inscription</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 10, fontSize: 16 }}
        />
        <input
          type="password"
          placeholder="Mot de passe (min. 6 caractères)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          style={{ padding: 10, fontSize: 16 }}
        />
        <button type="submit" disabled={loading} style={{ padding: 10, fontSize: 16 }}>
          {loading ? 'Création en cours...' : "S'inscrire"}
        </button>
      </form>

      {message && (
        <p style={{ color: message.type === 'success' ? 'green' : 'crimson', marginTop: 16 }}>
          {message.text}
        </p>
      )}
    </main>
  )
}