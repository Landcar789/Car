import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ConfirmationPage from '@/components/ConfirmationPage'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function ConfirmationRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, vehicles(brand, model, year)')
    .eq('id', id)
    .single()

  if (!order) {
    notFound()
  }

  return (
    <>
      <Header />
      <ConfirmationPage order={order} />
      <Footer />
    </>
  )
}