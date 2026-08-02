'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Review = {
  id: string
  author_name: string
  rating: number
  comment: string
  location: string | null
  created_at: string
}

export default function ReviewsAdmin({ reviews }: { reviews: Review[] }) {
  const router = useRouter()
  const [authorName, setAuthorName] = useState('')
  const [rating, setRating] = useState('5')
  const [comment, setComment] = useState('')
  const [location, setLocation] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleAdd = async () => {
    if (!authorName.trim() || !comment.trim()) return
    setSaving(true)
    await fetch('/api/admin/add-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author_name: authorName, rating, comment, location }),
    })
    setAuthorName(''); setRating('5'); setComment(''); setLocation('')
    setSaving(false)
    router.refresh()
  }

  const handleDelete = async (reviewId: string) => {
    setDeleting(reviewId)
    await fetch('/api/admin/delete-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId }),
    })
    setDeleting(null)
    router.refresh()
  }

  return (
    <div className="admin-card">
      <h2 className="section-title">Avis clients ({reviews.length})</h2>

      {/* Formulaire d'ajout */}
      <div style={{ display: 'grid', gap: 10, marginBottom: 24, maxWidth: 500 }}>
        <input
          type="text"
          placeholder="Nom du client"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          style={{ padding: 10, fontSize: 14, border: '1px solid var(--line)', borderRadius: 6 }}
        />
        <input
          type="text"
          placeholder="Ville / Pays (ex: Kehl, Allemagne)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ padding: 10, fontSize: 14, border: '1px solid var(--line)', borderRadius: 6 }}
        />
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          style={{ padding: 10, fontSize: 14, border: '1px solid var(--line)', borderRadius: 6 }}
        >
          <option value="5">★★★★★ (5 étoiles)</option>
          <option value="4">★★★★ (4 étoiles)</option>
          <option value="3">★★★ (3 étoiles)</option>
          <option value="2">★★ (2 étoiles)</option>
          <option value="1">★ (1 étoile)</option>
        </select>
        <textarea
          placeholder="Texte de l'avis"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          style={{ padding: 10, fontSize: 14, border: '1px solid var(--line)', borderRadius: 6, resize: 'vertical' }}
        />
        <button
          onClick={handleAdd}
          disabled={saving}
          className="admin-btn"
          style={{ justifySelf: 'start' }}
        >
          {saving ? 'Ajout...' : 'Ajouter l\'avis'}
        </button>
      </div>

      {/* Liste des avis existants */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {reviews.map((r) => (
          <div key={r.id} style={{ border: '1px solid var(--line)', borderRadius: 8, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
              <div>
                <div style={{ fontWeight: 600 }}>
                  {r.author_name} {r.location && <span style={{ color: 'var(--text-dim)', fontWeight: 400, fontSize: 13 }}>· {r.location}</span>}
                </div>
                <div style={{ color: 'var(--gold)', fontSize: 14, margin: '2px 0' }}>
                  {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--text-dim)' }}>{r.comment}</div>
              </div>
              <button
                onClick={() => handleDelete(r.id)}
                disabled={deleting === r.id}
                style={{ background: 'transparent', border: '1px solid var(--alert)', color: 'var(--alert)', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer', flexShrink: 0 }}
              >
                {deleting === r.id ? '...' : 'Supprimer'}
              </button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>Aucun avis pour le moment.</p>}
      </div>
    </div>
  )
}