export default function Footer() {
  return (
    <footer>
      <div className="bg-gray-900 text-white w-full transition-all duration-300 text-center text-sm p-2">
        <a href="useragreement" className="text-gray-400 py-2">
          Пользовательское соглашение
        </a>

        <p className="font-bold">
          © {new Date().getFullYear()} Полезные инструменты USE-TOOLS онлайн.
        </p>
      </div>
    </footer>
  );
}
