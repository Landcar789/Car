'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/LanguageContext'

export default function FavoriteButton({ vehicleId, className }: { vehicleId: string; className?: string }) {
  const router = useRouter()
  const { t } = useLanguage()
  const [fav, setFav] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id ?? null
      setUserId(uid)
      if (uid) {
        const { data: existing } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', uid)
          .eq('vehicle_id', vehicleId)
          .maybeSingle()
        setFav(!!existing)
      }
    })
  }, [vehicleId])

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!userId) {
      const goLogin = window.confirm(t.account.loginToFav)
      if (goLogin) {
        router.push('/connexion')
      }
      return
    }

    setLoading(true)
    const supabase = createClient()

    if (fav) {
      await supabase.from('favorites').delete().eq('user_id', userId).eq('vehicle_id', vehicleId)
      setFav(false)
    } else {
      await supabase.from('favorites').insert({ user_id: userId, vehicle_id: vehicleId })
      setFav(true)
    }
    setLoading(false)
  }

  return (
    <button className={className} onClick={toggle} disabled={loading} type="button" style={{ cursor: 'pointer' }}>
      {fav ? '♥' : '♡'}
    </button>
  )
}