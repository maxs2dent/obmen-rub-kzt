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
  const [animate, setAnimate] = useState(false)

  const fetchRate = async () => {
    try {
      const res = await fetch("https://api.exchangerate-api.com/v4/latest/RUB")
      const data = await res.json()
      setBaseRate(data.rates.KZT)
    } catch {
      setBaseRate(6.54)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRate()
    const interval = setInterval(fetchRate, 20000)
    return () => clearInterval(interval)
  }, [])

  const changeDirection = (dir: Direction) => {
    setDirection(dir)

    setAnimate(true)
    setTimeout(() => setAnimate(false), 300)

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(20)
    }
  }

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
    n.toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Загрузка...
      </div>
    )
  }

  return (
    <main className="relative min-h-screen px-4 pt-10 pb-32 bg-gradient-to-b from-gray-50 via-white to-gray-100 overflow-hidden">

      {/* Blur background */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-green-300 rounded-full blur-3xl opacity-30" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-emerald-200 rounded-full blur-3xl opacity-30" />

      <div className="relative max-w-md mx-auto space-y-12">

        {/* MAIN CARD */}
        <div
          className={`bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-3xl p-6 space-y-6 transition-all duration-300 ${
            animate ? "scale-[1.02] shadow-green-200" : ""
          }`}
        >
          {/* TITLE */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight flex items-center justify-center gap-2">
              Обмен KZT
              <span
                className={`inline-block transition-transform duration-300 ${
                  direction === "rub_to_kzt" ? "rotate-180" : ""
                }`}
              >
                ⇄
              </span>
              RUB
            </h1>

            <p className="text-sm text-gray-600">
              Онлайн • Без комиссий • 1–5 минут
            </p>
          </div>

          {/* SWITCH */}
          <div className="bg-gray-100 rounded-2xl p-1 flex shadow-inner">
            <button
              onClick={() => changeDirection("kzt_to_rub")}
              className={`flex-1 py-3 rounded-xl font-medium transition ${
                direction === "kzt_to_rub"
                  ? "bg-green-600 text-white shadow"
                  : "text-gray-600"
              }`}
            >
              KZT → RUB
            </button>

            <button
              onClick={() => changeDirection("rub_to_kzt")}
              className={`flex-1 py-3 rounded-xl font-medium transition ${
                direction === "rub_to_kzt"
                  ? "bg-green-600 text-white shadow"
                  : "text-gray-600"
              }`}
            >
              RUB → KZT
            </button>
          </div>

          {/* GIVE */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <p className="text-sm text-gray-600 mb-1">Вы отдаёте</p>
            <div className="flex items-center">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="flex-1 bg-transparent text-xl font-semibold outline-none"
              />
              <span className="font-medium text-gray-700">
                {giveCurrency}
              </span>
            </div>
          </div>

          {/* RECEIVE */}
          {numAmount > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <p className="text-sm text-gray-600 mb-1">Вы получаете</p>
              <div className="flex items-center">
                <div className="flex-1 text-2xl font-bold text-green-600">
                  {formatNumber(result)}
                </div>
                <span className="font-medium text-gray-700">
                  {getCurrency}
                </span>
              </div>
            </div>
          )}

          {/* RATE */}
          <div className="bg-gray-100 rounded-2xl p-5 text-center shadow-inner">
            <p className="text-sm text-gray-600 mb-1">
              Курс сегодня
            </p>
            <p className="text-3xl font-black tracking-tight">
              1 {direction === "kzt_to_rub" ? "RUB" : "KZT"} ={" "}
              {formatNumber(rate)}{" "}
              {direction === "kzt_to_rub" ? "KZT" : "RUB"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Обновляется автоматически
            </p>
          </div>
        </div>

        {/* SOCIAL + FAQ */}
        <SocialProof />
        <Faq />
        <Footer />
      </div>

      {/* STICKY BUTTON */}
      {numAmount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
          <button
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            Обменять сейчас
          </button>
        </div>
      )}
    </main>
  )
}
