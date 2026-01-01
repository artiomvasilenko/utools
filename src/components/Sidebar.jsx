import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white">
      <div className="p-4">
        <h2 className="text-lg font-bold">Инструменты</h2>
      </div>
      <nav>
        <ul className="space-y-2 pl-5">
          <li>
            <NavLink to="/" className="block p-2 hover:bg-gray-700">
              🛠️ Главная
            </NavLink>
          </li>

          <li>
            <NavLink to="/timer" className="block p-2 hover:bg-gray-700">
              ⏱️ Таймер
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/number_random_generator"
              className="block p-2 hover:bg-gray-700"
            >
              🔢 Случайное число
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/password_generator"
              className="block p-2 hover:bg-gray-700"
            >
              📝 Генератор паролей
            </NavLink>
          </li>
          <li>
            <NavLink to="/calculator" className="block p-2 hover:bg-gray-700">
              🧮 Калькулятор
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/credit_calculator"
              className="block p-2 hover:bg-gray-700"
            >
              🧮 Кредитный калькулятор
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/investment_calculator"
              className="block p-2 hover:bg-gray-700"
            >
              🧮 Калькулятор инвестора
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/trader_calculator"
              className="block p-2 hover:bg-gray-700"
            >
              🧮 Калькулятор трейдера
            </NavLink>
          </li>
          <li>
            <NavLink to="/calendar" className="block p-2 hover:bg-gray-700">
              🗓️ Производственный календарь
            </NavLink>
          </li>
          <li>
            <NavLink to="/dkp" className="block p-2 hover:bg-gray-700">
              📄 Договор купли-продажи автомобиля
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
