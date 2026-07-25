import Header from '@/components/Header'
import Footer from '@/components/Footer'
import VehicleDetail from '@/components/VehicleDetail'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function VehiculePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: vehicle } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .single()

  if (!vehicle) {
    notFound()
  }

  return (
    <>
      <Header />
      <div className="breadcrumb">
        <a href="/marketplace">Marketplace</a> / {vehicle.brand} / <b>{vehicle.model} {vehicle.year}</b>
      </div>
      <VehicleDetail vehicle={vehicle} />
      <Footer />
    </>
  )
}