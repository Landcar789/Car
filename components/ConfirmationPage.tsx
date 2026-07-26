'use client'

import { Check, MessageCircle } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

type Order = {
  id: string
  vehicle_price: number
  deposit_amount: number
  vehicles: { brand: string; model: string; year: number | null }
}

export default function ConfirmationPage({ order }: { order: Order }) {
  const { t } = useLanguage()
  const reste = order.vehicle_price - order.deposit_amount
  const reference = order.id.slice(0, 8).toUpperCase()

  const whatsappMessage = encodeURIComponent(
    `Bonjour, je vous contacte au sujet de ma commande CMD-${reference} (${order.vehicles.brand} ${order.vehicles.model}).`
  )
  const whatsappLink = `https://wa.me/491778612854?text=${whatsappMessage}`

  return (
    <div className="narrow-wrap">
      <div className="narrow-topbar">
        <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 20, textTransform: 'uppercase' }}>
          {t.confirmation.title}
        </div>
        <div className="order-tag">{t.confirmation.orderLabel} <b>CMD-{reference}</b></div>
      </div>

      <div className="achat-steps">
        <div className="step done">{t.purchase.step1}</div>
        <div className="step done">{t.purchase.step2}</div>
        <div className="step done">{t.payment.step3}</div>
        <div className="step done">{t.payment.step4}</div>
      </div>

      <div className="success-block">
        <div className="success-icon">
          <Check size={34} strokeWidth={2.5} />
        </div>
        <h1 className="fade-up d1">{t.confirmation.successTitle}</h1>
        <p className="fade-up d2">{t.confirmation.successText}</p>
        <div className="status-pill fade-up d3">
          <span className="dot"></span>{t.confirmation.pending}
        </div>
      </div>

      <div className="narrow-card fade-up d1">
        <h2>{t.confirmation.recapTitle}</h2>
        <div className="recap-row"><span>{t.confirmation.vehicle}</span><b>{order.vehicles.brand} {order.vehicles.model} {order.vehicles.year}</b></div>
        <div className="recap-row"><span>{t.confirmation.totalPrice}</span><b>{order.vehicle_price.toLocaleString('fr-FR')} €</b></div>
        <div className="recap-row total"><span>{t.confirmation.depositPaid}</span><b>{order.deposit_amount.toLocaleString('fr-FR')} €</b></div>
        <div className="recap-row"><span>{t.confirmation.remaining}</span><b>{reste.toLocaleString('fr-FR')} €</b></div>
      </div>

      <div className="narrow-card fade-up d2">
        <h2>{t.confirmation.nextTitle}</h2>
        <div className="timeline">
          <div className="tl-item">
            <div className="tl-dot done">✓</div>
            <div className="tl-content"><h4>{t.confirmation.tl1Title}</h4><p>{t.confirmation.tl1Text}</p></div>
          </div>
          <div className="tl-item">
            <div className="tl-dot current">2</div>
            <div className="tl-content"><h4>{t.confirmation.tl2Title}</h4><p>{t.confirmation.tl2Text}</p></div>
          </div>
          <div className="tl-item">
            <div className="tl-dot pending">3</div>
            <div className="tl-content"><h4>{t.confirmation.tl3Title}</h4><p>{t.confirmation.tl3Text}</p></div>
          </div>
          <div className="tl-item">
            <div className="tl-dot pending">4</div>
            <div className="tl-content"><h4>{t.confirmation.tl4Title}</h4><p>{t.confirmation.tl4Text}</p></div>
          </div>
        </div>
      </div>

      <div className="confirm-actions fade-up d4">
        <a href="/" style={{ flex: 1 }}>
          <button className="btn-primary-confirm" style={{ width: '100%' }}>{t.confirmation.homeBtn}</button>
        </a>
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
          <MessageCircle size={16} />
          WhatsApp
        </a>
      </div>
    </div>
  )
}