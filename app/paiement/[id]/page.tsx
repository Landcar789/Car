import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PaymentPage from '@/components/PaymentPage'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function PaiementRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, vehicles(id, brand, model)')
    .eq('id', id)
    .single()

  if (!order) {
    notFound()
  }

  return (
    <>
      <Header />
      <PaymentPage order={order} />
      <Footer />
    </>
  )
}