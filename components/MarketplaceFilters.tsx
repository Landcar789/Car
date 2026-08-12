'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import CarCard from '@/components/CarCard'
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

export default function MarketplaceFilters({ vehicles }: { vehicles: Vehicle[] }) {
  const { t } = useLanguage()
  const [search, setSearch] = useState('')
  const [brand, setBrand] = useState('')
  const [transmission, setTransmission] = useState('')
  const [fuel, setFuel] = useState('')
  const [price, setPrice] = useState('')

  const searchParams = useSearchParams()
  useEffect(() => {
    const marque = searchParams.get('marque')
    if (marque) setBrand(marque)
  }, [searchParams])

  const brands = useMemo(() => [...new Set(vehicles.map((v) => v.brand).filter(Boolean))].sort(), [vehicles])
  const transmissions = useMemo(() => [...new Set(vehicles.map((v) => v.transmission).filter(Boolean))].sort() as string[], [vehicles])
  const fuels = useMemo(() => [...new Set(vehicles.map((v) => v.fuel).filter(Boolean))].sort() as string[], [vehicles])

  let filtered = vehicles.filter((v) => {
    const q = search.toLowerCase().trim()
    const matchSearch = !q || `${v.brand} ${v.model} ${v.year ?? ''} ${v.fuel ?? ''} ${v.transmission ?? ''}`.toLowerCase().includes(q)
    const matchBrand = !brand || v.brand === brand
    const matchTrans = !transmission || v.transmission === transmission
    const matchFuel = !fuel || v.fuel === fuel
    return matchSearch && matchBrand && matchTrans && matchFuel
  })

  if (price === 'asc') {
    filtered = [...filtered].sort((a, b) => a.price_eur - b.price_eur)
  } else if (price === 'desc') {
    filtered = [...filtered].sort((a, b) => b.price_eur - a.price_eur)
  }

  const count = filtered.length

  const resetFilters = () => {
    setSearch(''); setBrand(''); setTransmission(''); setFuel(''); setPrice('')
  }

  const hasActiveFilter = search || brand || transmission || fuel || price

  return (
    <>
      <div className="filterbar">
        <input
          className="grow"
          type="text"
          placeholder={t.marketplace.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">{t.marketplace.brand}</option>
          {brands.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={transmission} onChange={(e) => setTransmission(e.target.value)}>
          <option value="">{t.marketplace.transmission}</option>
          {transmissions.map((tr) => <option key={tr} value={tr}>{tr}</option>)}
        </select>
        <select value={fuel} onChange={(e) => setFuel(e.target.value)}>
          <option value="">{t.marketplace.fuel}</option>
          {fuels.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <select value={price} onChange={(e) => setPrice(e.target.value)}>
          <option value="">{t.marketplace.price}</option>
          <option value="asc">Prix croissant</option>
          <option value="desc">Prix decroissant</option>
        </select>
      </div>

      <div className="wrap">
        <div className="result-count" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span><b>{count}</b> {count > 1 ? t.marketplace.availablePlural : t.marketplace.available}</span>
          {hasActiveFilter && (
            <button
              onClick={resetFilters}
              style={{ background: 'transparent', border: '1px solid var(--line)', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer', color: 'var(--text-dim)' }}
            >
              {t.marketplace.reset}
            </button>
          )}
        </div>

        <div className="car-grid">
          {filtered.map((v) => (
            <CarCard key={v.id} vehicle={v} />
          ))}
        </div>

        {count === 0 && (
          <p style={{ color: 'var(--text-dim)' }}>{t.marketplace.none}</p>
        )}
      </div>
    </>
  )
}