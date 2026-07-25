import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin-server'
import { ADMIN_EMAIL } from '@/lib/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  const { beneficiary_name, iban, bic } = await request.json()
  const admin = createAdminClient()

  const { error } = await admin
    .from('payment_settings')
    .update({ beneficiary_name, iban, bic, updated_at: new Date().toISOString() })
    .eq('id', 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}