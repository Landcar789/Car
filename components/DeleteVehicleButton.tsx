'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DeleteVehicleButton({ vehicleId, vehicleName, isPublished }: { vehicleId: string; vehicleName: string; isPublished: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleToggle = async () => {
    const action = isPublished ? 'retirer du catalogue' : 'republier'
    const confirmed = window.confirm(`${action === 'retirer du catalogue' ? 'Retirer' : 'Republier'} "${vehicleName}" ?`)
    if (!confirmed) return

    setLoading(true)
    setError(null)
    const supabase = createClient()

    const { error } = await supabase
      .from('vehicles')
      .update({ is_published: !isPublished })
      .eq('id', vehicleId)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setLoading(false)
    router.refresh()
  }

  return (
    <div>
      <button
        onClick={handleToggle}
        disabled={loading}
        style={{
          background: 'transparent',
          border: `1px solid ${isPublished ? 'var(--alert)' : 'var(--ok)'}`,
          color: isPublished ? 'var(--alert)' : 'var(--ok)',
          padding: '5px 10px', borderRadius: 6, fontSize: 11.5, cursor: 'pointer',
        }}
      >
        {loading ? '...' : isPublished ? 'Retirer' : 'Republier'}
      </button>
      {error && <p style={{ color: 'crimson', fontSize: 11, marginTop: 4 }}>{error}</p>}
    </div>
  )
}