import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ADMIN_EMAIL } from '@/lib/admin'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import OrdersTable from '@/components/OrdersTable'
import PaymentSettingsForm from '@/components/PaymentSettingsForm'
import Link from 'next/link'

export default async function AdminOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/connexion')
  }

  const { data: orders } = await supabase
    .from('orders')
    .select('*, vehicles(brand, model), payments(id, receipt_url, status)')
    .order('created_at', { ascending: false })

  const { data: settings } = await supabase
    .from('payment_settings')
    .select('beneficiary_name, iban, bic')
    .eq('id', 1)
    .single()

  return (
    <>
      <Header />
      <div className="admin-wrap">
        <h1 style={{ fontFamily: 'Oswald, sans-serif' }}>Tableau de bord admin</h1>

        <div className="admin-tabs">
          <Link href="/admin" className="admin-tab">Véhicules</Link>
          <Link href="/admin/commandes" className="admin-tab active">Commandes</Link>
        </div>

        {settings && <PaymentSettingsForm settings={settings} />}

        <OrdersTable orders={orders ?? []} />
      </div>
      <Footer />
    </>
  )
}