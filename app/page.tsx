'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ReviewsSection from '@/components/ReviewsSection'
import { Car, ShieldCheck, Wrench, Truck, FileCheck, MessageSquare } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import FeaturedVehicles from '@/components/FeaturedVehicles'

export default function AccueilPage() {
  const [openCond, setOpenCond] = useState<number | null>(0)
  const { t } = useLanguage()

  const conditions = [
    {
      title: t.home.conditions.payment.title,
      items: [t.home.conditions.payment.item1, t.home.conditions.payment.item2, t.home.conditions.payment.item3],
    },
    {
      title: t.home.conditions.service.title,
      items: [t.home.conditions.service.item1, t.home.conditions.service.item2, t.home.conditions.service.item3],
    },
    {
      title: t.home.conditions.warranty.title,
      items: [t.home.conditions.warranty.item1],
    },
  ]

  const bigServices = [
    { icon: Car, title: t.home.services.purchase.title, desc: t.home.services.purchase.desc },
    { icon: Truck, title: t.home.services.transport.title, desc: t.home.services.transport.desc },
  ]

  const smallServices = [
    { icon: ShieldCheck, title: t.home.services.warranty.title, desc: t.home.services.warranty.desc },
    { icon: Wrench, title: t.home.services.maintenance.title, desc: t.home.services.maintenance.desc },
    { icon: FileCheck, title: t.home.services.docs.title, desc: t.home.services.docs.desc },
    { icon: MessageSquare, title: t.home.services.advice.title, desc: t.home.services.advice.desc },
  ]

  return (
    <>
      <Header />

      {/* HERO */}
      <div
        style={{
          position: 'relative',
          minHeight: 480,
          display: 'flex',
          alignItems: 'flex-end',
          padding: '0 24px 70px',
          background:
            'linear-gradient(0deg, rgba(11,20,19,0.85) 0%, rgba(11,20,19,0.55) 55%, rgba(11,20,19,0.35) 100%), url(/assets/hero.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          <div style={{ maxWidth: 560 }}>
            <div className="fade-up d1" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', marginBottom: 14 }}>
              {t.home.eyebrow}
            </div>
            <h1 className="fade-up d2" style={{ fontFamily: 'Oswald, sans-serif', fontSize: 42, fontWeight: 600, lineHeight: 1.15, margin: '0 0 18px', color: '#fff' }}>
              {t.home.title}
            </h1>
            <p className="fade-up d3" style={{ color: '#d9dedb', fontSize: 15.5, margin: '0 0 26px', maxWidth: 460 }}>
              {t.home.subtitle}
            </p>
            <div className="fade-up d4" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 30 }}>
              <a href="/marketplace" style={{ background: 'var(--gold)', color: '#211705', border: 'none', padding: '13px 24px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer', textDecoration: 'none' }}>
                {t.home.seeVehicles}
              </a>
              <a href="/faq" style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)', padding: '13px 24px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer', textDecoration: 'none' }}>
                {t.home.contactUs}
              </a>
            </div>

            {/* Carte stats flottante */}
            <div className="fade-up d4" style={{ display: 'inline-flex', gap: 26, background: 'rgba(255,255,255,0.97)', border: '1px solid var(--line)', borderRadius: 14, padding: '14px 24px', boxShadow: '0 16px 36px rgba(0,0,0,0.2)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 24, color: 'var(--text)' }}>200<span style={{ color: 'var(--gold)' }}>+</span></div>
                <div style={{ fontSize: 11.5, color: 'var(--text-dim)' }}>{t.home.statVehicles}</div>
              </div>
              <div style={{ width: 1, background: 'var(--line)' }}></div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 24, color: 'var(--text)' }}>24<span style={{ color: 'var(--gold)' }}>m</span></div>
                <div style={{ fontSize: 11.5, color: 'var(--text-dim)' }}>{t.home.statWarranty}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px 40px' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--petrol)', marginBottom: 8 }}>
            {t.home.servicesEyebrow}
          </div>
          <h2 style={{ fontFamily: 'Oswald, sans-serif', fontSize: 26, fontWeight: 600, margin: 0 }}>{t.home.servicesTitle}</h2>
        </div>
        {/* 2 grandes cartes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 16 }}>
          {bigServices.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.title} style={{ background: 'linear-gradient(135deg, var(--surface), #faf9f5)', border: '1px solid var(--line)', borderRadius: 14, padding: 26 }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(15,110,99,0.10)', color: 'var(--petrol)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={26} strokeWidth={1.8} />
                </div>
                <h3 style={{ fontFamily: 'Oswald, sans-serif', fontSize: 19, fontWeight: 600, margin: '0 0 8px' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-dim)', margin: 0, lineHeight: 1.55 }}>{s.desc}</p>
              </div>
            )
          })}
        </div>

        {/* 4 petites cartes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
          {smallServices.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.title} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, padding: 18, textAlign: 'center' }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(15,110,99,0.10)', color: 'var(--petrol)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                  <Icon size={21} strokeWidth={1.8} />
                </div>
                <h3 style={{ fontFamily: 'Oswald, sans-serif', fontSize: 14, fontWeight: 600, margin: '0 0 6px' }}>{s.title}</h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-dim)', margin: 0, lineHeight: 1.45 }}>{s.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
      <FeaturedVehicles />
      {/* PROCEDURES / CONDITIONS */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--petrol)', marginBottom: 8 }}>
            {t.home.proceduresEyebrow}
          </div>
          <h2 style={{ fontFamily: 'Oswald, sans-serif', fontSize: 26, fontWeight: 600, margin: 0 }}>{t.home.proceduresTitle}</h2>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, padding: 6 }}>
          {conditions.map((c, i) => (
            <div key={c.title} style={{ borderBottom: i < conditions.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <div
                onClick={() => setOpenCond(openCond === i ? null : i)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', cursor: 'pointer' }}
              >
                <h4 style={{ fontFamily: 'Oswald, sans-serif', fontSize: 15, fontWeight: 600, margin: 0 }}>{c.title}</h4>
                <span style={{ color: 'var(--text-dim)', fontSize: 18, transform: openCond === i ? 'rotate(45deg)' : 'none', transition: 'transform .15s' }}>+</span>
              </div>
              {openCond === i && (
                <ul style={{ margin: 0, padding: '0 20px 18px 38px', color: 'var(--text-dim)', fontSize: 13.5 }}>
                  {c.items.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: 6 }}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      <ReviewsSection />

      <Footer />
    </>
  )
}