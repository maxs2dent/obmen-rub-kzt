"use client"

import { useState } from "react"

export default function Footer() {
  const [open, setOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<string | null>(null)

  return (
    <>
      <div className="pt-12 border-t border-gray-200 mt-16">

        {/* СПОЙЛЕР */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-center text-sm text-gray-600 font-medium"
        >
          Юридическая информация {open ? "▲" : "▼"}
        </button>

        {open && (
          <div className="mt-6 bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4 text-sm text-gray-700">

            <div className="font-semibold text-center">
              ИП Туев М.А. • ИНН 542500854540
            </div>

            <div className="flex flex-wrap justify-center gap-6 underline cursor-pointer text-gray-600">
              <span onClick={() => setActiveModal("requisites")}>
                Реквизиты
              </span>
              <span onClick={() => setActiveModal("contacts")}>
                Контакты
              </span>
              <span onClick={() => setActiveModal("policy")}>
                Политика
              </span>
              <span onClick={() => setActiveModal("offer")}>
                Оферта
              </span>
            </div>

            <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
              Информация на сайте носит справочный характер
              и не является публичной офертой в соответствии
              со ст. 437 ГК РФ.
            </div>

            <div className="text-xs text-gray-400 text-center">
              © {new Date().getFullYear()} obmen-rub-kzt.ru
            </div>
          </div>
        )}
      </div>

      {activeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50">
          <div className="bg-white w-full md:max-w-lg rounded-t-3xl md:rounded-3xl p-6 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="text-sm text-gray-500 mb-4"
            >
              Закрыть
            </button>

            {activeModal === "requisites" && (
              <div className="space-y-2 text-sm">
                <h2 className="text-lg font-semibold">Реквизиты</h2>
                <p>ИП Туев М.А.</p>
                <p>ИНН: 542500854540</p>
              </div>
            )}

            {activeModal === "contacts" && (
              <div className="space-y-2 text-sm">
                <h2 className="text-lg font-semibold">Контакты</h2>
                <p>Телефон / WhatsApp: +7 913 466-66-95</p>
                <p>Email: support@obmen-rub-kzt.ru</p>
              </div>
            )}

            {activeModal === "policy" && (
              <div className="space-y-3 text-xs leading-relaxed">
                <h2 className="text-lg font-semibold">Политика</h2>
                <p>
                  Оператор персональных данных: ИП Туев М.А.
                </p>
                <p>
                  Обрабатываются имя и телефон для связи по заявке.
                </p>
                <p>
                  Данные не передаются третьим лицам,
                  кроме случаев, предусмотренных законом.
                </p>
                <p>
                  Отправляя заявку, пользователь соглашается
                  на обработку персональных данных.
                </p>
              </div>
            )}

            {activeModal === "offer" && (
              <div className="space-y-3 text-xs leading-relaxed">
                <h2 className="text-lg font-semibold">Оферта</h2>
                <p>
                  Сайт предоставляет информационные услуги
                  по сопровождению обменных операций.
                </p>
                <p>
                  Услуга считается оказанной после выполнения
                  подтверждённой заявки.
                </p>
                <p>
                  Курс фиксируется на момент подтверждения.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
