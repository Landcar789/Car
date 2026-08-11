'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/LanguageContext'
import { translateFuel } from '@/lib/vehicleLabels'

type Vehicle = {
  id: string
  brand: string
  model: string
  year: number | null
  price_eur: number
  fuel: string | null
  transmission: string | null
  mileage_km: number | null
}

type Photo = { vehicle_id: string; url: string }

export default function FeaturedVehicles() {
  const { t } = useLanguage()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [photos, setPhotos] = useState<Record<string, string>>({})
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('vehicles')
      .select('id, brand, model, year, price_eur, fuel, transmission, mileage_km')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(async ({ data }) => {
        const vs = data ?? []
        setVehicles(vs)
        if (vs.length > 0) {
          const ids = vs.map((v) => v.id)
          const { data: ph } = await supabase
            .from('vehicle_photos')
            .select('vehicle_id, url')
            .in('vehicle_id', ids)
            .order('position', { ascending: true })
          const map: Record<string, string> = {}
          ;(ph ?? []).forEach((p: Photo) => {
            if (!map[p.vehicle_id]) map[p.vehicle_id] = p.url
          })
          setPhotos(map)
        }
      })
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [vehicles])

  if (vehicles.length === 0) return null

  return (
    <div ref={sectionRef} style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--petrol)', marginBottom: 8 }}>
            {t.home.featuredEyebrow}
          </div>
          <h2 style={{ fontFamily: 'Oswald, sans-serif', fontSize: 26, fontWeight: 600, margin: 0 }}>{t.home.featuredTitle}</h2>
        </div>
        <a href="/marketplace" style={{ color: 'var(--petrol)', fontSize: 13.5, fontWeight: 600, textDecoration: 'none', border: '1px solid var(--line)', padding: '9px 16px', borderRadius: 8, whiteSpace: 'nowrap' }}>
          {t.home.featuredSeeAll} →
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {vehicles.map((v, i) => (
        <a  
            key={v.id}
            href={`/vehicule/${v.id}`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 14,
              overflow: 'hidden',
              display: 'block',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(60px)',
              transition: `opacity 0.6s ease ${i * 0.18}s, transform 0.6s cubic-bezier(0.2,0.8,0.2,1) ${i * 0.18}s`,
            }}
          >
            <div style={{ height: 180, background: '#e9e7df', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              {photos[v.id] ? (
                <img src={photos[v.id]} alt={`${v.brand} ${v.model}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: 44, opacity: 0.2 }}>🚗</span>
              )}
              {v.fuel ? (
                <div style={{ position: 'absolute', top: 12, left: 12, padding: '5px 12px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: 'rgba(255,255,255,0.92)', color: 'var(--petrol)' }}>
                  {translateFuel(t.vehicle, v.fuel)}
                </div>
              ) : null}
            </div>
            <div style={{ padding: 18 }}>
              <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 17, fontWeight: 600, marginBottom: 6 }}>
                {v.brand} {v.model} {v.year ?? ''}
              </div>
              <div style={{ color: 'var(--text-dim)', fontSize: 12.5, marginBottom: 16 }}>
                {[translateFuel(t.vehicle, v.fuel), v.mileage_km ? `${v.mileage_km.toLocaleString('fr-FR')} km` : null].filter(Boolean).join(' · ')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--line)' }}>
                <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 20 }}>{v.price_eur.toLocaleString('fr-FR')} €</div>
                <span style={{ background: '#fff', color: 'var(--petrol)', border: '1px solid var(--line)', padding: '8px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 600 }}>{t.home.featuredView}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}