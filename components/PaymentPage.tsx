'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, Upload } from 'lucide-react'
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
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Merci de joindre votre reçu de paiement.')
      return
    }
    setSubmitting(true)
    setError(null)

    const supabase = createClient()

    try {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
const filePath = `${order.id}-${Date.now()}-${cleanFileName}`
      const { error: uploadError } = await supabase.storage
        .from('payment-receipts')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('payment-receipts').getPublicUrl(filePath)

      const { error: paymentError } = await supabase.from('payments').insert({
        order_id: order.id,
        receipt_url: urlData.publicUrl,
        status: 'pending_verification',
      })

      if (paymentError) throw paymentError

      await supabase.from('orders').update({ status: 'pending_verification' }).eq('id', order.id)

      window.location.href = `/confirmation/${order.id}`
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
      setSubmitting(false)
    }
  }

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
        <p>Votre commande ne sera <b>définitivement validée</b> qu&apos;après réception du virement et vérification du reçu ci-dessous.</p>
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

      <form className="narrow-card fade-up d3" onSubmit={handleSubmit}>
        <h2>Envoyer le reçu de paiement</h2>
        <label className="upload-box" style={{ display: 'block', padding: '28px 20px' }}>
          <Upload size={26} strokeWidth={1.8} style={{ marginBottom: 8, color: 'var(--petrol)' }} />
          <div>{file ? `✅ ${file.name}` : 'Cliquer pour joindre une capture ou photo du virement'}</div>
          <input
            type="file"
            accept="image/*,.pdf"
            style={{ display: 'none' }}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <div className="whatsapp-note">
          <span>📲</span>
          <span>Après validation, une confirmation sera envoyée à votre email. Vous pouvez aussi nous contacter directement sur WhatsApp au <b>+49 177 8612854</b>.</span>
        </div>

        {error && <p style={{ color: 'crimson', fontSize: 13, marginTop: 12 }}>{error}</p>}

        <button className="submit-btn" style={{ marginTop: 20 }} type="submit" disabled={submitting}>
          {submitting ? 'Envoi en cours...' : 'Valider le paiement'}
        </button>
      </form>
    </div>
  )
}