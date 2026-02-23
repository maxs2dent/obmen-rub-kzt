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
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // ===== Таймер фиксации =====
  const [timeLeft, setTimeLeft] = useState(300)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true)
      return
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [timeLeft])

  const resetTimer = () => {
    setTimeLeft(300)
    setIsExpired(false)
  }

  // ===== Курс =====
  useEffect(() => {
    async function fetchRate() {
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
    fetchRate()
  }, [])

  const getRate = useCallback(() => {
    if (!baseRate) return 0
    if (direction === "kzt_to_rub") {
      return Math.round(baseRate * 1.036 * 100) / 100
    } else {
      return Math.round(baseRate * 0.963 * 100) / 100
    }
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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? "0" : ""}${s}`
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        Загрузка курса...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 px-4 pt-8 pb-28">
      <div className="max-w-md mx-auto space-y-10">

        {/* ===== BRAND ===== */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-white font-bold shadow-md">
              ↔
            </div>
            <span className="font-semibold text-gray-800">
              obmen-rub-kzt.ru
            </span>
          </div>
        </div>

        {/* ===== MAIN CARD ===== */}
        <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 space-y-6 overflow-hidden">

          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-transparent to-transparent opacity-40 pointer-events-none" />

          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Быстрый обмен KZT ⇄ RUB
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Фиксация курса
            </p>
          </div>

          {/* Таймер */}
          <div className="text-center">
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium transition ${
              isExpired
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}>
              {isExpired
                ? "Курс обновлён"
                : `Фиксация: ${formatTime(timeLeft)}`}
            </div>

            {isExpired && (
              <div className="mt-2">
                <button
                  onClick={resetTimer}
                  className="text-sm underline text-gray-600"
                >
                  Обновить курс
                </button>
              </div>
            )}
          </div>

          {/* SEGMENT */}
          <div className="bg-gray-100 rounded-2xl p-1 flex">
            <button
              onClick={() => setDirection("kzt_to_rub")}
              className={`flex-1 py-3 rounded-xl font-medium transition ${
                direction === "kzt_to_rub"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-600"
              }`}
            >
              KZT → RUB
            </button>

            <button
              onClick={() => setDirection("rub_to_kzt")}
              className={`flex-1 py-3 rounded-xl font-medium transition ${
                direction === "rub_to_kzt"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-600"
              }`}
            >
              RUB → KZT
            </button>
          </div>

          {/* GIVE */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Вы отдаёте</p>
            <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-4 border border-gray-200">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="flex-1 bg-transparent text-xl font-semibold outline-none"
              />
              <span className="text-gray-600 font-medium">{giveCurrency}</span>
            </div>
          </div>

          {/* RECEIVE */}
          {numAmount > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Вы получаете</p>
              <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-4 border border-gray-200">
                <div className="flex-1 text-2xl font-bold text-green-600 transition-all duration-300 ease-in-out">
                  {formatNumber(result)}
                </div>
                <span className="text-gray-600 font-medium">{getCurrency}</span>
              </div>
            </div>
          )}

          {/* RATE */}
          <div className="bg-gray-100 rounded-2xl p-4 text-center">
            <p className="text-sm text-gray-500">Курс</p>
            <p className="text-3xl font-black tracking-tight text-gray-900 transition-all duration-300">
              1 {direction === "kzt_to_rub" ? "RUB" : "KZT"} ={" "}
              {formatNumber(rate)}{" "}
              {direction === "kzt_to_rub" ? "KZT" : "RUB"}
            </p>
          </div>

        </div>

        <SocialProof />
        <Faq />
        <Footer />

      </div>

      {/* STICKY CTA */}
      {numAmount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
          <button
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
          >
            Обменять сейчас
          </button>
        </div>
      )}
    </main>
  )
}
