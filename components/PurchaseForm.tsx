'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

type Vehicle = {
  id: string
  brand: string
  model: string
  year: number | null
  price_eur: number
  transmission: string | null
  fuel: string | null
  mileage_km: number | null
  mileage_km: number | null
  vehicle_photos?: { url: string; position: number }[]
}

export default function PurchaseForm({ vehicle }: { vehicle: Vehicle }) {
  const [consent, setConsent] = useState(false)
  const [mode, setMode] = useState<'retrait' | 'livraison'>('retrait')
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const acompte = Math.round(vehicle.price_eur * 0.25)
  const reste = vehicle.price_eur - acompte

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      setError("Merci de joindre votre pièce d'identité.")
      return
    }
    setSubmitting(true)
    setError(null)

    const supabase = createClient()
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      // 1. Upload de la pièce d'identité
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
const filePath = `${vehicle.id}-${Date.now()}-${cleanFileName}`
      const { error: uploadError } = await supabase.storage
        .from('id-documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('id-documents').getPublicUrl(filePath)

      // 2. Récupérer l'utilisateur connecté (optionnel)
      const { data: { user } } = await supabase.auth.getUser()

      // 3. Créer la commande
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

      // 4. Redirection vers la page paiement avec l'ID de la commande
      window.location.href = `/paiement/${order.id}`
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
      setSubmitting(false)
    }
  }

  return (
    <div className="achat-wrap">
      <div className="achat-topbar">
        <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 20, textTransform: 'uppercase' }}>
          Formulaire d&apos;achat
        </div>
        <div className="order-tag">Véhicule <b>{vehicle.brand} {vehicle.model}</b></div>
      </div>

      <div className="achat-steps">
        <div className="step done">1. Article</div>
        <div className="step active">2. Formulaire d&apos;achat</div>
        <div className="step">3. Acompte 25%</div>
        <div className="step">4. Paiement complet</div>
      </div>

      <div className="achat-grid">
        <form className="achat-card" onSubmit={handleSubmit}>
          <h2 className="section-title">Informations acheteur</h2>
          <div className="row2">
            <div className="field"><label>Nom complet <span className="req">*</span></label><input name="full_name" type="text" placeholder="Ex: Abdoul Kora" required /></div>
            <div className="field"><label>Email <span className="req">*</span></label><input name="email" type="email" placeholder="vous@email.com" required /></div>
          </div>
          <div className="row2">
            <div className="field"><label>Téléphone <span className="req">*</span></label><input name="phone" type="tel" placeholder="+49 177 8612854" required /></div>
            <div className="field"><label>Numéro WhatsApp <span className="req">*</span></label><input name="whatsapp" type="tel" placeholder="+49 177 8612854" required /></div>
          </div>
          <div className="field"><label>Adresse complète <span className="req">*</span></label><input name="address" type="text" placeholder="Rue, ville, pays" required /></div>
          <div className="field">
            <label>Pièce d&apos;identité (photo ou scan) <span className="req">*</span></label>
            <label className={`upload-box ${file ? 'has-file' : ''}`}>
              {file ? `✅ ${file.name}` : '📎 Cliquer pour joindre un fichier (CNI, passeport...)'}
              <input
                type="file"
                accept="image/*,.pdf"
                style={{ display: 'none' }}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <h2 className="section-title">Récupération</h2>
          <div className="field">
            <label>Mode de récupération</label>
            <div className="radio-group">
              <label className={`radio-pill ${mode === 'retrait' ? 'checked' : ''}`}>
                <input type="radio" name="pickup_mode_display" checked={mode === 'retrait'} onChange={() => setMode('retrait')} />
                Retrait sur place
              </label>
              <label className={`radio-pill ${mode === 'livraison' ? 'checked' : ''}`}>
                <input type="radio" name="pickup_mode_display" checked={mode === 'livraison'} onChange={() => setMode('livraison')} />
                Livraison
              </label>
            </div>
          </div>
          <div className="field"><label>Date souhaitée</label><input name="desired_date" type="date" /></div>

          <h2 className="section-title">Informations complémentaires</h2>
          <div className="field"><label>Commentaire (optionnel)</label><textarea name="comment" rows={3} placeholder="Précision, question sur l'état du véhicule..." /></div>

          <div className="consent">
            <input type="checkbox" id="consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <label htmlFor="consent">
              J&apos;ai bien compris que je dois régler <b>25% du montant total</b> pour valider ma commande, avant de passer au paiement intégral.
            </label>
          </div>

          {error && <p style={{ color: 'crimson', fontSize: 13, marginTop: 12 }}>{error}</p>}

          <button className="submit-btn" disabled={!consent || submitting} type="submit">
            {submitting ? 'Envoi en cours...' : "Valider l'achat"}
          </button>
        </form>

        <div className="achat-card summary-card">
          <div className="car-thumb" style={{ position: 'relative', overflow: 'hidden' }}>
  {(() => {
    const photos = [...(vehicle.vehicle_photos ?? [])].sort((a, b) => a.position - b.position)
    return photos[0] ? (
      <Image src={photos[0].url} alt={`${vehicle.brand} ${vehicle.model}`} fill style={{ objectFit: 'cover' }} />
    ) : (
      'Photo du véhicule'
    )
  })()}
</div>
          <p className="car-name">{vehicle.brand} {vehicle.model} {vehicle.year}</p>
          <p className="car-meta">
            {[vehicle.fuel, vehicle.transmission, vehicle.mileage_km ? `${vehicle.mileage_km.toLocaleString('fr-FR')} km` : null].filter(Boolean).join(' · ')}
          </p>

          <div className="price-row"><span>Prix du véhicule</span><b>{vehicle.price_eur.toLocaleString('fr-FR')} €</b></div>
          <div className="price-row"><span>Frais de dossier</span><b>0 €</b></div>
          <div className="price-row total"><span>Total</span><b>{vehicle.price_eur.toLocaleString('fr-FR')} €</b></div>

          <div className="gauge-wrap">
            <div className="gauge-label">Acompte requis pour valider</div>
            <svg width="180" height="100" viewBox="0 0 180 100">
              <path d="M 15 90 A 75 75 0 0 1 165 90" fill="none" stroke="#e2e0d8" strokeWidth="14" strokeLinecap="round" />
              <path d="M 15 90 A 75 75 0 0 1 68 22" fill="none" stroke="#c9a227" strokeWidth="14" strokeLinecap="round" />
              <circle cx="68" cy="22" r="5" fill="#1c2a2e" />
            </svg>
            <div className="gauge-value">25% = <b>{acompte.toLocaleString('fr-FR')} €</b></div>
          </div>

          <div className="note">Reste à payer après validation de l&apos;acompte : <b style={{ color: 'var(--text)' }}>{reste.toLocaleString('fr-FR')} €</b></div>
        </div>
      </div>
    </div>
  )
}