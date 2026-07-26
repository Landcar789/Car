'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

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
        <div>Allensteiner Str. 26a, Kehl</div>
        <div className="right">
          <a href="https://www.tiktok.com/@deustchlandautocar1" target="_blank" rel="noopener noreferrer" className="infobar-icon" title="TikTok">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48Z"/></svg>
            TikTok
          </a>
          <a href="https://signal.me/#eu/WSXlnFmOYijUqV5fXOh56rNX7AGVCgjmnhjE0xv6SHIiuAKxcp5Gcplaa8QUIgS7" target="_blank" rel="noopener noreferrer" className="infobar-icon" title="Signal">
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
            <Link href="/faq" onClick={() => setMenuOpen(false)}>Contact</Link>
            <Link href="/faq" onClick={() => setMenuOpen(false)}>Service après-vente</Link>
            <Link href="/compte" onClick={() => setMenuOpen(false)}>Mes favoris</Link>
            <Link href="/compte" onClick={() => setMenuOpen(false)}>Mes commandes</Link>
            <div className="divider"></div>
            <Link href="/faq" onClick={() => setMenuOpen(false)}>FAQ</Link>
            <Link href="/faq" onClick={() => setMenuOpen(false)}>Aide</Link>
          </div>
        </div>

        {userEmail ? (
          <Link href="/compte" className="login-btn" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <User size={15} />
            Mon compte
          </Link>
        ) : (
          <Link href="/connexion" className="login-btn">Se connecter</Link>
        )}
      </header>
    </>
  )
}