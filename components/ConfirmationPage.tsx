import { Check, MessageCircle } from 'lucide-react'

type Order = {
  id: string
  vehicle_price: number
  deposit_amount: number
  vehicles: {
    brand: string
    model: string
    year: number | null
  }
}

export default function ConfirmationPage({ order }: { order: Order }) {
  const reste = order.vehicle_price - order.deposit_amount
  const reference = order.id.slice(0, 8).toUpperCase()

  const whatsappMessage = encodeURIComponent(
    `Bonjour, je vous contacte au sujet de ma commande CMD-${reference} (${order.vehicles.brand} ${order.vehicles.model}).`
  )
  const whatsappLink = `https://wa.me/491778612854?text=${whatsappMessage}`

  return (
    <div className="narrow-wrap">
      <div className="narrow-topbar">
        <div style={{ fontFamily: 'Oswald, sans-serif', fontWeight: 700, fontSize: 20, textTransform: 'uppercase' }}>
          Commande confirmée
        </div>
        <div className="order-tag">Commande <b>CMD-{reference}</b></div>
      </div>

      <div className="achat-steps">
        <div className="step done">1. Article</div>
        <div className="step done">2. Formulaire d&apos;achat</div>
        <div className="step done">3. Paiement de l&apos;acompte</div>
        <div className="step done">4. Confirmation</div>
      </div>

      <div className="success-block">
        <div className="success-icon">
          <Check size={34} strokeWidth={2.5} />
        </div>
        <h1 className="fade-up d1">Reçu bien envoyé !</h1>
        <p className="fade-up d2">
          Votre reçu de paiement a été transmis. Notre équipe le vérifie et vous recevrez une confirmation définitive par email et WhatsApp.
        </p>
        <div className="status-pill fade-up d3">
          <span className="dot"></span>En attente de vérification
        </div>
      </div>

      <div className="narrow-card fade-up d1">
        <h2>Récapitulatif</h2>
        <div className="recap-row"><span>Véhicule</span><b>{order.vehicles.brand} {order.vehicles.model} {order.vehicles.year}</b></div>
        <div className="recap-row"><span>Prix total</span><b>{order.vehicle_price.toLocaleString('fr-FR')} €</b></div>
        <div className="recap-row total"><span>Acompte réglé (25%)</span><b>{order.deposit_amount.toLocaleString('fr-FR')} €</b></div>
        <div className="recap-row"><span>Reste à payer</span><b>{reste.toLocaleString('fr-FR')} €</b></div>
      </div>

      <div className="narrow-card fade-up d2">
        <h2>Et maintenant ?</h2>
        <div className="timeline">
          <div className="tl-item">
            <div className="tl-dot done">✓</div>
            <div className="tl-content"><h4>Commande et acompte reçus</h4><p>Formulaire validé, reçu transmis</p></div>
          </div>
          <div className="tl-item">
            <div className="tl-dot current">2</div>
            <div className="tl-content"><h4>Vérification par notre équipe</h4><p>Sous 24 à 48h ouvrées</p></div>
          </div>
          <div className="tl-item">
            <div className="tl-dot pending">3</div>
            <div className="tl-content"><h4>Confirmation définitive</h4><p>Email + WhatsApp, avec les instructions pour le solde restant</p></div>
          </div>
          <div className="tl-item">
            <div className="tl-dot pending">4</div>
            <div className="tl-content"><h4>Livraison</h4><p>Sous 7 jours — solde (75%) réglé comptant ou en mensualités sans intérêt (6 à 36 mois)</p></div>
          </div>
        </div>
      </div>

      <div className="next-note fade-up d3">
        <span>📲</span>
        <span>Une question ? Contactez-nous directement sur WhatsApp en mentionnant votre numéro de commande <b>CMD-{reference}</b>.</span>
      </div>

      <div className="confirm-actions fade-up d4">
        <a href="/" style={{ flex: 1 }}>
          <button className="btn-primary-confirm" style={{ width: '100%' }}>Retour à l&apos;accueil</button>
        </a>
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
          <MessageCircle size={16} />
          WhatsApp
        </a>
      </div>
    </div>
  )
}