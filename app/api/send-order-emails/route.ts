import { NextResponse } from 'next/server'
import { sendManagerNotification, sendClientConfirmation } from '@/lib/email'

export async function POST(request: Request) {
  const order = await request.json()

  // Envoie les deux emails en parallèle
  await Promise.all([
    sendManagerNotification(order),
    sendClientConfirmation(order),
  ])

  return NextResponse.json({ success: true })
}