import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MarketplaceFilters from '@/components/MarketplaceFilters'
import { createClient } from '@/lib/supabase/server'

export default async function MarketplacePage() {
  const supabase = await createClient()
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*, vehicle_photos(url, position)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return (
    <>
      <Header />
      <MarketplaceFilters vehicles={vehicles ?? []} />
      <Footer />
    </>
  )
}