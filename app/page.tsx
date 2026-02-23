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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return

    setSubmitting(true)
    try {
      await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          direction: direction === "kzt_to_rub" ? "KZT → RUB" : "RUB → KZT",
          rate,
          giveAmount: numAmount,
          giveCurrency,
          getAmount: result,
          getCurrency,
        }),
      })
      setSubmitted(true)
    } catch {
      alert("Ошибка отправки")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        Загрузка курса...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 px-4 pt-8 pb-16">
      <div className="max-w-md mx-auto space-y-10">

        {/* ==== MAIN CARD ==== */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-6">

          {/* TITLE */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">
              Быстрый обмен
            </h1>
            <p className="text-lg font-semibold text-gray-800">
              KZT ⇄ RUB
            </p>
            <p className="text-sm text-gray-500">
              Перевод за 1–5 минут
            </p>
          </div>

          {/* SEGMENT CONTROL */}
          <div className="bg-gray-100 rounded-2xl p-1 flex">
            <button
              onClick={() => setDirection("kzt_to_rub")}
              className={`flex-1 py-3 rounded-xl font-medium transition ${
                direction === "kzt_to_rub"
                  ? "bg-green-600 text-white shadow"
                  : "text-gray-600"
              }`}
            >
              KZT → RUB
            </button>

            <button
              onClick={() => setDirection("rub_to_kzt")}
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
                <div className="flex-1 text-xl font-semibold">
                  {formatNumber(result)}
                </div>
                <span className="text-gray-600 font-medium">{getCurrency}</span>
              </div>
            </div>
          )}

          {/* RATE */}
          <div className="bg-gray-100 rounded-2xl p-4 text-center">
            <p className="text-sm text-gray-500">Курс сегодня</p>
            <p className="text-xl font-bold text-gray-900">
              1 {direction === "kzt_to_rub" ? "RUB" : "KZT"} ={" "}
              {formatNumber(rate)}{" "}
              {direction === "kzt_to_rub" ? "KZT" : "RUB"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Фиксируется на 5 минут
            </p>
          </div>

          {/* CTA */}
          {numAmount > 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl font-semibold text-lg shadow-lg"
            >
              Обменять сейчас
            </button>
          )}

          {/* FORM */}
          {showForm && !submitted && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                placeholder="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 border rounded-xl"
              />

              <input
                placeholder="Телефон"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full p-3 border rounded-xl"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-black text-white rounded-xl font-medium"
              >
                {submitting ? "Отправка..." : "Отправить заявку"}
              </button>
            </form>
          )}

          {submitted && (
            <div className="bg-green-100 text-green-800 p-4 rounded-xl text-center">
              Заявка принята. Мы свяжемся с вами.
            </div>
          )}

        </div>

        {/* ==== SECTIONS ==== */}
        <SocialProof />
        <Faq />
        <Footer />

      </div>
    </main>
  )
}
