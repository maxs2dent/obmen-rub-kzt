import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Обмен рублей на тенге — актуальный курс RUB/KZT онлайн',
  description:
    'Онлайн обмен рублей на тенге и тенге на рубли по актуальному курсу RUB/KZT. Быстрый расчёт суммы и заявка на обмен за 1 минуту.',
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
      </body>
    </html>
  )
}
