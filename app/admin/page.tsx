import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ADMIN_EMAIL } from '@/lib/admin'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AddVehicleForm from '@/components/AddVehicleForm'
import DeleteVehicleButton from '@/components/DeleteVehicleButton'
import ReviewsAdmin from '@/components/ReviewsAdmin'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/connexion')
  }

  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <>
      <Header />
      <div className="admin-wrap">
        <h1 style={{ fontFamily: 'Oswald, sans-serif' }}>Tableau de bord admin</h1>

        <div className="admin-tabs">
          <Link href="/admin" className="admin-tab active">Véhicules</Link>
          <Link href="/admin/commandes" className="admin-tab">Commandes</Link>
        </div>

        <AddVehicleForm />

        <div className="admin-card">
          <h2 className="section-title">Catalogue actuel ({vehicles?.length ?? 0})</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Véhicule</th>
                <th>Prix</th>
                <th>Ajouté le</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {vehicles?.map((v) => (
                <tr key={v.id}>
                  <td>{v.brand} {v.model} {v.year}</td>
                  <td>{v.price_eur.toLocaleString('fr-FR')} €</td>
                  <td>{new Date(v.created_at).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <span className={`status-badge ${v.is_published ? 'verified' : 'pending'}`}>
                      {v.is_published ? 'Publié' : 'Masqué'}
                    </span>
                  </td>
                  <td><DeleteVehicleButton vehicleId={v.id} vehicleName={`${v.brand} ${v.model}`} isPublished={v.is_published} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ReviewsAdmin reviews={reviews ?? []} />
      </div>
      <Footer />
    </>
  )
}