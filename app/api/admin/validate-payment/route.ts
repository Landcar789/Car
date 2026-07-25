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

  const { orderId, paymentId } = await request.json()
  const admin = createAdminClient()

  const { error: e1 } = await admin
    .from('payments')
    .update({ status: 'verified', verified_at: new Date().toISOString() })
    .eq('id', paymentId)

  const { error: e2 } = await admin
    .from('orders')
    .update({ status: 'confirmed' })
    .eq('id', orderId)

  if (e1 || e2) {
    return NextResponse.json({ error: (e1 || e2)?.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}