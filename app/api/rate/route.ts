import { NextResponse } from "next/server"

let cachedRate: number | null = null
let lastSlot: string | null = null
let lastDay: string | null = null

const UPDATE_SLOTS = ["09:00", "15:00", "21:00"]

function getMoscowTime() {
  const now = new Date()

  // Получаем UTC время
  const utc = now.getTime() + now.getTimezoneOffset() * 60000

  // Москва UTC+3
  const mskTime = new Date(utc + 3 * 60 * 60 * 1000)

  return mskTime
}

function getCurrentSlotMSK() {
  const msk = getMoscowTime()
  const hours = msk.getHours()

  if (hours >= 21) return "21:00"
  if (hours >= 15) return "15:00"
  if (hours >= 9) return "09:00"

  return null
}

export async function GET() {
  const msk = getMoscowTime()
  const today = msk.toISOString().split("T")[0]
  const currentSlot = getCurrentSlotMSK()

  let effectiveSlot = currentSlot
  let effectiveDay = today

  // Если до 09:00 МСК — используем вчера 21:00
  if (!currentSlot) {
    effectiveSlot = "21:00"

    const yesterday = new Date(msk)
    yesterday.setDate(yesterday.getDate() - 1)
    effectiveDay = yesterday.toISOString().split("T")[0]
  }

  if (cachedRate && lastSlot === effectiveSlot && lastDay === effectiveDay) {
    return NextResponse.json({
      rate: cachedRate,
      slot: effectiveSlot,
      day: effectiveDay,
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
    lastDay = effectiveDay

    return NextResponse.json({
      rate: cachedRate,
      slot: effectiveSlot,
      day: effectiveDay,
    })
  } catch {
    return NextResponse.json({
      rate: cachedRate || 6.5,
      slot: effectiveSlot,
      day: effectiveDay,
    })
  }
}
