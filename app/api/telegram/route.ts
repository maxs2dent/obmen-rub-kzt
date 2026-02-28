import { NextResponse } from "next/server"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, direction, rate, giveAmount, giveCurrency, getAmount, getCurrency } = body

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error("Telegram env variables not set")
      return NextResponse.json({ error: "Telegram not configured" }, { status: 500 })
    }

    const now = new Date()
    const dateStr = now.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    const timeStr = now.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    })

    const message = `📩 Новая заявка

Дата и время: ${dateStr} ${timeStr}
Имя: ${name}
Телефон: ${phone}

Направление: ${direction}
Курс: ${rate}

Отдаёт: ${giveAmount} ${giveCurrency}
Получает: ${getAmount} ${getCurrency}`

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }),
      }
    )

    const telegramData = await telegramResponse.json()

    if (!telegramData.ok) {
      console.error("Telegram error:", telegramData)
      return NextResponse.json({ error: "Telegram failed" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Failed to send" }, { status: 500 })
  }
}
