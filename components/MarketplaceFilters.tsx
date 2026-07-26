'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function MarketplaceFilters({ count }: { count: number }) {
  const { t } = useLanguage()

  return (
    <>
      <div className="filterbar">
        <input className="grow" type="text" placeholder={t.marketplace.searchPlaceholder} />
        <select><option>{t.marketplace.brand}</option></select>
        <select><option>{t.marketplace.transmission}</option></select>
        <select><option>{t.marketplace.fuel}</option></select>
        <select><option>{t.marketplace.price}</option></select>
        <select><option>{t.marketplace.newest}</option></select>
      </div>
      <div className="wrap" style={{ paddingBottom: 0 }}>
        <div className="result-count">
          <b>{count}</b> {count > 1 ? t.marketplace.availablePlural : t.marketplace.available}
        </div>
      </div>
    </>
  )
}