'use client'

import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'

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
}

export default function VehicleDetail({ vehicle }: { vehicle: Vehicle }) {
  const [activeThumb, setActiveThumb] = useState(0)
  const [fav, setFav] = useState(false)

  const acompte = Math.round(vehicle.price_eur * 0.25)

  return (
    <div className="vehicle-wrap">
      <div>
        <div className="gallery fade-up d1">
          <div className="gallery-main">Photo principale du véhicule</div>
          <div className="gallery-thumbs">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`thumb ${activeThumb === i ? 'active' : ''}`}
                onClick={() => setActiveThumb(i)}
              />
            ))}
          </div>
        </div>

        <div className="specs-card fade-up d2">
          <h2>Caractéristiques</h2>
          <div className="specs-grid">
            <div className="spec-item"><span className="spec-label">Marque</span><span className="spec-value">{vehicle.brand}</span></div>
            <div className="spec-item"><span className="spec-label">Modèle</span><span className="spec-value">{vehicle.model}</span></div>
            <div className="spec-item"><span className="spec-label">Année</span><span className="spec-value">{vehicle.year ?? '—'}</span></div>
            <div className="spec-item"><span className="spec-label">Kilométrage</span><span className="spec-value">{vehicle.mileage_km ? `${vehicle.mileage_km.toLocaleString('fr-FR')} km` : '—'}</span></div>
            <div className="spec-item"><span className="spec-label">Carburant</span><span className="spec-value">{vehicle.fuel ?? '—'}</span></div>
            <div className="spec-item"><span className="spec-label">Transmission</span><span className="spec-value">{vehicle.transmission ?? '—'}</span></div>
          </div>
          {vehicle.description && <div className="description">{vehicle.description}</div>}
        </div>
      </div>

      <div className="buy-card fade-up d3">
        <span className="car-tag">Certifié</span>
        <p className="car-name">{vehicle.brand} {vehicle.model} {vehicle.year}</p>
        <p className="car-loc">Disponible à Kehl, Allemagne</p>
        <div className="car-price">{vehicle.price_eur.toLocaleString('fr-FR')} €</div>
        <div className="price-note">Acompte de 25% à la commande : {acompte.toLocaleString('fr-FR')} €</div>

        <div className="btn-row">
          <a href={`/achat/${vehicle.id}`} className="btn-buy">Acheter</a>
          <button className={`btn-fav ${fav ? 'active' : ''}`} onClick={() => setFav(!fav)}>
            {fav ? '♥' : '♡'}
          </button>
        </div>

        <div className="trust-note">
          <ShieldCheck size={16} strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 1, color: 'var(--petrol)' }} />
          Garantie de 24 mois incluse · Livraison sous 7 jours
        </div>
      </div>
    </div>
  )
}