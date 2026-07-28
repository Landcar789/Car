'use client'

import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/LanguageContext'

type Order = {
  id: string
  full_name: string
  email: string
  phone: string
  whatsapp: string
  deposit_amount: number
  vehicle_price: number
  vehicles: { id: string; brand: string; model: string; year?: number | null }
}

type PaymentSettings = { beneficiary_name: string; iban: string; bic: string }

export default function PaymentPage({ order }: { order: Order }) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const [settings, setSettings] = useState<PaymentSettings | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('payment_settings').select('beneficiary_name, iban, bic').eq('id', 1).single().then(({ data }) => setSettings(data))
  }, [])

  const reference = order.id.slice(0, 8).toUpperCase()

  const handleCopy = () => {
    if (!settings) return
    navigator.clipboard.writeText(settings.iban)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const whatsappLink = `https://wa.me/491778612854?text=${encodeURIComponent(`Bonjour, voici le reçu de paiement pour ma commande CMD-${reference} (${order.vehicles.brand} ${order.vehicles.model}).`)}`
  const mailLink = `mailto:deutschlandautocar@gmail.com?subject=${encodeURIComponent(`Reçu paiement CMD-${reference}`)}&body=${encodeURIComponent(`Bonjour, veuillez trouver ci-joint le reçu de paiement pour ma commande CMD-${reference} (${order.vehicles.brand} ${order.vehicles.model}).`)}`

  return (
    <div className="narrow-wrap">
      <div className="narrow-topbar">
        <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 20, textTransform: 'uppercase' }}>
          {t.payment.title}
        </div>
        <div className="order-tag">{t.payment.orderLabel} <b>CMD-{reference}</b></div>
      </div>

      <div className="achat-steps">
        <div className="step done">{t.purchase.step1}</div>
        <div className="step done">{t.purchase.step2}</div>
        <div className="step active">{t.payment.step3}</div>
        <div className="step">{t.payment.step4}</div>
      </div>

      <div className="alert-box fade-up d1">
        <AlertCircle size={20} strokeWidth={2} />
        <p>{t.payment.warning}</p>
      </div>

      <div className="narrow-card fade-up d1">
        <h2>{t.payment.amountTitle}</h2>
        <div className="amount-due">
          <span className="label">{t.payment.amountLabel} {order.vehicles.brand} {order.vehicles.model})</span>
          <span className="value">{order.deposit_amount.toLocaleString('fr-FR')} €</span>
        </div>
      </div>

      <div className="narrow-card fade-up d2">
        <h2>{t.payment.bankTitle}</h2>
        {settings ? (
          <>
            <div className="bank-row"><span className="bank-label">{t.payment.beneficiary}</span><span className="bank-value">{settings.beneficiary_name}</span></div>
            <div className="bank-row">
              <span className="bank-label">{t.payment.iban}</span>
              <span className="bank-value">
                {settings.iban}
                <button className="copy-btn" onClick={handleCopy} type="button">{copied ? t.payment.copied : t.payment.copy}</button>
              </span>
            </div>
            <div className="bank-row"><span className="bank-label">{t.payment.bic}</span><span className="bank-value">{settings.bic}</span></div>
            <div className="bank-row"><span className="bank-label">{t.payment.reference}</span><span className="bank-value">CMD-{reference}</span></div>
          </>
        ) : (
          <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>{t.payment.loading}</p>
        )}
      </div>

      <div className="narrow-card fade-up d3">
        <h2>{t.payment.sendReceiptTitle}</h2>
        <p style={{ fontSize: 13.5, color: 'var(--text-dim)', marginBottom: 18 }}>
          {t.payment.sendReceiptText} <b style={{ color: 'var(--text)' }}>CMD-{reference}</b>.
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp" style={{ flex: 1, minWidth: 140 }}>
            {t.payment.sendWhatsapp}
          </a>
          <a href={mailLink} className="btn-primary-confirm" style={{ flex: 1, minWidth: 140 }}>
            {t.payment.sendEmail}
          </a>
        </div>

        <button
          className="submit-btn"
          style={{ marginTop: 20 }}
          onClick={() => {
            fetch('/api/send-receipt-emails', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                reference,
                fullName: order.full_name,
                email: order.email,
                phone: order.phone,
                whatsapp: order.whatsapp,
                vehicleName: `${order.vehicles.brand} ${order.vehicles.model} ${order.vehicles.year ?? ''}`.trim(),
                vehiclePrice: order.vehicle_price,
                depositAmount: order.deposit_amount,
              }),
            }).catch((e) => console.error('Email reçu non envoyé:', e))

            window.location.href = `/confirmation/${order.id}`
          }}
        >
          {t.payment.sentReceipt}
        </button>
      </div>
    </div>
  )
}