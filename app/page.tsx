"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"

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
        const kztPerRub = data.rates.KZT
        setBaseRate(kztPerRub)
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
      return Math.round(baseRate * 1.025 * 100) / 100
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
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">Загрузка курса...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">

        {/* SEO BLOCK */}
<header className="space-y-2 text-center">
  <h1 className="text-2xl font-bold text-foreground">
    Обмен рублей и тенге — деньги сразу на Вашу карту за 1–5 минут
  </h1>
  <p className="text-sm text-muted-foreground">
    Быстрый онлайн обмен RUB ⇄ KZT по актуальному курсу.
    После подтверждения заявки деньги поступают на карту
    <strong> в течение 1–5 минут</strong>.
  </p>
</header>

        <h2 className="sr-only">
          Курс рубль тенге на сегодня
        </h2>

        {/* Direction selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setDirection("kzt_to_rub")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              direction === "kzt_to_rub"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            Купить рубли
          </button>
          <button
            onClick={() => setDirection("rub_to_kzt")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              direction === "rub_to_kzt"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            Купить тенге
          </button>
        </div>

        {/* Rate display */}
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">Курс</p>
          <p className="text-2xl font-bold text-foreground">
            1 {direction === "kzt_to_rub" ? "RUB" : "KZT"} = {formatNumber(rate)}{" "}
            {direction === "kzt_to_rub" ? "KZT" : "RUB"}
          </p>
        </div>

        {/* Amount input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Вы отдаёте ({giveCurrency})
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Введите сумму"
            className="w-full p-3 border border-border rounded-lg bg-background text-foreground text-lg"
          />
        </div>

        {/* Result */}
        {numAmount > 0 && (
          <div className="bg-primary/10 p-4 rounded-lg space-y-2">
            <p>
              Вы отдаёте: <strong>{formatNumber(numAmount)} {giveCurrency}</strong>
            </p>
            <p>
              Курс: <strong>{formatNumber(rate)}</strong>
            </p>
            <p className="text-lg">
              Вы получите: <strong>{formatNumber(result)} {getCurrency}</strong>
            </p>
          </div>
        )}

        {/* Submit */}
        {numAmount > 0 && !showForm && !submitted && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium"
          >
            Оставить заявку
          </button>
        )}

        {showForm && !submitted && (
          <form onSubmit={handleSubmit} className="space-y-4 bg-muted p-4 rounded-lg">
            <input
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border rounded-lg"
            />
            <input
              placeholder="Телефон"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full p-3 border rounded-lg"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg"
            >
              {submitting ? "Отправка..." : "Отправить заявку"}
            </button>
          </form>
        )}

        {submitted && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center">
            Заявка принята. Мы свяжемся с вами.
          </div>
        )}

      </div>
    </main>
  )
}
