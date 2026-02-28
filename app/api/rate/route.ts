import { NextResponse } from "next/server"

let cachedRate: number | null = null
let lastSlot: string | null = null
let lastDay: string | null = null

const SLOTS = ["09:00", "15:00", "21:00"]

function getMoscowTime() {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utc + 3 * 60 * 60 * 1000) // UTC+3
}

function getSlotInfo() {
  const msk = getMoscowTime()
  const hours = msk.getHours()
  const today = msk.toISOString().split("T")[0]

  let currentSlot: string | null = null
  let nextSlot: string | null = null
  let lastDay = today
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
    lastDay = yesterday.toISOString().split("T")[0]
  }

  return {
    currentSlot,
    nextSlot,
    lastDay,
    nextDay,
  }
}

export async function GET() {
  const { currentSlot, nextSlot, lastDay, nextDay } = getSlotInfo()

  if (
    cachedRate &&
    lastSlot === currentSlot &&
    lastDay === lastDay
  ) {
    return NextResponse.json({
      rate: cachedRate,
      slot: currentSlot,
      day: lastDay,
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
    lastSlot = currentSlot
    lastDay = lastDay

    return NextResponse.json({
      rate: cachedRate,
      slot: currentSlot,
      day: lastDay,
      nextSlot,
      nextDay,
    })
  } catch {
    return NextResponse.json({
      rate: cachedRate || 6.5,
      slot: currentSlot,
      day: lastDay,
      nextSlot,
      nextDay,
    })
  }
}
