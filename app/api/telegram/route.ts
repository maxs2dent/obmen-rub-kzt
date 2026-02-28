import { NextResponse } from "next/server"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

let lastRequestTime = 0
const REQUEST_COOLDOWN = 15000

export async function POST(request: Request) {
  try {
    const nowTime = Date.now()

    if (nowTime - lastRequestTime < REQUEST_COOLDOWN) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      )
    }

    lastRequestTime = nowTime

    const body = await request.json()
    const { name, phone, direction, rate, giveAmount, giveCurrency, getAmount, getCurrency } = body

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return NextResponse.json({ error: "Telegram not configured" }, { status: 500 })
    }

    const now = new Date()
    const dateStr = now.toLocaleDateString("ru-RU")
    const timeStr = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })

    const message = `
<b>📩 Новая заявка</b>

<b>Дата:</b> ${dateStr} ${timeStr}

<b>Имя:</b> ${name}
<b>Телефон:</b> ${phone}

<b>Направление:</b> ${direction === "kzt_to_rub" ? "KZT → RUB" : "RUB → KZT"}
<b>Курс:</b> ${rate}

<b>Отдаёт:</b> ${giveAmount} ${giveCurrency}
<b>Получает:</b> ${getAmount} ${getCurrency}
`

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      }
    )

    const telegramData = await telegramResponse.json()

    if (!telegramData.ok) {
      return NextResponse.json({ error: "Telegram failed" }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 })
  }
}
