import { createClient } from '@/lib/supabase/server'
import { ADMIN_EMAIL } from '@/lib/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  const { vehicleId, isPublished } = await request.json()

  const { error } = await supabase
    .from('vehicles')
    .update({ is_published: !isPublished })
    .eq('id', vehicleId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}