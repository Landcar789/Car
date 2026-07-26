'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/lib/LanguageContext'

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

export default function CarCard({ vehicle }: { vehicle: Vehicle }) {
  const [fav, setFav] = useState(false)
  const { t } = useLanguage()

  const photos = [...(vehicle.vehicle_photos ?? [])].sort((a, b) => a.position - b.position)
  const mainPhoto = photos[0]?.url

  return (
    <Link href={`/vehicule/${vehicle.id}`} className="car-card">
      <div className="car-photo">
        {mainPhoto ? (
          <Image src={mainPhoto} alt={`${vehicle.brand} ${vehicle.model}`} fill style={{ objectFit: 'cover' }} />
        ) : (
          t.marketplace.photo
        )}
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