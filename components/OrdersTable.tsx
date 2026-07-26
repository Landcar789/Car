'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Order = {
  id: string
  created_at: string
  full_name: string
  email: string
  whatsapp: string
  vehicle_price: number
  deposit_amount: number
  status: string
  vehicles: { brand: string; model: string } | null
  payments: { id: string; receipt_url: string; status: string }[]
}

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter()
  const [saving, setSaving] = useState<string | null>(null)

  const handleValidatePayment = async (orderId: string, paymentId: string | null) => {
    setSaving(orderId)
    await fetch('/api/admin/validate-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, paymentId }),
    })
    setSaving(null)
    router.refresh()
  }

  return (
    <div className="admin-card">
      <h2 className="section-title">Commandes ({orders.length})</h2>
      <p style={{ fontSize: 12.5, color: 'var(--text-dim)', marginTop: -8, marginBottom: 16 }}>
        Les reçus sont envoyés par le client via WhatsApp ou email. Vérifiez le reçu reçu avant de valider une commande.
      </p>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Commande</th>
            <th>Client</th>
            <th>Véhicule</th>
            <th>Acompte</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const payment = order.payments?.[0]
            const reference = order.id.slice(0, 8).toUpperCase()
            const isConfirmed = order.status === 'confirmed'
            return (
              <tr key={order.id}>
                <td>CMD-{reference}<br /><span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span></td>
                <td>
                  {order.full_name}<br />
                  <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{order.email}</span><br />
                  <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>WhatsApp : {order.whatsapp}</span>
                </td>
                <td>{order.vehicles?.brand} {order.vehicles?.model}</td>
                <td>{order.deposit_amount.toLocaleString('fr-FR')} €</td>
                <td>
                  <span className={`status-badge ${isConfirmed ? 'verified' : 'pending'}`}>
                    {isConfirmed ? 'Confirmée' : 'En attente'}
                  </span>
                </td>
                <td>
                  {!isConfirmed && (
                    <button
                      className="admin-btn"
                      onClick={() => handleValidatePayment(order.id, payment?.id ?? null)}
                      disabled={saving === order.id}
                    >
                      {saving === order.id ? '...' : 'Valider'}
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