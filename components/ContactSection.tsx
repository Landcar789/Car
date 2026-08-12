'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function ContactSection() {
  const { t } = useLanguage()

  return (
    <section className="contact-section" id="contact">
      <div className="contact-inner">
        <div className="contact-eyebrow">{t.contact.eyebrow}</div>
        <h2 className="contact-title">{t.contact.title}</h2>
        <p className="contact-lede">{t.contact.lede}</p>

        <div className="contact-actions">
          <a className="cbtn cbtn-wa" href="https://wa.me/4915255603028" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M.06 24l1.68-6.13A11.86 11.86 0 0 1 .16 11.9C.16 5.34 5.5 0 12.06 0a11.82 11.82 0 0 1 8.41 3.49 11.82 11.82 0 0 1 3.48 8.41c0 6.56-5.34 11.9-11.9 11.9a11.9 11.9 0 0 1-5.69-1.45L.06 24zM6.6 20.13l.36.22a9.87 9.87 0 0 0 5.03 1.38h.01c5.45 0 9.89-4.43 9.89-9.88a9.83 9.83 0 0 0-2.9-6.99 9.82 9.82 0 0 0-6.98-2.9c-5.46 0-9.9 4.44-9.9 9.89a9.86 9.86 0 0 0 1.51 5.26l.24.38-1 3.63 3.74-.98zM17.5 14.3c-.07-.12-.27-.2-.57-.35-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42z"/></svg>
            WhatsApp
          </a>
          <a className="cbtn cbtn-mail" href="mailto:autocarwelt@gmail.com">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
            Email
          </a>
        </div>

        <div className="contact-card">
          <div className="contact-card-label">{t.contact.hours}</div>
          <div className="contact-row"><span className="c-day">{t.contact.weekdays}</span><span className="c-hours open">09:00 – 18:00</span></div>
          <div className="contact-row"><span className="c-day">{t.contact.saturday}</span><span className="c-hours open">10:00 – 15:00</span></div>
          <div className="contact-row nb"><span className="c-day">{t.contact.sunday}</span><span className="c-hours closed">{t.contact.closed}</span></div>

          <div className="contact-box">
            <span className="c-line">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              Königsberger Str. 9, 77694 Kehl, Allemagne
            </span>
            <a className="c-line phone" href="tel:+4915255603028">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z"/></svg>
              +49 152 55603028
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}