import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Тенге в рубли — курс KZT ⇄ RUB сегодня, онлайн калькулятор",
  description:
    "Онлайн обмен рублей на тенге и тенге на рубли по актуальному курсу RUB/KZT. Быстрый расчёт и зачисление на карту в течение 1–5 минут.",
  keywords: [
    "тенге в рубли",
    "курс тенге к рублю",
    "обмен рублей на тенге",
    "обмен тенге на рубли",
    "RUB KZT",
    "курс RUB KZT",
    "онлайн обмен валют",
  ],
  alternates: {
    canonical: "https://obmen-rub-kzt.ru/",
  },
  openGraph: {
    title: "Обмен рублей и тенге — курс RUB ⇄ KZT онлайн",
    description:
      "Узнай актуальный курс рубля к тенге. Рассчитай сумму обмена и оставь заявку онлайн.",
    url: "https://obmen-rub-kzt.ru/",
    siteName: "Обмен RUB ⇄ KZT",
    locale: "ru_RU",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },

  // ===== PWA =====
  manifest: "/manifest.json",
  themeColor: "#16a34a",

  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        {/* iOS PWA support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>

      <body className={`${inter.className} antialiased bg-white`}>
        {children}
        <Analytics />

        {/* ===== Service Worker Registration ===== */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />

        {/* ===== FAQ Schema ===== */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "@id": "https://obmen-rub-kzt.ru/#faq",
              inLanguage: "ru",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Сколько времени занимает перевод денег?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "После подтверждения заявки перевод средств на карту обычно занимает от 1 до 5 минут."
                  }
                },
                {
                  "@type": "Question",
                  name: "По какому курсу происходит обмен рублей и тенге?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Обмен происходит по актуальному курсу RUB/KZT, который отображается перед оформлением заявки и фиксируется на момент подтверждения."
                  }
                },
                {
                  "@type": "Question",
                  name: "Можно ли обменять тенге на рубли онлайн?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Да, вы можете рассчитать сумму через онлайн-калькулятор и оставить заявку полностью онлайн."
                  }
                }
              ]
            }),
          }}
        />
      </body>
    </html>
  )
}
