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
  const [showContacts, setShowContacts] = useState(false)

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
    return direction === "kzt_to_rub"
      ? Math.round(baseRate * 1.025 * 100) / 100
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
          direction,
          rate,
          giveAmount: numAmount,
          giveCurrency,
          getAmount: result,
          getCurrency,
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
            Быстрый обмен рублей и тенге
          </h1>
          <p className="text-sm text-muted-foreground">
            Онлайн обмен RUB ⇄ KZT по актуальному курсу.  
            Деньги поступают на карту <strong>за 1–5 минут</strong>.
          </p>
        </header>

        <h2 className="sr-only">Курс рубль тенге на сегодня</h2>

        {/* Direction */}
        <div className="flex gap-2">
          <button
            onClick={() => setDirection("kzt_to_rub")}
            className={`flex-1 py-3 rounded-lg ${
              direction === "kzt_to_rub" ? "bg-primary text-white" : "bg-muted"
            }`}
          >
            Купить рубли
          </button>
          <button
            onClick={() => setDirection("rub_to_kzt")}
            className={`flex-1 py-3 rounded-lg ${
              direction === "rub_to_kzt" ? "bg-primary text-white" : "bg-muted"
            }`}
          >
            Купить тенге
          </button>
        </div>

        {/* Rate */}
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-sm">Курс</p>
          <p className="text-xl font-bold">
            1 {direction === "kzt_to_rub" ? "RUB" : "KZT"} = {formatNumber(rate)}{" "}
            {direction === "kzt_to_rub" ? "KZT" : "RUB"}
          </p>
        </div>

        {/* Input */}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`Введите сумму (${giveCurrency})`}
          className="w-full p-3 border rounded-lg"
        />

        {/* Result */}
        {numAmount > 0 && (
          <div className="bg-primary/10 p-4 rounded-lg">
            <p>Вы получите: <strong>{formatNumber(result)} {getCurrency}</strong></p>
          </div>
        )}

        {!showForm && numAmount > 0 && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 bg-primary text-white rounded-lg"
          >
            Получить перевод за 1–5 минут
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

        {/* FAQ ACCORDION */}
        <section className="pt-8">
          <h2 className="font-semibold mb-3">Часто задаваемые вопросы</h2>

          <details>
            <summary className="cursor-pointer font-medium">
              Сколько времени занимает перевод?
            </summary>
            <p className="mt-2 text-sm">
              Обычно перевод на карту занимает от 1 до 5 минут после подтверждения заявки.
            </p>
          </details>

          <details>
            <summary className="cursor-pointer font-medium">
              По какому курсу происходит обмен?
            </summary>
            <p className="mt-2 text-sm">
              По актуальному курсу RUB/KZT без скрытых комиссий. Курс фиксируется при подтверждении.
            </p>
          </details>

          <details>
            <summary className="cursor-pointer font-medium">
              Можно ли обменять тенге на рубли онлайн?
            </summary>
            <p className="mt-2 text-sm">
              Да, расчёт и заявка оформляются полностью онлайн.
            </p>
          </details>
        </section>

        {/* CONTACTS */}
        <button
          onClick={() => setShowContacts(!showContacts)}
          className="text-sm underline text-center w-full"
        >
          Реквизиты и контакты
        </button>

        {showContacts && (
          <div className="text-sm text-muted-foreground text-center">
            ИП: Туев М.А.<br />
            WhatsApp: +7 913 466-66-95
          </div>
        )}

      </div>
    </main>
  )
}
