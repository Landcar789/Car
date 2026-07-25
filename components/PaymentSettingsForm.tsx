'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type PaymentSettings = {
  beneficiary_name: string
  iban: string
  bic: string
}

export default function PaymentSettingsForm({ settings }: { settings: PaymentSettings }) {
  const router = useRouter()
  const [form, setForm] = useState(settings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)

    await fetch('/api/admin/payment-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setSaving(false)
    setSaved(true)
    router.refresh()
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form className="admin-card" onSubmit={handleSubmit}>
      <h2 className="section-title">Compte bancaire (affiché à tous les clients)</h2>
      <div className="admin-form-grid">
        <div className="field">
          <label>Nom du bénéficiaire</label>
          <input value={form.beneficiary_name} onChange={(e) => setForm({ ...form, beneficiary_name: e.target.value })} />
        </div>
        <div className="field">
          <label>IBAN</label>
          <input value={form.iban} onChange={(e) => setForm({ ...form, iban: e.target.value })} />
        </div>
        <div className="field">
          <label>BIC / SWIFT</label>
          <input value={form.bic} onChange={(e) => setForm({ ...form, bic: e.target.value })} />
        </div>
      </div>
      <button className="admin-btn" type="submit" disabled={saving} style={{ marginTop: 10 }}>
        {saving ? 'Enregistrement...' : saved ? '✅ Enregistré' : 'Enregistrer'}
      </button>
    </form>
  )
}