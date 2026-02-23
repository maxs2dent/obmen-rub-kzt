export default function Footer() {
  return (
    <footer className="w-full px-4 py-8 bg-white border-t border-gray-200 text-sm text-gray-600">
      <div className="space-y-3">
        <a href="#" className="block">Реквизиты</a>
        <a href="#" className="block">Контакты</a>
        <a href="#" className="block">Политика конфиденциальности</a>
      </div>

      <div className="mt-6 text-gray-400">
        © {new Date().getFullYear()} obmen-rub-kzt.ru
      </div>
    </footer>
  );
}

