'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/LanguageContext'

type Review = {
  id: string
  author_name: string
  rating: number
  comment: string
  location: string | null
}

export default function ReviewsSection() {
  const { t } = useLanguage()
  const [reviews, setReviews] = useState<Review[]>([])
  const [current, setCurrent] = useState(0)
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ').filter(Boolean)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('reviews')
      .select('id, author_name, rating, comment, location')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => setReviews(data ?? []))
  }, [])

  // Défilement automatique toutes les 5 secondes
  useEffect(() => {
    if (reviews.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [reviews.length])

  if (reviews.length === 0) return null

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--petrol)', marginBottom: 8 }}>
          {t.reviews.subtitle}
        </div>
        <h2 style={{ fontFamily: 'Oswald, sans-serif', fontSize: 26, fontWeight: 600, margin: 0 }}>{t.reviews.title}</h2>
      </div>

      {/* Zone du carrousel */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            display: 'flex',
            transition: 'transform 0.5s ease',
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          {reviews.map((r) => (
            <div key={r.id} style={{ minWidth: '100%', boxSizing: 'border-box', padding: '0 4px' }}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, padding: '32px 28px', textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
                <div style={{ color: 'var(--gold)', fontSize: 20, marginBottom: 16, letterSpacing: 3 }}>
                  {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                </div>
                <p style={{ fontSize: 16.5, color: 'var(--text)', margin: '0 0 20px', lineHeight: 1.6, fontStyle: 'italic' }}>
                  “{r.comment}”
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'var(--petrol)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Oswald, sans-serif', fontWeight: 600, fontSize: 16,
                    flexShrink: 0,
                  }}>
                    {getInitials(r.author_name)}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{r.author_name}</div>
                    {r.location && <div style={{ color: 'var(--text-dim)', fontWeight: 400, fontSize: 13 }}>{r.location}</div>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Points de navigation */}
      {reviews.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Avis ${i + 1}`}
              style={{
                width: current === i ? 22 : 8,
                height: 8,
                borderRadius: 4,
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                background: current === i ? 'var(--gold)' : 'var(--line)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}