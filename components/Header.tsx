'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/LanguageContext'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const { lang, setLang, t } = useLanguage()
  const pathname = usePathname()

  const onAuthPage = pathname === '/connexion' || pathname === '/inscription'

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <>
      <div className="infobar">
        <div className="infobar-address">{t.header.address}</div>
        <div className="right">
          <div className="lang-switch">
            <button className={lang === 'fr' ? 'active' : ''} onClick={() => setLang('fr')} title="Français">FR</button>
            <button className={lang === 'de' ? 'active' : ''} onClick={() => setLang('de')} title="Deutsch">DE</button>
          </div>
          <a href="https://services.zangi.com/dl/conversation/2620547363" target="_blank" rel="noopener noreferrer" className="infobar-icon" title="Zangi">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Zangi
          </a>
          <a href="https://signal.me/#eu/XOOLpKZMXvAdh4IUQ8EyLHATucwsJZa28mxn6YXd7LgxoFbj5v5B3bY7QIQ_0umM" target="_blank" rel="noopener noreferrer" className="infobar-icon" title="Signal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            Signal
          </a>
        </div>
      </div>

      <header className="site-header">
        <div className="left-controls">
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu size={20} strokeWidth={2} />
          </div>
          <Link href="/" className="brand">
            <Image src="/assets/logo.jpg" alt="Deutschland Auto Car" width={70} height={90} style={{ objectFit: 'contain', height: 64, width: 'auto' }} priority />
          </Link>
          <div className={`side-menu ${menuOpen ? 'open' : ''}`}>
            <Link href="/compte" onClick={() => setMenuOpen(false)}>{t.header.favorites}</Link>
            <Link href="/compte" onClick={() => setMenuOpen(false)}>{t.header.orders}</Link>
            <div className="divider"></div>
            <Link href="/faq" onClick={() => setMenuOpen(false)}>{t.header.faq}</Link>
          </div>
        </div>

        {userEmail ? (
          <Link href="/compte" className="login-btn" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <User size={15} />
            {t.header.myAccount}
          </Link>
        ) : (
          !onAuthPage && <Link href="/connexion" className="login-btn">{t.header.login}</Link>
        )}
      </header>
    </>
  )
}