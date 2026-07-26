'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

export default function FaqSection() {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('all')
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(['payment-0']))

  const faqData = [
    {
      key: 'payment',
      category: t.faq.catPayment,
      items: [
        { q: t.faq.q.pay1q, a: t.faq.q.pay1a },
        { q: t.faq.q.pay2q, a: t.faq.q.pay2a },
        { q: t.faq.q.pay3q, a: t.faq.q.pay3a },
      ],
    },
    {
      key: 'delivery',
      category: t.faq.catDelivery,
      items: [
        { q: t.faq.q.del1q, a: t.faq.q.del1a },
        { q: t.faq.q.del2q, a: t.faq.q.del2a },
        { q: t.faq.q.del3q, a: t.faq.q.del3a },
      ],
    },
    {
      key: 'warranty',
      category: t.faq.catWarranty,
      items: [
        { q: t.faq.q.war1q, a: t.faq.q.war1a },
        { q: t.faq.q.war2q, a: t.faq.q.war2a },
      ],
    },
    {
      key: 'account',
      category: t.faq.catAccount,
      items: [
        { q: t.faq.q.acc1q, a: t.faq.q.acc1a },
        { q: t.faq.q.acc2q, a: t.faq.q.acc2a },
      ],
    },
  ]

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const categories = [{ key: 'all', label: t.faq.all }, ...faqData.map((g) => ({ key: g.key, label: g.category }))]
  const visibleGroups = activeCategory === 'all' ? faqData : faqData.filter((g) => g.key === activeCategory)

  return (
    <>
      <div className="page-head">
        <div className="eyebrow fade-up d1">{t.faq.eyebrow}</div>
        <h1 className="fade-up d2">{t.faq.title}</h1>
        <p className="fade-up d3">{t.faq.subtitle}</p>
      </div>

      <div className="categories">
        {categories.map((cat) => (
          <div
            key={cat.key}
            className={`cat-pill ${activeCategory === cat.key ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </div>
        ))}
      </div>

      <div className="faq-wrap">
        {visibleGroups.map((group) => (
          <div className="faq-group" key={group.key}>
            <h2>{group.category}</h2>
            {group.items.map((item, i) => {
              const key = `${group.key}-${i}`
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