import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

let cachedRate: number | null = null
let cachedSlot: string | null = null
let cachedDay: string | null = null

function getMoscowTime() {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utc + 3 * 60 * 60 * 1000)
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

async function fetchPrimaryRate() {
  const res = await fetch(
    "https://api.exchangerate.host/latest?base=RUB&symbols=KZT",
    { cache: "no-store" }
  )

  const data = await res.json()

  if (!data?.rates?.KZT) {
    throw new Error("Primary API failed")
  }

  return data.rates.KZT
}

async function fetchFallbackRate() {
  const res = await fetch(
    "https://open.er-api.com/v6/latest/RUB",
    { cache: "no-store" }
  )

  const data = await res.json()

  if (!data?.rates?.KZT) {
    throw new Error("Fallback API failed")
  }

  return data.rates.KZT
}

export async function GET() {
  const { currentSlot, currentDay, nextSlot, nextDay } = getSlotInfo()

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
    let rate: number

    try {
      rate = await fetchPrimaryRate()
    } catch {
      rate = await fetchFallbackRate()
    }

    cachedRate = rate
    cachedSlot = currentSlot
    cachedDay = currentDay

    return NextResponse.json({
      rate,
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
