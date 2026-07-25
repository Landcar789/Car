'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AddVehicleForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [photos, setPhotos] = useState<FileList | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const supabase = createClient()
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const { data: vehicle, error: insertError } = await supabase
        .from('vehicles')
        .insert({
          brand: formData.get('brand'),
          model: formData.get('model'),
          year: Number(formData.get('year')) || null,
          price_eur: Number(formData.get('price_eur')),
          transmission: formData.get('transmission'),
          fuel: formData.get('fuel'),
          mileage_km: Number(formData.get('mileage_km')) || null,
          description: formData.get('description'),
          is_published: true,
        })
        .select()
        .single()

      if (insertError) throw insertError

      if (photos && photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
          const file = photos[i]
          const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
const filePath = `${vehicle.id}-${Date.now()}-${i}-${cleanFileName}`
          const { error: uploadError } = await supabase.storage
            .from('vehicle-photos')
            .upload(filePath, file)

          if (uploadError) throw uploadError

          const { data: urlData } = supabase.storage.from('vehicle-photos').getPublicUrl(filePath)

          await supabase.from('vehicle_photos').insert({
            vehicle_id: vehicle.id,
            url: urlData.publicUrl,
            position: i,
          })
        }
      }

      form.reset()
      setPhotos(null)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="admin-card" onSubmit={handleSubmit}>
      <h2 className="section-title">Ajouter un véhicule</h2>
      <div className="admin-form-grid">
        <div className="field"><label>Marque <span className="req">*</span></label><input name="brand" required /></div>
        <div className="field"><label>Modèle <span className="req">*</span></label><input name="model" required /></div>
        <div className="field"><label>Année</label><input name="year" type="number" placeholder="2020" /></div>
        <div className="field"><label>Prix (€) <span className="req">*</span></label><input name="price_eur" type="number" step="0.01" required /></div>
        <div className="field"><label>Transmission</label><input name="transmission" placeholder="Automatique / Manuelle" /></div>
        <div className="field"><label>Carburant</label><input name="fuel" placeholder="Essence / Diesel" /></div>
        <div className="field"><label>Kilométrage</label><input name="mileage_km" type="number" placeholder="50000" /></div>
        <div className="field">
          <label>Photos (plusieurs possibles)</label>
          <input type="file" accept="image/*" multiple onChange={(e) => setPhotos(e.target.files)} />
        </div>
      </div>
      <div className="field" style={{ marginTop: 14 }}>
        <label>Description</label>
        <textarea name="description" rows={3} />
      </div>

      {error && <p style={{ color: 'crimson', fontSize: 13 }}>{error}</p>}

      <button className="admin-btn" type="submit" disabled={submitting} style={{ marginTop: 10 }}>
        {submitting ? 'Ajout en cours...' : 'Ajouter le véhicule'}
      </button>
    </form>
  )
}