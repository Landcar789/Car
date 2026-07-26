import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AccountContent from '@/components/AccountContent'

export default async function ComptePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  const { data: favorites } = await supabase
    .from('favorites')
    .select('vehicle_id, vehicles(id, brand, model, year, price_eur, vehicle_photos(url, position))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: orders } = await supabase
    .from('orders')
    .select('id, created_at, status, vehicle_price, deposit_amount, vehicles(brand, model, year)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <>
      <Header />
      <AccountContent
        email={user.email ?? ''}
        favorites={favorites ?? []}
        orders={orders ?? []}
      />
      <Footer />
    </>
  )
}