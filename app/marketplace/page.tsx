import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CarCard from '@/components/CarCard'
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

      <div className="filterbar">
        <input className="grow" type="text" placeholder="Rechercher une marque, un modèle..." />
        <select><option>Marque</option></select>
        <select><option>Transmission</option></select>
        <select><option>Carburant</option></select>
        <select><option>Prix</option></select>
        <select><option>Plus récents</option></select>
      </div>

      <div className="wrap">
        <div className="result-count">
          <b>{vehicles?.length ?? 0}</b> véhicule{(vehicles?.length ?? 0) > 1 ? 's' : ''} disponible{(vehicles?.length ?? 0) > 1 ? 's' : ''}
        </div>

        {error && <p style={{ color: 'crimson' }}>Erreur : {error.message}</p>}

        <div className="car-grid">
          {vehicles?.map((v) => (
            <CarCard key={v.id} vehicle={v} />
          ))}
        </div>

        {vehicles?.length === 0 && (
          <p style={{ color: 'var(--text-dim)' }}>Aucun véhicule disponible pour le moment.</p>
        )}
      </div>

      <Footer />
    </>
  )
}