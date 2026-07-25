'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Order = {
  id: string
  created_at: string
  full_name: string
  email: string
  vehicle_price: number
  deposit_amount: number
  status: string
  vehicles: { brand: string; model: string } | null
  payments: { id: string; receipt_url: string; status: string }[]
}

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter()
  const [saving, setSaving] = useState<string | null>(null)

  const handleValidatePayment = async (orderId: string, paymentId: string) => {
    setSaving(orderId)
    const supabase = createClient()
    await supabase.from('payments').update({ status: 'verified', verified_at: new Date().toISOString() }).eq('id', paymentId)
    await supabase.from('orders').update({ status: 'confirmed' }).eq('id', orderId)
    setSaving(null)
    router.refresh()
  }

  return (
    <div className="admin-card">
      <h2 className="section-title">Commandes ({orders.length})</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Commande</th>
            <th>Client</th>
            <th>Véhicule</th>
            <th>Acompte</th>
            <th>Reçu</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const payment = order.payments?.[0]
            const reference = order.id.slice(0, 8).toUpperCase()
            return (
              <tr key={order.id}>
                <td>CMD-{reference}<br /><span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span></td>
                <td>{order.full_name}<br /><span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{order.email}</span></td>
                <td>{order.vehicles?.brand} {order.vehicles?.model}</td>
                <td>{order.deposit_amount.toLocaleString('fr-FR')} €</td>
                <td>
                  {payment ? (
                    <a href={payment.receipt_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--petrol)' }}>Voir</a>
                  ) : (
                    <span style={{ color: 'var(--text-dim)' }}>—</span>
                  )}
                </td>
                <td>
                  <span className={`status-badge ${order.status === 'confirmed' ? 'verified' : 'pending'}`}>
                    {order.status === 'confirmed' ? 'Confirmée' : order.status === 'pending_verification' ? 'À vérifier' : 'En attente paiement'}
                  </span>
                </td>
                <td>
                  {payment && payment.status !== 'verified' && (
                    <button
                      className="admin-btn"
                      onClick={() => handleValidatePayment(order.id, payment.id)}
                      disabled={saving === order.id}
                    >
                      Valider
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {orders.length === 0 && <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>Aucune commande pour le moment.</p>}
    </div>
  )
}