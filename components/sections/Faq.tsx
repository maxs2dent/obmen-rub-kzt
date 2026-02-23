export default function Faq() {
  return (
    <section className="w-full px-4 py-10 bg-gray-50">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Частые вопросы
      </h2>

      <div className="space-y-3">
        <details className="bg-white rounded-xl p-4 shadow-sm">
          <summary className="font-medium cursor-pointer">
            Сколько идёт перевод?
          </summary>
          <p className="mt-2 text-gray-600">
            Обычно перевод занимает 1–5 минут.
          </p>
        </details>

        <details className="bg-white rounded-xl p-4 shadow-sm">
          <summary className="font-medium cursor-pointer">
            По какому курсу обмен?
          </summary>
          <p className="mt-2 text-gray-600">
            По курсу, зафиксированному в момент заявки.
          </p>
        </details>

        <details className="bg-white rounded-xl p-4 shadow-sm">
          <summary className="font-medium cursor-pointer">
            Нужна ли регистрация?
          </summary>
          <p className="mt-2 text-gray-600">
            Нет, регистрация не требуется.
          </p>
        </details>
      </div>
    </section>
  );
}

