export default function Footer() {
  return (
    <footer>
      <div className="bg-gray-900 text-white w-full transition-all duration-300 text-center text-sm">
        <p className="text-gray-400 py-6">
          Если вы столкнулись с какой-либо проблемой, либо у вас есть
          какое-нибудь пожелание, напишите пожалуйста мне на электронную почту:
          <span className="text-gray-300"> artiomvasilenko@yandex.ru</span>
        </p>
        <p className="font-bold">
          © {new Date().getFullYear()} Полезные инструменты USE-TOOLS онлайн.
          Все права защищены.
        </p>
      </div>
    </footer>
  );
}
