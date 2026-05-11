import { NavLink } from "react-router-dom"; // Не забудь импортировать, если используешь роутер

function Home() {
  return (
    <>
      <title>Полезные инструменты - use-tools.ru</title>
      <meta
        name="description"
        content="Полезные инструменты: калькуляторы, опросники, генераторы, таймеры и другие"
      />

      <p className="pb-3">
        Этот сайт — ваш надёжный набор полезных инструментов, которые выручают в
        повседневной жизни, работе и учёбе. Мы собрали самое нужное в одном
        месте, чтобы вам не приходилось искать десятки разных сервисов.
      </p>

      <p className="pb-3">
        Сайт имеет приятный, не перегруженный интерфейс, в котором легко
        разобраться с первого взгляда. Никакой навязчивой рекламы или сложных
        меню — только инструменты и их результат. Всё полностью адаптировано под
        мобильные устройства с небольшими экранами, поэтому пользоваться сайтом
        одинаково удобно и с компьютера, и с телефона, и с планшета.
      </p>

      <p className="pb-3 font-bold">Что уже есть на сайте (18 инструментов):</p>

      <ul className="pb-3 space-y-1 list-disc list-inside">
        <li>
          <NavLink to="/timer" className="text-blue-400 hover:underline">
            ⏱️ Таймер
          </NavLink>{" "}
          — засекайте время для задач, тренировок или готовки
        </li>
        <li>
          <NavLink to="/calculator" className="text-blue-400 hover:underline">
            🧮 Калькулятор
          </NavLink>{" "}
          — простой и быстрый повседневный помощник
        </li>
        <li>
          <NavLink
            to="/credit_calculator"
            className="text-blue-400 hover:underline"
          >
            🧮 Кредитный калькулятор
          </NavLink>{" "}
          — рассчитывайте ежемесячные платежи и переплату
        </li>
        <li>
          <NavLink
            to="/real_interest_rate"
            className="text-blue-400 hover:underline"
          >
            🏷️ Реальная процентная ставка
          </NavLink>{" "}
          — узнайте эффективную ставку по кредиту
        </li>
        <li>
          <NavLink
            to="/investment_calculator"
            className="text-blue-400 hover:underline"
          >
            🧮 Калькулятор инвестора
          </NavLink>{" "}
          — моделируйте доходность вкладов и инвестиций
        </li>
        <li>
          <NavLink
            to="/trader_calculator"
            className="text-blue-400 hover:underline"
          >
            🧮 Калькулятор трейдера
          </NavLink>{" "}
          — считайте риски и профит в сделках
        </li>
        <li>
          <NavLink
            to="/number_random_generator"
            className="text-blue-400 hover:underline"
          >
            🔢 Случайное число
          </NavLink>{" "}
          — генератор чисел в заданном диапазоне
        </li>
        <li>
          <NavLink
            to="/password_generator"
            className="text-blue-400 hover:underline"
          >
            📝 Генератор паролей
          </NavLink>{" "}
          — создавайте надёжные пароли любой сложности
        </li>
        <li>
          <NavLink
            to="/nickname_generator"
            className="text-blue-400 hover:underline"
          >
            👤 Генератор никнейма
          </NavLink>{" "}
          — придумайте уникальный псевдоним для игр и соцсетей
        </li>
        <li>
          <NavLink to="/coinflip" className="text-blue-400 hover:underline">
            🪙 Орёл или решка
          </NavLink>{" "}
          — виртуальная монетка для быстрых решений
        </li>
        <li>
          <NavLink to="/calendar" className="text-blue-400 hover:underline">
            🗓️ Производственный календарь
          </NavLink>{" "}
          — все выходные и праздничные дни под рукой
        </li>
        <li>
          <NavLink to="/pdfmerger" className="text-blue-400 hover:underline">
            📄 Объединить PDF
          </NavLink>{" "}
          — склейте несколько документов в один файл
        </li>
        <li>
          <NavLink to="/heictojpg" className="text-blue-400 hover:underline">
            📸 HEIC в JPG
          </NavLink>{" "}
          — конвертируйте фото Apple в универсальный формат
        </li>
        <li>
          <NavLink to="/dkp" className="text-blue-400 hover:underline">
            📄 Договор купли-продажи авто
          </NavLink>{" "}
          — заполните и скачайте готовый ДКП
        </li>
        <li>
          <NavLink to="/poll/create" className="text-blue-400 hover:underline">
            📊 Создание опроса
          </NavLink>{" "}
          — быстрое голосование для друзей и коллег
        </li>
        <li>
          <NavLink to="/tictactoe" className="text-blue-400 hover:underline">
            ❌ Крестики-нолики
          </NavLink>{" "}
          — классическая игра, чтобы развлечься
        </li>
      </ul>

      <p className="pb-3">
        Мы постоянно работаем над расширением списка, и скоро здесь появятся
        новые категории: конвертеры величин, инструменты для работы с текстом и
        многое другое.
      </p>

      <p className="pb-3">
        Чтобы воспользоваться любым инструментом, просто выберите его в меню
        слева (на компьютере) или нажмите на кнопку меню в мобильной версии.
      </p>

      <p className="pb-3 font-bold">
        Добавляйте сайт в закладки (Ctrl + D), чтобы не потерять!
      </p>
    </>
  );
}

export default Home;
