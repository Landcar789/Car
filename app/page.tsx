'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Car, ShieldCheck, Wrench, Truck, FileCheck, MessageSquare } from 'lucide-react'

export default function AccueilPage() {
  const [openCond, setOpenCond] = useState<number | null>(0)

  const conditions = [
    {
      title: 'Conditions de paiement',
      items: [
        <>Acompte : <b className="highlight">25% à la commande</b></>,
        <>Montant restant (75%) : payable en mensualités sans intérêt, de 6 à 36 mois</>,
        <>Offre spéciale : <b className="highlight">-15% de remise</b> pour un paiement comptant lors de la commande</>,
      ],
    },
    {
      title: 'Service et Livraison',
      items: [
        <>Prise en charge de toutes les formalités d&apos;importation jusqu&apos;à la livraison à domicile</>,
        <>Délai de livraison : <b className="highlight">7 jours</b></>,
        <>Droit de rétractation : <b className="highlight">14 jours</b> (satisfait ou remboursé)</>,
      ],
    },
    {
      title: 'Garantie',
      items: [<>Garantie de <b className="highlight">24 mois</b> sur tous les véhicules vendus</>],
    },
  ]

  const services = [
    { icon: Car, title: 'Achat de véhicules', desc: "Nous vous aidons à trouver et à acquérir la voiture de vos rêves, peu importe où elle se trouve." },
    { icon: ShieldCheck, title: 'Garantie', desc: "Nous proposons des forfaits de garantie complets pour vous offrir tranquillité d'esprit et protection." },
    { icon: Wrench, title: 'Entretien et Réparation', desc: "Nos techniciens expérimentés s'occupent de tous vos besoins d'entretien et de réparation." },
    { icon: Truck, title: 'Transport et livraison', desc: "Nous offrons des services de transport et de livraison sûrs et fiables pour votre véhicule." },
    { icon: FileCheck, title: 'Documentation et Approbation', desc: "Nous vous accompagnons dans tous les documents et démarches d'approbation nécessaires." },
    { icon: MessageSquare, title: 'Conseils Personnalisés', desc: "Notre équipe est à votre disposition pour vous apporter des conseils et un accompagnement personnalisé." },
  ]

  return (
    <>
      <Header />

      <div
        style={{
          position: 'relative',
          minHeight: 480,
          display: 'flex',
          alignItems: 'flex-end',
          padding: '0 24px 60px',
          background:
            'linear-gradient(0deg, rgba(11,20,19,0.88) 0%, rgba(11,20,19,0.45) 55%, rgba(11,20,19,0.15) 100%), linear-gradient(135deg, #33413d, #1c2a28)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          <div style={{ maxWidth: 560 }}>
            <div className="fade-up d1" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', marginBottom: 14 }}>
              Votre concession en ligne
            </div>
            <h1 className="fade-up d2" style={{ fontFamily: 'Oswald, sans-serif', fontSize: 42, fontWeight: 600, lineHeight: 1.15, margin: '0 0 18px', color: '#fff' }}>
              La voiture de vos rêves, où qu&apos;elle soit.
            </h1>
            <p className="fade-up d3" style={{ color: '#d9dedb', fontSize: 15.5, margin: '0 0 26px', maxWidth: 460 }}>
              Nous vous accompagnons de la recherche du véhicule jusqu&apos;à la livraison à votre domicile : achat, garantie, entretien, transport, documents — tout est pris en charge.
            </p>
            <div className="fade-up d4" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="/marketplace" style={{ background: 'var(--gold)', color: '#211705', border: 'none', padding: '13px 24px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer', textDecoration: 'none' }}>
                Voir les véhicules
              </a>
              <a href="/faq" style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)', padding: '13px 24px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer', textDecoration: 'none' }}>
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--petrol)', marginBottom: 8 }}>
            Nos services
          </div>
          <h2 style={{ fontFamily: 'Oswald, sans-serif', fontSize: 26, fontWeight: 600, margin: 0 }}>Un accompagnement complet</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
          {services.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.title} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, padding: 22 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(15,110,99,0.10)', color: 'var(--petrol)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon size={21} strokeWidth={1.8} />
                </div>
                <h3 style={{ fontFamily: 'Oswald, sans-serif', fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>{s.title}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-dim)', margin: 0 }}>{s.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* PROCEDURES / CONDITIONS */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--petrol)', marginBottom: 8 }}>
            Avant de commander
          </div>
          <h2 style={{ fontFamily: 'Oswald, sans-serif', fontSize: 26, fontWeight: 600, margin: 0 }}>Procédures d&apos;achat de véhicules</h2>
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

      <Footer />
    </>
  )
}