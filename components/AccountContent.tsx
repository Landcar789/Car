'use client'

import { useLanguage } from '@/lib/LanguageContext'
import LogoutButton from '@/components/LogoutButton'

export default function AccountContent({ email }: { email: string }) {
  const { t } = useLanguage()

  return (
    <main style={{ maxWidth: 600, margin: '60px auto', padding: '0 24px', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontFamily: 'Oswald, sans-serif' }}>{t.account.title}</h1>
      <p>✅ {t.account.connectedAs} <strong>{email}</strong></p>
      <p style={{ color: 'var(--text-dim)', fontSize: 14, marginTop: 20 }}>{t.account.soon}</p>
      <LogoutButton />
    </main>
  )
}