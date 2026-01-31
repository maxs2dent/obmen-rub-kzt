import { NextResponse } from "next/server"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID // {{SET_ME}}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, direction, rate, giveAmount, giveCurrency, getAmount, getCurrency } = body

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

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }),
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 })
  }
}
