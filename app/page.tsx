"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import SocialProof from "@/components/sections/SocialProof"
import Faq from "@/components/sections/Faq"
import Footer from "@/components/sections/Footer"

type Direction = "kzt_to_rub" | "rub_to_kzt"

export default function ExchangePage() {
  const [direction, setDirection] = useState<Direction>("kzt_to_rub")
  const [amount, setAmount] = useState<string>("")
  const [baseRate, setBaseRate] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [ratePulse, setRatePulse] = useState(false)

  // ===== ДИНАМИЧЕСКИЙ КУРС =====
  const fetchRate = async () => {
    try {
      const res = await fetch("https://api.exchangerate-api.com/v4/latest/RUB")
      const data = await res.json()
      setBaseRate(data.rates.KZT)
      setRatePulse(true)
      setTimeout(() => setRatePulse(false), 400)
    } catch {
      setBaseRate(6.54)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRate()
    const interval = setInterval(fetchRate, 20000) // обновление каждые 20 сек
    return () => clearInterval(interval)
  }, [])

  const getRate = useCallback(() => {
    if (!baseRate) return 0
    return direction === "kzt_to_rub"
      ? Math.round(baseRate * 1.036 * 100) / 100
      : Math.round(baseRate * 0.963 * 100) / 100
  }, [baseRate, direction])

  const rate = getRate()
  const numAmount = Number.parseFloat(amount) || 0

  const result =
    direction === "kzt_to_rub"
      ? Math.round((numAmount / rate) * 100) / 100
      : Math.round(numAmount * rate * 100) / 100

  const giveCurrency = direction === "kzt_to_rub" ? "KZT" : "RUB"
  const getCurrency = direction === "kzt_to_rub" ? "RUB" : "KZT"

  const formatNumber = (n: number) =>
    n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 pt-10 pb-32">

      {/* ===== BLUR BACKGROUND ===== */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-400 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-300 rounded-full blur-3xl opacity-30 animate-pulse" />

      <div className="relative max-w-md mx-auto space-y-10">

        {/* BRAND */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-white font-bold shadow-lg">
            ↔
          </div>
          <span className="font-semibold text-gray-800">
            obmen-rub-kzt
          </span>
        </div>

        {/* GLASS CARD */}
        <div className="backdrop-blur-xl bg-white/60 border border-white/40 shadow-2xl rounded-3xl p-6 space-y-6 transition-all duration-500">

          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight">
              Обмен KZT ⇄ RUB
            </h1>
            <p className="text-sm text-gray-600">
              Онлайн • Без комиссий • 1–5 минут
            </p>
          </div>

          {/* SWITCH */}
          <div className="bg-white/50 rounded-2xl p-1 flex backdrop-blur">
            <button
              onClick={() => setDirection("kzt_to_rub")}
              className={`flex-1 py-3 rounded-xl transition ${
                direction === "kzt_to_rub"
                  ? "bg-green-600 text-white shadow"
                  : "text-gray-700"
              }`}
            >
              KZT → RUB
            </button>
            <button
              onClick={() => setDirection("rub_to_kzt")}
              className={`flex-1 py-3 rounded-xl transition ${
                direction === "rub_to_kzt"
                  ? "bg-green-600 text-white shadow"
                  : "text-gray-700"
              }`}
            >
              RUB → KZT
            </button>
          </div>

          {/* INPUT */}
          <div>
            <p className="text-sm text-gray-600 mb-1">Вы отдаёте</p>
            <div className="flex items-center bg-white/70 backdrop-blur rounded-2xl px-4 py-4 border border-white/50">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="flex-1 bg-transparent text-xl font-semibold outline-none"
              />
              <span className="font-medium">{giveCurrency}</span>
            </div>
          </div>

          {/* RESULT */}
          {numAmount > 0 && (
            <div className="transition-all duration-300">
              <p className="text-sm text-gray-600 mb-1">Вы получаете</p>
              <div className="flex items-center bg-white/70 backdrop-blur rounded-2xl px-4 py-4 border border-white/50">
                <div className="flex-1 text-2xl font-bold text-green-600">
                  {formatNumber(result)}
                </div>
                <span>{getCurrency}</span>
              </div>
            </div>
          )}

          {/* RATE */}
          <div className="text-center">
            <p className="text-sm text-gray-600">Курс</p>
            <p
              className={`text-3xl font-black transition-all duration-300 ${
                ratePulse ? "scale-105 text-green-600" : ""
              }`}
            >
              {formatNumber(rate)}
            </p>
            <p className="text-xs text-gray-500">
              Обновляется автоматически
            </p>
          </div>

        </div>

        {/* TRUST BLOCK */}
        <div className="text-center text-sm text-gray-600">
          12 000+ успешных обменов • Работаем с 2023 года
        </div>

        <SocialProof />
        <Faq />
        <Footer />
      </div>
    </main>
  )
}
