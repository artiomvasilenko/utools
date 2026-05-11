import { NavLink } from "react-router-dom";

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
  return (
    <aside
      className={`md:w-64   bg-gray-800 text-white transform transition-transform duration-300 ease-in-out z-10 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:static absolute`}
    >
      <div className="p-4">
        <h2 className="text-lg font-bold">Инструменты</h2>
      </div>
      <nav onClick={toggleSidebar}>
        <ul className="space-y-2 pl-5">
          <li>
            <NavLink
              to="/"
              className="block p-2 hover:bg-gray-700 hover:scale-105 transition-all"
            >
              🛠️ Главная
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/timer"
              className="block p-2 hover:bg-gray-700 hover:scale-105 transition-all"
            >
              ⏱️ Таймер
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/number_random_generator"
              className="block p-2 hover:bg-gray-700 hover:scale-105 transition-all"
            >
              🔢 Случайное число
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/password_generator"
              className="block p-2 hover:bg-gray-700 hover:scale-105 transition-all"
            >
              📝 Генератор паролей
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/nickname_generator"
              className="block p-2 hover:bg-gray-700 hover:scale-105 transition-all"
            >
              👤 Генератор никнейма
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/calculator"
              className="block p-2 hover:bg-gray-700 hover:scale-105 transition-all"
            >
              🧮 Калькулятор
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/credit_calculator"
              className="block p-2 hover:bg-gray-700 hover:scale-105 transition-all"
            >
              🧮 Кредитный калькулятор
            </NavLink>
          </li>
          <li>
            <NavLink
              to="real_interest_rate"
              className="block p-2 hover:bg-gray-700 hover:scale-105 transition-all"
            >
              🏷️ Реальная процентная ставка по кредиту
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/investment_calculator"
              className="block p-2 hover:bg-gray-700 hover:scale-105 transition-all"
            >
              🧮 Калькулятор инвестора
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/trader_calculator"
              className="block p-2 hover:bg-gray-700 hover:scale-105 transition-all"
            >
              🧮 Калькулятор трейдера
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/calendar"
              className="block p-2 hover:bg-gray-700 hover:scale-105 transition-all"
            >
              🗓️ Производственный календарь
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dkp"
              className="block p-2 hover:bg-gray-700 hover:scale-105 transition-all"
            >
              📄 Договор купли-продажи автомобиля
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/poll/create"
              className="block p-2 hover:bg-gray-700 hover:scale-105 transition-all"
            >
              📊 Создание опроса
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/pdfmerger"
              className="block p-2 hover:bg-gray-700 hover:scale-105 transition-all"
            >
              📄 Склеить (объединить) PDF
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/heictojpg"
              className="block p-2 hover:bg-gray-700 hover:scale-105 transition-all"
            >
              📸 HEIC to JPG
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/coinflip"
              className="block p-2 hover:bg-gray-700 hover:scale-105 transition-all"
            >
              🪙 Орёл или решка
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tictactoe"
              className="block p-2 hover:bg-gray-700 hover:scale-105 transition-all"
            >
              ❌ Крестики-нолики
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/speed_thinking"
              className="block p-2 hover:bg-gray-700 hover:scale-105 transition-all"
            >
              ⏱️ Тест скорости мышления
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="/background_remover"
              className="block p-2 hover:bg-gray-700 hover:scale-105 transition-all"
            >
              🌄 Удаление фона
            </NavLink>
          </li> */}
          <li>
            <NavLink
              to="/notepad"
              className="block p-2 hover:bg-gray-700 hover:scale-105 transition-all"
            >
              🗒️ Блокнот
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
