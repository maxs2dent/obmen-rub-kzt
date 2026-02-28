import { NextResponse } from "next/server"

let cachedRate: number | null = null
let cachedSlot: string | null = null
let cachedDay: string | null = null

function getMoscowTime() {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utc + 3 * 60 * 60 * 1000) // UTC+3
}

function getSlotInfo() {
  const msk = getMoscowTime()
  const hours = msk.getHours()
  const today = msk.toISOString().split("T")[0]

  let currentSlot: string
  let nextSlot: string
  let currentDay = today
  let nextDay = today

  if (hours >= 21) {
    currentSlot = "21:00"
    nextSlot = "09:00"

    const tomorrow = new Date(msk)
    tomorrow.setDate(tomorrow.getDate() + 1)
    nextDay = tomorrow.toISOString().split("T")[0]

  } else if (hours >= 15) {
    currentSlot = "15:00"
    nextSlot = "21:00"

  } else if (hours >= 9) {
    currentSlot = "09:00"
    nextSlot = "15:00"

  } else {
    currentSlot = "21:00"
    nextSlot = "09:00"

    const yesterday = new Date(msk)
    yesterday.setDate(yesterday.getDate() - 1)
    currentDay = yesterday.toISOString().split("T")[0]
  }

  return {
    currentSlot,
    currentDay,
    nextSlot,
    nextDay,
  }
}

export async function GET() {
  const { currentSlot, currentDay, nextSlot, nextDay } = getSlotInfo()

  // если слот и день не изменились — отдаём кеш
  if (
    cachedRate &&
    cachedSlot === currentSlot &&
    cachedDay === currentDay
  ) {
    return NextResponse.json({
      rate: cachedRate,
      slot: currentSlot,
      day: currentDay,
      nextSlot,
      nextDay,
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
    cachedSlot = currentSlot
    cachedDay = currentDay

    return NextResponse.json({
      rate: cachedRate,
      slot: currentSlot,
      day: currentDay,
      nextSlot,
      nextDay,
    })

  } catch {
    return NextResponse.json({
      rate: cachedRate || 6.5,
      slot: currentSlot,
      day: currentDay,
      nextSlot,
      nextDay,
    })
  }
}
