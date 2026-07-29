'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/LanguageContext'
import { translateFuel, translateTrans } from '@/lib/vehicleLabels'

type Vehicle = {
  id: string
  brand: string
  model: string
  year: number | null
  price_eur: number
  transmission: string | null
  fuel: string | null
  mileage_km: number | null
  vehicle_photos?: { url: string; position: number }[]
}

export default function PurchaseForm({ vehicle }: { vehicle: Vehicle }) {
  const { t, lang } = useLanguage()
  const [consent, setConsent] = useState(false)
  const [mode, setMode] = useState<'retrait' | 'livraison'>('retrait')
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const acompte = Math.round(vehicle.price_eur * 0.25)
  const reste = vehicle.price_eur - acompte
  const photos = [...(vehicle.vehicle_photos ?? [])].sort((a, b) => a.position - b.position)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      setError(t.purchase.idError)
      return
    }
    setSubmitting(true)
    setError(null)

    const supabase = createClient()
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
      const filePath = `${vehicle.id}-${Date.now()}-${cleanFileName}`
      const { error: uploadError } = await supabase.storage
        .from('id-documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('id-documents').getPublicUrl(filePath)

      const { data: { user } } = await supabase.auth.getUser()

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          vehicle_id: vehicle.id,
          user_id: user?.id ?? null,
          full_name: formData.get('full_name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          whatsapp: formData.get('whatsapp'),
          address: formData.get('address'),
          id_document_url: urlData.publicUrl,
          pickup_mode: mode,
          desired_date: formData.get('desired_date') || null,
          comment: formData.get('comment') || null,
          vehicle_price: vehicle.price_eur,
          deposit_amount: acompte,
          status: 'pending_payment',
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Envoyer les emails de notification (gérant + client)
      const reference = order.id.slice(0, 8).toUpperCase()
      fetch('/api/send-order-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference,
          fullName: order.full_name,
          email: order.email,
          phone: order.phone,
          whatsapp: order.whatsapp,
          vehicleName: `${vehicle.brand} ${vehicle.model} ${vehicle.year ?? ''}`.trim(),
          vehiclePrice: vehicle.price_eur,
          depositAmount: acompte,
          lang,
        }),
      }).catch((e) => console.error('Email non envoyé:', e))

      window.location.href = `/paiement/${order.id}`
    } catch (err) {
      setError(err instanceof Error ? err.message : t.purchase.genericError)
      setSubmitting(false)
    }
  }

  return (
    <div className="achat-wrap">
      <div className="achat-topbar">
        <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 20, textTransform: 'uppercase' }}>
          {t.purchase.title}
        </div>
        <div className="order-tag">{t.purchase.vehicleLabel} <b>{vehicle.brand} {vehicle.model}</b></div>
      </div>

      <div className="achat-steps">
        <div className="step done">{t.purchase.step1}</div>
        <div className="step active">{t.purchase.step2}</div>
        <div className="step">{t.purchase.step3}</div>
        <div className="step">{t.purchase.step4}</div>
      </div>

      <div className="achat-grid">
        <form className="achat-card" onSubmit={handleSubmit}>
          <h2 className="section-title">{t.purchase.buyerInfo}</h2>
          <div className="row2">
            <div className="field"><label>{t.purchase.fullName} <span className="req">*</span></label><input name="full_name" type="text" required /></div>
            <div className="field"><label>{t.purchase.email} <span className="req">*</span></label><input name="email" type="email" required /></div>
          </div>
          <div className="row2">
            <div className="field"><label>{t.purchase.phone} <span className="req">*</span></label><input name="phone" type="tel" required /></div>
            <div className="field"><label>{t.purchase.whatsapp} <span className="req">*</span></label><input name="whatsapp" type="tel" required /></div>
          </div>
          <div className="field"><label>{t.purchase.address} <span className="req">*</span></label><input name="address" type="text" placeholder={t.purchase.addressPlaceholder} required /></div>
          <div className="field">
            <label>{t.purchase.idDoc} <span className="req">*</span></label>
            <label className={`upload-box ${file ? 'has-file' : ''}`}>
              {file ? `✅ ${file.name}` : t.purchase.idDocPlaceholder}
              <input
                type="file"
                accept="image/*,.pdf"
                style={{ display: 'none' }}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <h2 className="section-title">{t.purchase.pickup}</h2>
          <div className="field">
            <label>{t.purchase.pickupMode}</label>
            <div className="radio-group">
              <label className={`radio-pill ${mode === 'retrait' ? 'checked' : ''}`}>
                <input type="radio" name="pickup_mode_display" checked={mode === 'retrait'} onChange={() => setMode('retrait')} />
                {t.purchase.onSite}
              </label>
              <label className={`radio-pill ${mode === 'livraison' ? 'checked' : ''}`}>
                <input type="radio" name="pickup_mode_display" checked={mode === 'livraison'} onChange={() => setMode('livraison')} />
                {t.purchase.delivery}
              </label>
            </div>
          </div>
          <div className="field"><label>{t.purchase.desiredDate}</label><input name="desired_date" type="date" /></div>

          <h2 className="section-title">{t.purchase.moreInfo}</h2>
          <div className="field"><label>{t.purchase.comment}</label><textarea name="comment" rows={3} placeholder={t.purchase.commentPlaceholder} /></div>

          <div className="consent">
            <input type="checkbox" id="consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <label htmlFor="consent">{t.purchase.consent}</label>
          </div>

          {error && <p style={{ color: 'crimson', fontSize: 13, marginTop: 12 }}>{error}</p>}

          <button className="submit-btn" disabled={!consent || submitting} type="submit">
            {submitting ? t.purchase.submitting : t.purchase.submit}
          </button>
        </form>

        <div className="achat-card summary-card">
          <div className="car-thumb" style={{ position: 'relative', overflow: 'hidden' }}>
            {photos[0] ? (
              <Image src={photos[0].url} alt={`${vehicle.brand} ${vehicle.model}`} fill style={{ objectFit: 'cover' }} />
            ) : (
              t.purchase.photo
            )}
          </div>
          <p className="car-name">{vehicle.brand} {vehicle.model} {vehicle.year}</p>
          <p className="car-meta">
            {[translateFuel(t.vehicle, vehicle.fuel), translateTrans(t.vehicle, vehicle.transmission), vehicle.mileage_km ? `${vehicle.mileage_km.toLocaleString('fr-FR')} km` : null].filter(Boolean).join(' · ')}
          </p>

          <div className="price-row"><span>{t.purchase.vehiclePrice}</span><b>{vehicle.price_eur.toLocaleString('fr-FR')} €</b></div>
          <div className="price-row"><span>{t.purchase.fees}</span><b>0 €</b></div>
          <div className="price-row total"><span>{t.purchase.total}</span><b>{vehicle.price_eur.toLocaleString('fr-FR')} €</b></div>

          <div className="gauge-wrap">
            <div className="gauge-label">{t.purchase.depositRequired}</div>
            <svg width="180" height="100" viewBox="0 0 180 100">
              <path d="M 15 90 A 75 75 0 0 1 165 90" fill="none" stroke="#e2e0d8" strokeWidth="14" strokeLinecap="round" />
              <path d="M 15 90 A 75 75 0 0 1 68 22" fill="none" stroke="#c9a227" strokeWidth="14" strokeLinecap="round" />
              <circle cx="68" cy="22" r="5" fill="#1c2a2e" />
            </svg>
            <div className="gauge-value">25% = <b>{acompte.toLocaleString('fr-FR')} €</b></div>
          </div>

          <div className="note">{t.purchase.remaining} <b style={{ color: 'var(--text)' }}>{reste.toLocaleString('fr-FR')} €</b></div>
        </div>
      </div>
    </div>
  )
}