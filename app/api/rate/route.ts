import { NextResponse } from "next/server"

let cachedRate: number | null = null
let lastSlot: string | null = null

const UPDATE_SLOTS = ["09:00", "15:00", "21:00"]

function getCurrentSlot(): string | null {
  const now = new Date()
  const hours = now.getHours()

  if (hours >= 21) return "21:00"
  if (hours >= 15) return "15:00"
  if (hours >= 9) return "09:00"

  return null
}

export async function GET() {
  const currentSlot = getCurrentSlot()

  // если до 09:00 — используем вчерашний 21:00
  const effectiveSlot = currentSlot ?? "21:00"

  if (cachedRate && lastSlot === effectiveSlot) {
    return NextResponse.json({
      rate: cachedRate,
      slot: effectiveSlot,
    })
  }

  try {
    const res = await fetch(
      "https://api.exchangerate.host/latest?base=RUB&symbols=KZT",
      { cache: "no-store" }
    )

    const data = await res.json()

    if (!data.rates?.KZT) {
      throw new Error("Invalid API response")
    }

    cachedRate = data.rates.KZT
    lastSlot = effectiveSlot

    return NextResponse.json({
      rate: cachedRate,
      slot: effectiveSlot,
    })
  } catch {
    return NextResponse.json({
      rate: cachedRate || 6.5,
      slot: effectiveSlot,
    })
  }
}
