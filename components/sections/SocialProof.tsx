export default function SocialProof() {
  return (
    <section className="w-full px-4 py-10 bg-white">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Почему нам доверяют
      </h2>

      <ul className="space-y-4 text-gray-700">
        <li className="flex items-center gap-3">
          <span className="text-green-600">✔</span>
          <span>12 000+ успешных обменов</span>
        </li>

        <li className="flex items-center gap-3">
          <span className="text-green-600">✔</span>
          <span>Работаем с 2023 года</span>
        </li>

        <li className="flex items-center gap-3">
          <span className="text-green-600">✔</span>
          <span>Поддержка в Telegram 24/7</span>
        </li>
      </ul>
    </section>
  );
}

