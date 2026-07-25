'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DeleteVehicleButton({ vehicleId, vehicleName }: { vehicleId: string; vehicleName: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    const confirmed = window.confirm(`Supprimer définitivement "${vehicleName}" ? Cette action est irréversible.`)
    if (!confirmed) return

    setDeleting(true)
    const supabase = createClient()

    await supabase.from('vehicle_photos').delete().eq('vehicle_id', vehicleId)
    await supabase.from('vehicles').delete().eq('id', vehicleId)

    setDeleting(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      style={{
        background: 'transparent', border: '1px solid var(--alert)', color: 'var(--alert)',
        padding: '5px 10px', borderRadius: 6, fontSize: 11.5, cursor: 'pointer',
      }}
    >
      {deleting ? '...' : 'Supprimer'}
    </button>
  )
}