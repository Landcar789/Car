'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import FavoriteButton from '@/components/FavoriteButton'
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
  description: string | null
  vehicle_photos?: { url: string; position: number }[]
}

export default function VehicleDetail({ vehicle }: { vehicle: Vehicle }) {
  const [activeThumb, setActiveThumb] = useState(0)
  const { t } = useLanguage()

  const photos = [...(vehicle.vehicle_photos ?? [])].sort((a, b) => a.position - b.position)
  const acompte = Math.round(vehicle.price_eur * 0.25)

  return (
    <div className="vehicle-wrap">
      <div>
        <div className="gallery fade-up d1">
          <div className="gallery-main" style={{ position: 'relative', overflow: 'hidden' }}>
            {photos[activeThumb] ? (
              <Image src={photos[activeThumb].url} alt={`${vehicle.brand} ${vehicle.model}`} fill style={{ objectFit: 'cover' }} />
            ) : (
              t.vehicle.mainPhoto
            )}
          </div>
          {photos.length > 0 && (
            <div className="gallery-thumbs">
              {photos.map((photo, i) => (
                <div
                  key={photo.url}
                  className={`thumb ${activeThumb === i ? 'active' : ''}`}
                  style={{ position: 'relative', overflow: 'hidden' }}
                  onClick={() => setActiveThumb(i)}
                >
                  <Image src={photo.url} alt="" fill style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="specs-card fade-up d2">
          <h2>{t.vehicle.specs}</h2>
          <div className="specs-grid">
            <div className="spec-item"><span className="spec-label">{t.vehicle.brand}</span><span className="spec-value">{vehicle.brand}</span></div>
            <div className="spec-item"><span className="spec-label">{t.vehicle.model}</span><span className="spec-value">{vehicle.model}</span></div>
            <div className="spec-item"><span className="spec-label">{t.vehicle.year}</span><span className="spec-value">{vehicle.year ?? '—'}</span></div>
            <div className="spec-item"><span className="spec-label">{t.vehicle.mileage}</span><span className="spec-value">{vehicle.mileage_km ? `${vehicle.mileage_km.toLocaleString('fr-FR')} km` : '—'}</span></div>
            <div className="spec-item"><span className="spec-label">{t.vehicle.fuel}</span><span className="spec-value">{translateFuel(t.vehicle, vehicle.fuel) ?? '—'}</span></div>
            <div className="spec-item"><span className="spec-label">{t.vehicle.transmission}</span><span className="spec-value">{translateTrans(t.vehicle, vehicle.transmission) ?? '—'}</span></div>
          </div>
          {vehicle.description && <div className="description">{vehicle.description}</div>}
        </div>
      </div>

      <div className="buy-card fade-up d3">
        <span className="car-tag">{t.vehicle.certified}</span>
        <p className="car-name">{vehicle.brand} {vehicle.model} {vehicle.year}</p>
        <p className="car-loc">{t.vehicle.available}</p>
        <div className="car-price">{vehicle.price_eur.toLocaleString('fr-FR')} €</div>
        <div className="price-note">{t.vehicle.deposit} {acompte.toLocaleString('fr-FR')} €</div>

        <div className="btn-row">
          <a href={`/achat/${vehicle.id}`} className="btn-buy">{t.vehicle.buy}</a>
          <FavoriteButton vehicleId={vehicle.id} className="btn-fav" />
        </div>

        <div className="trust-note">
          <ShieldCheck size={16} strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 1, color: 'var(--petrol)' }} />
          {t.vehicle.warrantyNote}
        </div>
      </div>
    </div>
  )
}