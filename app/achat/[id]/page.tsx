import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PurchaseForm from '@/components/PurchaseForm'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function AchatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: vehicle } = await supabase
    .from('vehicles')
    .select('*, vehicle_photos(url, position)')
    .eq('id', id)
    .single()

  if (!vehicle) {
    notFound()
  }

  return (
    <>
      <Header />
      <PurchaseForm vehicle={vehicle} />
      <Footer />
    </>
  )
}