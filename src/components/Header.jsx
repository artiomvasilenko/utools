import { Menu, X } from "lucide-react";

export default function Header({ toggleSidebar, isSidebarOpen }) {
  return (
    <header className="">
      <div className="bg-gray-900 text-white w-full transition-all duration-300 flex justify-evenly p-8">
        <button
          onClick={toggleSidebar}
          className="md:hidden pr-6 rounded-lg hover:bg-gray-100"
          aria-label="Меню инструментов"
        >
          {isSidebarOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
        <h1 className="text-2xl md:text-3xl font-bold">Полезные инструменты</h1>
      </div>
    </header>
  );
}
