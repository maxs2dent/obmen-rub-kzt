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
            Рубли в тенге — быстрый онлайн-обмен
          </h1>
          <p className="text-sm text-muted-foreground">
            Онлайн обмен рублей в тенге по актуальному курсу.
            Перевод на карту <strong>в течение 1–5 минут</strong> после подтверждения заявки.
          </p>
        </header>

        {/* SEO H2 */}
        <h2 className="text-base font-semibold text-foreground mt-6">
          Курс рубля к тенге на сегодня
        </h2>

        <p className="text-sm text-muted-foreground">
          Курс рубля к тенге меняется в течение дня и зависит от ситуации на валютном рынке.
          Используйте калькулятор ниже, чтобы узнать, сколько тенге вы получите при обмене рублей
          по актуальному курсу.
        </p>

        {/* Hidden SEO anchor */}
        <h3 className="sr-only">
          Сколько рублей в тенге сегодня
        </h3>

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
  <div className="bg-primary/10 p-4 rounded-lg space-y-2">
    <p className="text-foreground">
      Вы отдаёте:{" "}
      <strong>
        {formatNumber(numAmount)} {giveCurrency}
      </strong>
    </p>

    <p className="text-foreground">
      Курс: <strong>{formatNumber(rate)}</strong>
    </p>

    <p className="text-foreground text-lg">
      Вы получите:{" "}
      <strong>
        {formatNumber(result)} {getCurrency}
      </strong>
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
            Заявка принята. С важи свяжется наш менеджер для уточнения деталей и выполнит перевод.
          </div>
        )}

{/* FAQ ACCORDION */}
<section className="mt-10 space-y-4">
  <h2 className="text-lg font-semibold text-foreground">
    Часто задаваемые вопросы
  </h2>

  <div className="space-y-2 text-sm">

    <details className="group rounded-lg bg-muted p-4">
      <summary className="cursor-pointer font-medium text-foreground list-none flex justify-between items-center">
        Сколько времени занимает перевод рублей в тенге?
        <span className="transition group-open:rotate-90">▶</span>
      </summary>
      <p className="mt-3 text-muted-foreground">
        После подтверждения заявки перевод на карту обычно занимает
        <strong> от 1 до 5 минут</strong>.  
        В редких случаях время может увеличиться из-за банка получателя.
      </p>
    </details>

    <details className="group rounded-lg bg-muted p-4">
      <summary className="cursor-pointer font-medium text-foreground list-none flex justify-between items-center">
        По какому курсу происходит обмен рублей?
        <span className="transition group-open:rotate-90">▶</span>
      </summary>
      <p className="mt-3 text-muted-foreground">
        Обмен происходит по актуальному курсу RUB/KZT
        без скрытых комиссий.  
        Курс отображается перед оформлением заявки и фиксируется
        в момент подтверждения.
      </p>
    </details>

    <details className="group rounded-lg bg-muted p-4">
      <summary className="cursor-pointer font-medium text-foreground list-none flex justify-between items-center">
        Можно ли обменять рубли в тенге онлайн?
        <span className="transition group-open:rotate-90">▶</span>
      </summary>
      <p className="mt-3 text-muted-foreground">
        Да. Вы можете рассчитать сумму через калькулятор
        и оставить заявку полностью онлайн,
        без визита в офис и поездок в банк.
      </p>
    </details>

  </div>
</section>

{/* CONTACTS */}
<section className="mt-6 text-center">
  <details className="inline-block">
    <summary className="cursor-pointer text-sm underline text-muted-foreground list-none">
      Реквизиты и контакты
    </summary>

    <div className="mt-4 text-sm text-muted-foreground space-y-1">
      <div>ИП Туев М.А.</div>
      <div>ИНН: 542500854540</div>
      <div>Телефон / WhatsApp: <strong>+7 913 466-66-95</strong></div>
    </div>
  </details>
</section>
      </div>
    </main>
  )
}
