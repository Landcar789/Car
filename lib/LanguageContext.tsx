'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { fr } from './translations/fr'
import { de } from './translations/de'

type Lang = 'fr' | 'de'
type Translations = typeof fr

const translations: Record<Lang, Translations> = { fr, de }

type LanguageContextType = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr')

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && window.localStorage.getItem('lang')) as Lang | null
    if (saved === 'fr' || saved === 'de') {
      setLangState(saved)
    }
  }, [])

  const setLang = (newLang: Lang) => {
    setLangState(newLang)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('lang', newLang)
    }
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage doit être utilisé dans un LanguageProvider')
  }
  return context
}