"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"

type Direction = "rub_to_kzt" | "kzt_to_rub"

export default function ExchangePage() {
  const [direction, setDirection] = useState<Direction>("rub_to_kzt")
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

  const rate = useCallback(() => {
    if (!baseRate) return 0
    return Math.round(baseRate * 0.963 * 100) / 100
  }, [baseRate])()

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
            Обмен рублей на тенге онлайн
          </h1>
          <p className="text-sm text-muted-foreground">
            Актуальный курс RUB → KZT.  
            Перевод на карту <strong>в течение 1–5 минут</strong> после подтверждения заявки.
          </p>
        </header>

        {/* Rate info */}
        <h2 className="text-base font-semibold mt-6">
          Курс рубля к тенге на сегодня
        </h2>
        <p className="text-sm text-muted-foreground">
          Курс обновляется онлайн. Используйте калькулятор ниже,
          чтобы рассчитать сумму перевода рублей в тенге по текущему курсу.
        </p>

        {/* Rate */}
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-sm">Курс</p>
          <p className="text-xl font-bold">
            1 RUB = {formatNumber(rate)} KZT
          </p>
        </div>

        {/* Input */}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Введите сумму (RUB)"
          className="w-full p-3 border rounded-lg"
        />

        {/* RESULT — ИСПРАВЛЕННЫЙ БЛОК */}
        {numAmount > 0 && (
          <div className="bg-primary/10 p-4 rounded-lg space-y-1">
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
              required
              className="w-full p-3 rounded-lg"
            />
            <input
              placeholder="Телефон / WhatsApp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full p-3 rounded-lg"
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

        {/* FAQ */}
        <section className="pt-8">
          <h2 className="font-semibold mb-3">Часто задаваемые вопросы</h2>

          <details>
            <summary className="cursor-pointer font-medium">
              Сколько времени занимает перевод?
            </summary>
            <p className="mt-2 text-sm">
              Обычно перевод занимает от 1 до 5 минут после подтверждения заявки.
            </p>
          </details>

          <details>
            <summary className="cursor-pointer font-medium">
              По какому курсу происходит обмен?
            </summary>
            <p className="mt-2 text-sm">
              По актуальному курсу RUB/KZT без скрытых комиссий.
            </p>
          </details>
        </section>

        {/* Contacts */}
        <button
          onClick={() => setShowContacts(!showContacts)}
          className="text-sm underline w-full text-center"
        >
          Реквизиты и контакты
        </button>

        {showContacts && (
          <div className="text-sm text-muted-foreground text-center">
            ИП Туев М.А.<br />
            ИНН: 542500854540<br />
            Телефон / WhatsApp: +7 913 466-66-95
          </div>
        )}
      </div>
    </main>
  )
}
