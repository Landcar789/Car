'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/LanguageContext'

export default function LogoutButton() {
  const router = useRouter()
  const { t } = useLanguage()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        background: 'transparent',
        border: '1px solid var(--line)',
        color: 'var(--text)',
        padding: '10px 18px',
        borderRadius: 6,
        fontSize: 13.5,
        fontWeight: 600,
        cursor: 'pointer',
        marginTop: 16,
      }}
    >
      {t.account.logout}
    </button>
  )
}