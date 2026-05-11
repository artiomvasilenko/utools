import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header({ toggleSidebar, isSidebarOpen }) {
  return (
    <header className="">
      <div className="bg-gray-900 w-full transition-all duration-300 justify-evenly p-6">
        <button
          onClick={toggleSidebar}
          className="md:hidden pr-6 rounded-lg text-white cursor-pointer"
          aria-label="Меню инструментов"
        >
          {isSidebarOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
        <div className="border-b border-slate-200 pb-4 flex flex-wrap items-baseline justify-between gap-3">
          <Link to="/">
            <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-slate-500 to-blue-800 bg-clip-text text-transparent">
              use‑tools.ru
            </h1>
            <p className="text-slate-300 text-sm mt-1 text-center">
              полезные инструменты
            </p>
          </Link>
          <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
            калькуляторы · календарь · генераторы
          </div>
        </div>
      </div>
    </header>
  );
}
