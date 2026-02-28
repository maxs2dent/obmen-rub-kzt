import { NextResponse } from "next/server"

let cachedRate: number | null = null
let lastFetch = 0

const CACHE_TIME = 1000 * 60 * 60 * 8 // 8 часов

export async function GET() {
  const now = Date.now()

  if (cachedRate && now - lastFetch < CACHE_TIME) {
    return NextResponse.json({ rate: cachedRate })
  }

  try {
    const res = await fetch(
      "https://api.exchangerate.host/latest?base=RUB&symbols=KZT&access_key=94ea7a3c240ef15e6112812758e28039",
      { cache: "no-store" }
    )

    const data = await res.json()
    const rate = data.rates.KZT

    cachedRate = rate
    lastFetch = now

    return NextResponse.json({ rate })
  } catch (error) {
    return NextResponse.json({ rate: cachedRate || 6.5 })
  }
}
