import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AccountContent from '@/components/AccountContent'

export default async function ComptePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  return (
    <>
      <Header />
      <AccountContent email={user.email ?? ''} />
      <Footer />
    </>
  )
}