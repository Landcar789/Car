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
// Email au gérant : le client a déclaré avoir envoyé son reçu
export async function sendManagerReceiptAlert(order: OrderInfo) {
  try {
    await resend.emails.send({
      from: FROM,
      to: MANAGER_EMAIL,
      subject: `Reçu envoyé — CMD-${order.reference} à vérifier`,
      html: `
        <h2>Un client a envoyé son reçu de paiement</h2>
        <p>Le client indique avoir effectué le virement pour la commande suivante. Vérifiez votre WhatsApp ou votre boîte mail pour retrouver le reçu, puis validez la commande dans le tableau de bord.</p>
        <p><strong>Référence :</strong> CMD-${order.reference}</p>
        <p><strong>Véhicule :</strong> ${order.vehicleName}</p>
        <p><strong>Acompte attendu :</strong> ${order.depositAmount.toLocaleString('fr-FR')} €</p>
        <hr>
        <p><strong>Client :</strong> ${order.fullName}</p>
        <p><strong>Email :</strong> ${order.email}</p>
        <p><strong>WhatsApp :</strong> ${order.whatsapp}</p>
      `,
    })
  } catch (err) {
    console.error('Erreur envoi alerte reçu gérant :', err)
  }
}

// Email au client : accusé de réception de sa déclaration d'envoi de reçu
export async function sendClientReceiptAck(order: OrderInfo) {
  try {
    await resend.emails.send({
      from: FROM,
      to: order.email,
      subject: `Nous avons bien noté l'envoi de votre reçu — CMD-${order.reference}`,
      html: `
        <h2>Merci !</h2>
        <p>Bonjour ${order.fullName},</p>
        <p>Nous avons bien noté que vous avez envoyé votre reçu de paiement pour la commande <strong>CMD-${order.reference}</strong> (${order.vehicleName}).</p>
        <p>Notre équipe vérifie votre paiement et vous recevrez une confirmation définitive sous 24 à 48h ouvrées.</p>
        <p>Merci de votre confiance,<br>L'équipe Deutschland Auto Car</p>
      `,
    })
  } catch (err) {
    console.error('Erreur envoi accusé reçu client :', err)
  }
}