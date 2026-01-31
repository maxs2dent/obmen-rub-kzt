"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"

type Direction = "kzt_to_rub" | "rub_to_kzt"

export default function ExchangePage() {
  const [direction, setDirection] = useState<Direction>("rub_to_kzt")
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
    return Math.round(baseRate * 0.963 * 100) / 100
  }, [baseRate])

  const rate = getRate()
  const numAmount = Number.parseFloat(amount) || 0
  const result = Math.round(numAmount * rate * 100) / 100

  const formatNumber = (n: number) =>
    n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !phone) return

    setSubmitting(true)
    try {
      await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          direction: "RUB → KZT",
          rate,
          giveAmount: numAmount,
          giveCurrency: "RUB",
          getAmount: result,
          getCurrency: "KZT",
        }),
      })
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p className="text-center mt-20">Загрузка курса…</p>
  }

  return (
    <main className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">

        {/* HERO */}
        <header className="text-center space-y-2">
          <h1 className="text-2xl font-bold">
            Обмен рублей на тенге — быстро и онлайн
          </h1>
          <p className="text-sm text-muted-foreground">
            Онлайн-обмен RUB → KZT по актуальному курсу.  
            Зачисление на карту <strong>в течение 1–5 минут</strong>.
          </p>
        </header>

        {/* RATE INFO */}
        <h2 className="text-base font-semibold mt-6">
          Курс рубля к тенге на сегодня
        </h2>
        <p className="text-sm text-muted-foreground">
          Используйте калькулятор ниже, чтобы рассчитать,
          сколько тенге вы получите при обмене рублей по текущему курсу.
        </p>

        {/* RATE BLOCK */}
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-sm">Курс</p>
          <p className="text-xl font-bold">
            1 RUB = {formatNumber(rate)} KZT
          </p>
        </div>

        {/* INPUT */}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Введите сумму (RUB)"
          className="w-full p-3 border rounded-lg"
        />

        {/* RESULT — ИСПРАВЛЕННЫЙ БЛОК */}
        {numAmount > 0 && (
          <div className="bg-primary/10 p-4 rounded-lg space-y-2">
            <p>
              Вы отдаёте: <strong>{formatNumber(numAmount)} RUB</strong>
            </p>
            <p>
              Курс: <strong>{formatNumber(rate)}</strong>
            </p>
            <p className="text-lg">
              Вы получите: <strong>{formatNumber(result)} KZT</strong>
            </p>
          </div>
        )}

        {!showForm && numAmount > 0 && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 bg-primary text-white rounded-lg"
          >
            Оставить заявку
          </button>
        )}

        {showForm && !submitted && (
          <form onSubmit={handleSubmit} className="space-y-3 bg-muted p-4 rounded-lg">
            <input
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg"
              required
            />
            <input
              placeholder="Телефон / WhatsApp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-lg"
              required
            />
            <button className="w-full py-3 bg-primary text-white rounded-lg">
              {submitting ? "Отправка…" : "Отправить заявку"}
            </button>
          </form>
        )}

        {submitted && (
          <div className="bg-green-100 p-4 rounded-lg text-center">
            Заявка принята. Деньги поступят в течение 1–5 минут.
          </div>
        )}
      </div>
    </main>
  )
}
