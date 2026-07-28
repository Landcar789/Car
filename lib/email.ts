import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'Deutschland Auto Car <commande@deutschlandautocar.com>'
const MANAGER_EMAIL = 'deutschlandautocar@gmail.com'

type OrderInfo = {
  reference: string
  fullName: string
  email: string
  phone: string
  whatsapp: string
  vehicleName: string
  vehiclePrice: number
  depositAmount: number
}

// Email envoyé au gérant quand une commande arrive
export async function sendManagerNotification(order: OrderInfo) {
  try {
    await resend.emails.send({
      from: FROM,
      to: MANAGER_EMAIL,
      subject: `Nouvelle commande CMD-${order.reference} — ${order.vehicleName}`,
      html: `
        <h2>Nouvelle commande reçue</h2>
        <p><strong>Référence :</strong> CMD-${order.reference}</p>
        <p><strong>Véhicule :</strong> ${order.vehicleName}</p>
        <p><strong>Prix :</strong> ${order.vehiclePrice.toLocaleString('fr-FR')} €</p>
        <p><strong>Acompte (25%) :</strong> ${order.depositAmount.toLocaleString('fr-FR')} €</p>
        <hr>
        <h3>Client</h3>
        <p><strong>Nom :</strong> ${order.fullName}</p>
        <p><strong>Email :</strong> ${order.email}</p>
        <p><strong>Téléphone :</strong> ${order.phone}</p>
        <p><strong>WhatsApp :</strong> ${order.whatsapp}</p>
        <hr>
        <p>Connectez-vous au tableau de bord pour voir les détails et valider le paiement une fois le reçu reçu.</p>
      `,
    })
  } catch (err) {
    console.error('Erreur envoi email gérant :', err)
  }
}

// Email de confirmation envoyé au client
export async function sendClientConfirmation(order: OrderInfo) {
  try {
    await resend.emails.send({
      from: FROM,
      to: order.email,
      subject: `Confirmation de votre commande CMD-${order.reference}`,
      html: `
        <h2>Merci pour votre commande !</h2>
        <p>Bonjour ${order.fullName},</p>
        <p>Nous avons bien enregistré votre commande. Voici le récapitulatif :</p>
        <p><strong>Référence :</strong> CMD-${order.reference}</p>
        <p><strong>Véhicule :</strong> ${order.vehicleName}</p>
        <p><strong>Prix total :</strong> ${order.vehiclePrice.toLocaleString('fr-FR')} €</p>
        <p><strong>Acompte à régler (25%) :</strong> ${order.depositAmount.toLocaleString('fr-FR')} €</p>
        <hr>
        <p>Pour finaliser, effectuez le virement de l'acompte puis envoyez-nous votre reçu par WhatsApp ou email en indiquant votre référence <strong>CMD-${order.reference}</strong>.</p>
        <p>Notre équipe validera votre commande sous 24 à 48h.</p>
        <p>À bientôt,<br>L'équipe Deutschland Auto Car</p>
      `,
    })
  } catch (err) {
    console.error('Erreur envoi email client :', err)
  }
}