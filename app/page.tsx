"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
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

  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("+7 ")
  const [submitted, setSubmitted] = useState(false)

  const [showInfo, setShowInfo] = useState(false)
  const popoverRef = useRef<HTMLDivElement | null>(null)

  /* ===== FETCH RATE ===== */

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

  /* ===== CLOSE POPOVER ===== */

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowInfo(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  /* ===== RATE LOGIC ===== */

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
      ? rate !== 0
        ? Math.round((numAmount / rate) * 100) / 100
        : 0
      : Math.round(numAmount * rate * 100) / 100

  const giveCurrency = direction === "kzt_to_rub" ? "KZT" : "RUB"
  const getCurrency = direction === "kzt_to_rub" ? "RUB" : "KZT"

  const formatNumber = (n: number) =>
    n.toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  /* ===== UX ===== */

  const changeDirection = (dir: Direction) => {
    setDirection(dir)
    setAnimate(true)
    setTimeout(() => setAnimate(false), 300)
    if (navigator.vibrate) navigator.vibrate(20)
  }

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11)
    let formatted = "+7 "
    if (digits.length > 1) formatted += "(" + digits.slice(1, 4)
    if (digits.length >= 4) formatted += ") " + digits.slice(4, 7)
    if (digits.length >= 7) formatted += "-" + digits.slice(7, 9)
    if (digits.length >= 9) formatted += "-" + digits.slice(9, 11)
    return formatted
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = phone.replace(/\D/g, "")
    if (clean.length !== 11) return

    setSubmitted(true)

    setTimeout(() => {
      setShowModal(false)
      setSubmitted(false)
      setName("")
      setPhone("+7 ")
    }, 2000)
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Загрузка актуального курса...
      </div>
    )

  return (
    <main className="relative min-h-screen px-4 pt-10 pb-40 bg-gradient-to-b from-gray-50 via-white to-gray-100 overflow-hidden">

      {/* Blur background */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-green-300 rounded-full blur-3xl opacity-30" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-emerald-200 rounded-full blur-3xl opacity-30" />

      <div className="relative max-w-md mx-auto space-y-12">

        <div
          className={`bg-white/70 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl p-6 space-y-6 transition-all duration-300 ${
            animate ? "scale-[1.02]" : ""
          }`}
        >
          {/* ===== HEADER (ДВЕ СТРОКИ) ===== */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold">
              Быстрый обмен валют
            </h1>

            <div className="text-3xl font-semibold flex items-center justify-center gap-3">
              KZT
              <span
                className={`transition-transform duration-300 ${
                  direction === "rub_to_kzt" ? "rotate-180" : ""
                }`}
              >
                ⇄
              </span>
              RUB
            </div>

            <p className="text-sm text-gray-600">
              Онлайн • Без комиссий • 1–5 минут
            </p>
          </div>

          {/* SWITCH */}
          <div className="bg-gray-100 rounded-2xl p-1 flex">
            <button
              onClick={() => changeDirection("kzt_to_rub")}
              className={`flex-1 py-3 rounded-xl ${
                direction === "kzt_to_rub"
                  ? "bg-green-600 text-white"
                  : "text-gray-600"
              }`}
            >
              Купить РУБЛИ
            </button>

            <button
              onClick={() => changeDirection("rub_to_kzt")}
              className={`flex-1 py-3 rounded-xl ${
                direction === "rub_to_kzt"
                  ? "bg-green-600 text-white"
                  : "text-gray-600"
              }`}
            >
              Купить ТЕНГЕ
            </button>
          </div>

          {/* INPUT */}
          <div>
            <p className="text-sm text-gray-600 mb-1">
              Вы отдаёте ({giveCurrency})
            </p>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-xl font-semibold"
            />
          </div>

          {/* RESULT */}
          {numAmount > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Вы получите</p>
              <p className="text-2xl font-bold text-green-600">
                {formatNumber(result)} {getCurrency}
              </p>
            </div>
          )}

          {/* RATE */}
          <div className="bg-gray-100 rounded-2xl p-5 text-center relative">
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm text-gray-600">Курс</p>

              <div className="relative" ref={popoverRef}>
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="w-5 h-5 flex items-center justify-center rounded-full bg-white/60 backdrop-blur-md border border-white/50 text-xs font-bold text-gray-700 shadow-sm hover:scale-110 transition"
                >
                  ℹ
                </button>

                {showInfo && (
                  <div className="absolute top-8 right-0 w-64 bg-white/70 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-xl p-3 text-xs text-gray-700 leading-relaxed">
                    Курс формируется на основании рыночных данных и может изменяться в течение дня.
                  </div>
                )}
              </div>
            </div>

            <p className="text-3xl font-black mt-2">
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

      {/* CTA */}
      {numAmount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl font-semibold text-lg shadow-2xl"
          >
            Обменять сейчас
          </button>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 space-y-4">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-4 border rounded-xl"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  className="w-full p-4 border rounded-xl"
                />
                <button className="w-full py-3 bg-green-600 text-white rounded-xl">
                  Отправить
                </button>
              </form>
            ) : (
              <div className="text-center py-10">
                <div className="text-6xl text-green-500 mb-4">✓</div>
                <div className="text-lg font-semibold">
                  Заявка отправлена
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
