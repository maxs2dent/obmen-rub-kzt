import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Тенге в рубли — курс KZT ⇄ RUB сегодня, онлайн калькулятор',
  description:
    'Онлайн обмен рублей на тенге и тенге на рубли по актуальному курсу RUB/KZT. Быстрый расчёт и зачисление на Вашу карту в течение 1–5 минут.',
  keywords: [
    'обмен рублей на тенге',
    'обмен тенге на рубли',
    'курс рубль тенге',
    'RUB KZT',
    'курс RUB KZT',
    'обмен валют рубль тенге',
  ],
  alternates: {
    canonical: 'https://obmen-rub-kzt.ru/',
  },
  openGraph: {
    title: 'Обмен рублей на тенге — курс RUB/KZT',
    description:
      'Узнай актуальный курс рубля к тенге. Рассчитай сумму обмена и оставь заявку онлайн.',
    url: 'https://obmen-rub-kzt.ru/',
    siteName: 'Обмен RUB ⇄ KZT',
    locale: 'ru_RU',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body
        className={`${geist.className} ${geistMono.className} antialiased`}
      >
        {children}
        <Analytics />
      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Сколько времени занимает перевод денег?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "После подтверждения заявки перевод на карту обычно занимает от 1 до 5 минут."
          }
        },
        {
          "@type": "Question",
          name: "По какому курсу происходит обмен?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Обмен происходит по актуальному курсу RUB/KZT с учётом спреда, который отображается перед оформлением заявки."
          }
        },
        {
          "@type": "Question",
          name: "Можно ли обменять тенге на рубли онлайн?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Да, обмен возможен полностью онлайн через калькулятор и форму заявки."
          }
        },
        {
          "@type": "Question",
          name: "Какие данные нужны для обмена?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Для оформления заявки требуется имя и контактный телефон."
          }
        }
      ]
    })
  }}
/>
      </body>
    </html>
  )
}
