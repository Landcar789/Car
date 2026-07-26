import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CarCard from '@/components/CarCard'
import MarketplaceFilters from '@/components/MarketplaceFilters'
import { createClient } from '@/lib/supabase/server'

export default async function MarketplacePage() {
  const supabase = await createClient()
  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('*, vehicle_photos(url, position)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return (
    <>
      <Header />
      <MarketplaceFilters count={vehicles?.length ?? 0} />
      <div className="wrap">
        {error && <p style={{ color: 'crimson' }}>Erreur : {error.message}</p>}
        <div className="car-grid">
          {vehicles?.map((v) => (
            <CarCard key={v.id} vehicle={v} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}