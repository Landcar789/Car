'use client'

import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Order = {
  id: string
  full_name: string
  deposit_amount: number
  vehicle_price: number
  vehicles: {
    id: string
    brand: string
    model: string
  }
}

type PaymentSettings = {
  beneficiary_name: string
  iban: string
  bic: string
}

export default function PaymentPage({ order }: { order: Order }) {
  const [copied, setCopied] = useState(false)
  const [settings, setSettings] = useState<PaymentSettings | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('payment_settings')
      .select('beneficiary_name, iban, bic')
      .eq('id', 1)
      .single()
      .then(({ data }) => setSettings(data))
  }, [])

  const reference = order.id.slice(0, 8).toUpperCase()

  const handleCopy = () => {
    if (!settings) return
    navigator.clipboard.writeText(settings.iban)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const whatsappLink = `https://wa.me/491778612854?text=${encodeURIComponent(`Bonjour, voici le reçu de paiement pour ma commande CMD-${reference} (${order.vehicles.brand} ${order.vehicles.model}).`)}`
  const mailLink = `mailto:autoprojetmk@gmail.com?subject=${encodeURIComponent(`Reçu paiement CMD-${reference}`)}&body=${encodeURIComponent(`Bonjour, veuillez trouver ci-joint le reçu de paiement pour ma commande CMD-${reference} (${order.vehicles.brand} ${order.vehicles.model}).`)}`

  return (
    <div className="narrow-wrap">
      <div className="narrow-topbar">
        <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 20, textTransform: 'uppercase' }}>
          Paiement
        </div>
        <div className="order-tag">Commande <b>CMD-{reference}</b></div>
      </div>

      <div className="achat-steps">
        <div className="step done">1. Article</div>
        <div className="step done">2. Formulaire d&apos;achat</div>
        <div className="step active">3. Paiement de l&apos;acompte</div>
        <div className="step">4. Confirmation</div>
      </div>

      <div className="alert-box fade-up d1">
        <AlertCircle size={20} strokeWidth={2} />
        <p>Votre commande ne sera <b>définitivement validée</b> qu&apos;après réception du virement et vérification de votre reçu.</p>
      </div>

      <div className="narrow-card fade-up d1">
        <h2>Montant à régler</h2>
        <div className="amount-due">
          <span className="label">Acompte (25% du prix — {order.vehicles.brand} {order.vehicles.model})</span>
          <span className="value">{order.deposit_amount.toLocaleString('fr-FR')} €</span>
        </div>
      </div>

      <div className="narrow-card fade-up d2">
        <h2>Coordonnées bancaires</h2>
        {settings ? (
          <>
            <div className="bank-row"><span className="bank-label">Bénéficiaire</span><span className="bank-value">{settings.beneficiary_name}</span></div>
            <div className="bank-row">
              <span className="bank-label">IBAN</span>
              <span className="bank-value">
                {settings.iban}
                <button className="copy-btn" onClick={handleCopy} type="button">{copied ? 'Copié' : 'Copier'}</button>
              </span>
            </div>
            <div className="bank-row"><span className="bank-label">BIC / SWIFT</span><span className="bank-value">{settings.bic}</span></div>
            <div className="bank-row"><span className="bank-label">Référence à indiquer</span><span className="bank-value">CMD-{reference}</span></div>
          </>
        ) : (
          <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>Chargement...</p>
        )}
      </div>

      <div className="narrow-card fade-up d3">
        <h2>Envoyer votre reçu de paiement</h2>
        <p style={{ fontSize: 13.5, color: 'var(--text-dim)', marginBottom: 18 }}>
          Après avoir effectué le virement, envoyez-nous votre reçu par WhatsApp ou par email en indiquant votre référence <b style={{ color: 'var(--text)' }}>CMD-{reference}</b>.
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp" style={{ flex: 1, minWidth: 140 }}>
            Envoyer par WhatsApp
          </a>
          <a href={mailLink} className="btn-primary-confirm" style={{ flex: 1, minWidth: 140 }}>
            Envoyer par Email
          </a>
        </div>

        <button
          className="submit-btn"
          style={{ marginTop: 20 }}
          onClick={() => { window.location.href = `/confirmation/${order.id}` }}
        >
          J&apos;ai envoyé mon reçu
        </button>
      </div>
    </div>
  )
}