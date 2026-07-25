'use client'

import { useState } from 'react'
import Link from 'next/link'

type Vehicle = {
  id: string
  brand: string
  model: string
  year: number | null
  price_eur: number
  transmission: string | null
  fuel: string | null
  mileage_km: number | null
}

export default function CarCard({ vehicle }: { vehicle: Vehicle }) {
  const [fav, setFav] = useState(false)

  return (
    <Link href={`/vehicule/${vehicle.id}`} className="car-card">
      <div className="car-photo">
        Photo véhicule
        <div
          className="fav-btn"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setFav(!fav)
          }}
        >
          {fav ? '♥' : '♡'}
        </div>
      </div>
      <div className="car-body">
        <p className="car-name">{vehicle.brand} {vehicle.model} {vehicle.year}</p>
        <p className="car-meta">
          {[vehicle.fuel, vehicle.transmission, vehicle.mileage_km ? `${vehicle.mileage_km.toLocaleString('fr-FR')} km` : null]
            .filter(Boolean)
            .join(' · ')}
        </p>
        <p className="car-price">{vehicle.price_eur.toLocaleString('fr-FR')} €</p>
      </div>
    </Link>
  )
}