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
  const [phone, setPhone] = useState("+7 ")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // ===== Получение курса =====
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

  // ===== Маска телефона +7 (XXX) XXX-XX-XX =====
  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "").replace(/^7/, "")
    let formatted = "+7 "

    if (digits.length > 0) formatted += "(" + digits.substring(0, 3)
    if (digits.length >= 3) formatted += ") "
    if (digits.length >= 4) formatted += digits.substring(3, 6)
    if (digits.length >= 6) formatted += "-"
    if (digits.length >= 7) formatted += digits.substring(6, 8)
    if (digits.length >= 8) formatted += "-"
    if (digits.length >= 9) formatted += digits.substring(8, 10)

    setPhone(formatted)
  }

  const isPhoneValid = phone.replace(/\D/g, "").length === 11

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isPhoneValid || !name.trim()) return

    setSubmitting(true)

    try {
      await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          direction: direction === "kzt_to_rub" ? "KZT → RUB" : "RUB → KZT",
          rate,
          giveAmount: numAmount,
          giveCurrency,
          getAmount: result,
          getCurrency,
        }),
      })

      setSubmitted(true)

      setTimeout(() => {
        setSubmitted(false)
        setShowForm(false)
        setName("")
        setPhone("+7 ")
      }, 2500)
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
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 px-4 pt-8 pb-28">
      <div className="max-w-md mx-auto space-y-10">

        {/* BRAND */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-white font-bold shadow-md">
            ↔
          </div>
          <span className="font-semibold text-gray-800">
            obmen-rub-kzt.ru
          </span>
        </div>

        {/* CARD */}
        <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 space-y-6">

          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Быстрый обмен KZT ⇄ RUB
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Перевод за 1–5 минут
            </p>
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
                <div className="flex-1 text-xl font-semibold text-green-600">
                  {formatNumber(result)}
                </div>
                <span className="text-gray-600 font-medium">{getCurrency}</span>
              </div>
            </div>
          )}

          {/* RATE */}
          <div className="bg-gray-100 rounded-2xl p-4 text-center">
            <p className="text-sm text-gray-500">Курс сегодня</p>
            <p className="text-3xl font-black tracking-tight text-gray-900">
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

      {/* STICKY BUTTON */}
      {numAmount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl font-semibold text-lg shadow-2xl"
          >
            Обменять сейчас
          </button>
        </div>
      )}

      {/* BOTTOM SHEET FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6 space-y-4 animate-slideUp">
            {!submitted ? (
              <>
                <h2 className="text-lg font-semibold text-center">
                  Оставить заявку
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    placeholder="Имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-3 border rounded-xl"
                  />

                  <input
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    inputMode="numeric"
                    className="w-full p-3 border rounded-xl"
                  />

                  <button
                    type="submit"
                    disabled={!isPhoneValid || submitting}
                    className="w-full py-3 bg-green-600 text-white rounded-xl font-medium"
                  >
                    {submitting ? "Отправка..." : "Отправить"}
                  </button>
                </form>

                <button
                  onClick={() => setShowForm(false)}
                  className="w-full text-sm text-gray-500 mt-2"
                >
                  Отмена
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="text-green-600 text-5xl mb-2 animate-bounce">
                  ✓
                </div>
                <p className="text-lg font-medium text-gray-800">
                  Отправлено
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  )
}
