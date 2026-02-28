import { NextResponse } from "next/server"

let cachedRate: number | null = null
let lastFetch: number | null = null

const CACHE_TIME = 1000 * 60 * 60 * 8 // 8 часов

export async function GET() {
  const now = Date.now()

  if (cachedRate && lastFetch && now - lastFetch < CACHE_TIME) {
    return NextResponse.json({
      rate: cachedRate,
      updatedAt: lastFetch,
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

    const rate = data.rates.KZT

    cachedRate = rate
    lastFetch = now

    return NextResponse.json({
      rate,
      updatedAt: now,
    })
  } catch (error) {
    return NextResponse.json({
      rate: cachedRate || 6.5,
      updatedAt: lastFetch || now,
    })
  }
}
