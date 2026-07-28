import { NextResponse } from 'next/server'
import { sendManagerReceiptAlert, sendClientReceiptAck } from '@/lib/email'

export async function POST(request: Request) {
  const order = await request.json()

  await Promise.all([
    sendManagerReceiptAlert(order),
    sendClientReceiptAck(order),
  ])

  return NextResponse.json({ success: true })
}