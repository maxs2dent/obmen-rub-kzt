"use client"

import { useState } from "react"

export default function Footer() {
  const [activeModal, setActiveModal] = useState<string | null>(null)

  return (
    <>
      <div className="text-center text-sm text-gray-600 space-y-3 pt-10">

        <div className="font-medium">
          ИП Туев М.А. • ИНН 542500854540
        </div>

        <div className="flex justify-center gap-4 underline cursor-pointer">
          <span onClick={() => setActiveModal("requisites")}>
            Реквизиты
          </span>
          <span onClick={() => setActiveModal("contacts")}>
            Контакты
          </span>
          <span onClick={() => setActiveModal("policy")}>
            Политика конфиденциальности
          </span>
          <span onClick={() => setActiveModal("offer")}>
            Публичная оферта
          </span>
        </div>

        <div className="text-xs text-gray-500 pt-4">
          © {new Date().getFullYear()} obmen-rub-kzt.ru
        </div>
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
                <h2 className="text-lg font-semibold mb-2">Реквизиты</h2>
                <p>ИП Туев М.А.</p>
                <p>ИНН: 542500854540</p>
              </div>
            )}

            {activeModal === "contacts" && (
              <div className="space-y-2 text-sm">
                <h2 className="text-lg font-semibold mb-2">Контакты</h2>
                <p>Телефон / WhatsApp: +7 913 466-66-95</p>
                <p>Email: support@obmen-rub-kzt.ru</p>
              </div>
            )}

            {activeModal === "policy" && (
              <div className="space-y-3 text-xs leading-relaxed">
                <h2 className="text-lg font-semibold">Политика конфиденциальности</h2>

                <p>
                  Настоящая политика определяет порядок обработки персональных данных,
                  предоставляемых пользователями сайта obmen-rub-kzt.ru.
                </p>

                <p>
                  Оператором персональных данных является ИП Туев М.А.
                </p>

                <p>
                  Мы собираем только следующие данные:
                  имя и контактный телефон для связи по заявке.
                </p>

                <p>
                  Данные не передаются третьим лицам,
                  за исключением случаев, предусмотренных законодательством РФ.
                </p>

                <p>
                  Отправляя заявку, пользователь соглашается
                  на обработку своих персональных данных.
                </p>
              </div>
            )}

            {activeModal === "offer" && (
              <div className="space-y-3 text-xs leading-relaxed">
                <h2 className="text-lg font-semibold">Публичная оферта</h2>

                <p>
                  Настоящий документ является публичной офертой
                  в соответствии со ст. 437 ГК РФ.
                </p>

                <p>
                  ИП Туев М.А. предоставляет услуги информационного
                  сопровождения обменных операций.
                </p>

                <p>
                  Услуга считается оказанной с момента выполнения перевода
                  по подтверждённой заявке.
                </p>

                <p>
                  Курс фиксируется на момент подтверждения заявки.
                </p>

                <p>
                  Пользователь подтверждает согласие с условиями,
                  отправляя заявку через сайт.
                </p>

                <p>
                  Споры регулируются в соответствии
                  с законодательством Российской Федерации.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
