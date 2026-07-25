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

  const body = await request.json()
  const admin = createAdminClient()

  const { data: vehicle, error } = await admin
    .from('vehicles')
    .insert({
      brand: body.brand,
      model: body.model,
      year: body.year || null,
      price_eur: body.price_eur,
      transmission: body.transmission,
      fuel: body.fuel,
      mileage_km: body.mileage_km || null,
      description: body.description,
      is_published: true,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ vehicle })
}