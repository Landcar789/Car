'use client'

import { useState } from 'react'

type FaqItem = { q: string; a: React.ReactNode }
type FaqGroup = { category: string; items: FaqItem[] }

const faqData: FaqGroup[] = [
  {
    category: 'Commande & Paiement',
    items: [
      { q: 'Combien dois-je payer pour valider ma commande ?', a: <>Un acompte de <span className="highlight">25% du prix du véhicule</span> est demandé à la commande. Les 75% restants sont payables en mensualités sans intérêt, de 6 à 36 mois.</> },
      { q: 'Puis-je payer la totalité en une seule fois ?', a: <>Oui, et dans ce cas vous bénéficiez de <span className="highlight">15% de remise</span> sur le prix total si le paiement comptant est effectué dès la commande.</> },
      { q: 'Comment envoyer la preuve de mon virement ?', a: <>Une fois le virement effectué vers le compte indiqué (IBAN fourni sur la page de paiement), déposez votre reçu directement sur la page dédiée. Vous recevrez une confirmation par email et sur WhatsApp.</> },
    ],
  },
  {
    category: 'Livraison',
    items: [
      { q: 'Quel est le délai de livraison ?', a: <>Le délai moyen est de <span className="highlight">7 jours</span> après validation complète du paiement, formalités d&apos;importation incluses.</> },
      { q: 'Puis-je me rétracter après ma commande ?', a: <>Oui, vous disposez d&apos;un droit de rétractation de <span className="highlight">14 jours</span>, satisfait ou remboursé.</> },
      { q: "Qui s'occupe des formalités d'importation ?", a: <>Nous prenons en charge l&apos;ensemble des démarches d&apos;importation jusqu&apos;à la livraison à votre domicile.</> },
    ],
  },
  {
    category: 'Garantie & SAV',
    items: [
      { q: 'Les véhicules sont-ils garantis ?', a: <>Tous nos véhicules bénéficient d&apos;une garantie de <span className="highlight">24 mois</span>.</> },
      { q: "Que couvre le service d'entretien ?", a: <>Nos techniciens prennent en charge l&apos;entretien courant et les réparations nécessaires sur les véhicules achetés via la plateforme.</> },
    ],
  },
  {
    category: 'Compte & Favoris',
    items: [
      { q: 'Comment créer un compte ?', a: <>Inscrivez-vous avec votre email et un mot de passe. Un lien de confirmation vous est envoyé par email pour valider votre compte.</> },
      { q: 'À quoi sert le bouton favoris ?', a: <>Il vous permet de mettre de côté les véhicules qui vous intéressent pour les retrouver facilement, sans passer commande tout de suite.</> },
    ],
  },
]

export default function FaqSection() {
  const [activeCategory, setActiveCategory] = useState('Toutes')
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(['Commande & Paiement-0']))

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const categories = ['Toutes', ...faqData.map((g) => g.category)]
  const visibleGroups = activeCategory === 'Toutes' ? faqData : faqData.filter((g) => g.category === activeCategory)

  return (
    <>
      <div className="page-head">
        <div className="eyebrow fade-up d1">Besoin d&apos;aide ?</div>
        <h1 className="fade-up d2">Questions fréquentes</h1>
        <p className="fade-up d3">Tout ce qu&apos;il faut savoir avant d&apos;acheter, payer ou faire livrer votre véhicule.</p>
      </div>

      <div className="categories">
        {categories.map((cat) => (
          <div
            key={cat}
            className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </div>
        ))}
      </div>

      <div className="faq-wrap">
        {visibleGroups.map((group) => (
          <div className="faq-group" key={group.category}>
            <h2>{group.category}</h2>
            {group.items.map((item, i) => {
              const key = `${group.category}-${i}`
              const isOpen = openItems.has(key)
              return (
                <div key={key} className={`faq-item ${isOpen ? 'open' : ''}`}>
                  <div className="faq-q" onClick={() => toggleItem(key)}>
                    {item.q}
                    <span className="faq-toggle">+</span>
                  </div>
                  {isOpen && <div className="faq-a" style={{ paddingBottom: 16 }}>{item.a}</div>}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </>
  )
}