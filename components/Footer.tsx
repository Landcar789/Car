'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="site-footer">
      <div className="foot-wrap">
        <div>
          <b>AUTOWELT</b><br />
          Allensteiner Str. 26a<br />
          77694 Kehl, Allemagne
        </div>

        <div>
          <div className="foot-social">
            <a href="https://services.zangi.com/dl/conversation/2620547363" target="_blank" rel="noopener noreferrer" title="Zangi">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </a>
            <a href="https://signal.me/#eu/XOOLpKZMXvAdh4IUQ8EyLHATucwsJZa28mxn6YXd7LgxoFbj5v5B3bY7QIQ_0umM" target="_blank" rel="noopener noreferrer" title="Signal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </a>
          </div>
          <p style={{ margin: '10px 0 0', fontSize: 12.5 }}>{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}