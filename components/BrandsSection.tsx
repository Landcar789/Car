'use client'

import { useLanguage } from '@/lib/LanguageContext'

const showcaseBrands: { name: string; logo: string | null }[] = [
  { name: 'BMW', logo: 'bmw' },
  { name: 'Mercedes-Benz', logo: null },
  { name: 'Audi', logo: 'audi' },
  { name: 'Volkswagen', logo: 'volkswagen' },
  { name: 'Porsche', logo: 'porsche' },
  { name: 'Toyota', logo: 'toyota' },
  { name: 'Honda', logo: 'honda' },
  { name: 'Hyundai', logo: 'hyundai' },
  { name: 'Kia', logo: 'kia' },
  { name: 'Ford', logo: 'ford' },
  { name: 'Renault', logo: 'renault' },
  { name: 'Tesla', logo: 'tesla' },
]

export default function BrandsSection() {
  const { t } = useLanguage()

  return (
    <div className="brands-section">
      <div className="brands-head">
        <div>
          <div className="brands-eyebrow">{t.marketplace.brandsEyebrow}</div>
          <h2 className="brands-title">{t.marketplace.brandsTitle}</h2>
        </div>
        <a className="brands-seeall" href="/marketplace">
          {t.marketplace.brandsSeeAll} →
        </a>
      </div>

      <div className="brands-grid">
        {showcaseBrands.map((b) => (
          
        <a    key={b.name}
            className="brand-card"
            href={`/marketplace?marque=${encodeURIComponent(b.name)}`}
          >
            <span className="brand-logo">
              {b.logo ? (
                <img
                  src={`https://cdn.simpleicons.org/${b.logo}`}
                  alt={b.name}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
              ) : null}
            </span>
            <span className="brand-nm">{b.name}</span>
          </a>
        ))}
      </div>

      <div className="brands-footer">
        <div className="l1">{t.marketplace.brandsNotListed}</div>
        <a className="l2" href="/marketplace">
          {t.marketplace.brandsSeeAllVehicles} →
        </a>
      </div>
    </div>
  )
}