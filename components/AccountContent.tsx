'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/lib/LanguageContext'
import LogoutButton from '@/components/LogoutButton'

type VehicleData = {
  id: string
  brand: string
  model: string
  year: number | null
  price_eur: number
  vehicle_photos?: { url: string; position: number }[]
}

type Favorite = {
  vehicle_id: string
  vehicles: VehicleData | VehicleData[] | null
}

type OrderVehicle = { brand: string; model: string; year: number | null }

type Order = {
  id: string
  created_at: string
  status: string
  vehicle_price: number
  deposit_amount: number
  vehicles: OrderVehicle | OrderVehicle[] | null
}

export default function AccountContent({
  email,
  favorites,
  orders,
}: {
  email: string
  favorites: Favorite[]
  orders: Order[]
}) {
  const { t } = useLanguage()

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontFamily: 'Oswald, sans-serif' }}>{t.account.title}</h1>
      <p>✅ {t.account.connectedAs} <strong>{email}</strong></p>
      <LogoutButton />

      {/* FAVORIS */}
      <h2 style={{ fontFamily: 'Oswald, sans-serif', fontSize: 20, marginTop: 40, marginBottom: 16 }}>{t.account.favoritesTitle}</h2>
      {favorites.length === 0 ? (
        <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>{t.account.noFavorites}</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {favorites.map((f) => {
            const v = Array.isArray(f.vehicles) ? f.vehicles[0] : f.vehicles
            if (!v) return null
            const photos = [...(v.vehicle_photos ?? [])].sort((a, b) => a.position - b.position)
            return (
              <Link key={f.vehicle_id} href={`/vehicule/${v.id}`} className="car-card">
                <div className="car-photo">
                  {photos[0] ? (
                    <Image src={photos[0].url} alt={`${v.brand} ${v.model}`} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    t.marketplace.photo
                  )}
                </div>
                <div className="car-body">
                  <p className="car-name">{v.brand} {v.model} {v.year}</p>
                  <p className="car-price">{v.price_eur.toLocaleString('fr-FR')} €</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* COMMANDES */}
      <h2 style={{ fontFamily: 'Oswald, sans-serif', fontSize: 20, marginTop: 40, marginBottom: 16 }}>{t.account.ordersTitle}</h2>
      {orders.length === 0 ? (
        <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>{t.account.noOrders}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map((order) => {
            const reference = order.id.slice(0, 8).toUpperCase()
            const isConfirmed = order.status === 'confirmed'
            const ov = Array.isArray(order.vehicles) ? order.vehicles[0] : order.vehicles
            return (
              <div key={order.id} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <p style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 600, margin: '0 0 4px' }}>
                      {ov?.brand ?? ''} {ov?.model ?? ''} {ov?.year ?? ''}
                    </p>
                    <p style={{ fontSize: 12.5, color: 'var(--text-dim)', margin: 0 }}>
                      CMD-{reference} · {t.account.orderDate} {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`status-badge ${isConfirmed ? 'verified' : 'pending'}`}>
                      {isConfirmed ? t.account.statusConfirmed : t.account.statusPending}
                    </span>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700, color: 'var(--petrol)', margin: '6px 0 0' }}>
                      {order.vehicle_price.toLocaleString('fr-FR')} €
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}