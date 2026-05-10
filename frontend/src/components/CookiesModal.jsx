import { useState, useEffect } from "react";

function CookiesModal() {
  // По умолчанию скрываем, пока не проверим куки
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Проверяем наличие куки при первой загрузке компонента
    const hasAccepted = document.cookie.includes("cookies-accepted=true");
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const closeCookiesModal = () => {
    // Скрываем состояние в React
    setIsVisible(false);

    // Устанавливаем куку
    const date = new Date();
    date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = `cookies-accepted=true; ${expires}; path=/`;
  };

  if (!isVisible) return null; // Если кука есть, компонент вообще не рендерится

  return (
    <div
      className="fixed right-0 bottom-0 z-50 flex flex-col w-60 h-30 p-4 m-1 items-end bg-orange-600 rounded-xl shadow-xl transition-all"
      id="cookies-modal"
    >
      <div
        className="bg-orange-800 hover:bg-orange-900 text-white w-6 text-center mb-1 rounded-full cursor-pointer hover:scale-110 transition-all"
        onClick={closeCookiesModal}
      >
        ✕
      </div>
      <a href="/cookies" className="text-center text-white">
        🍪 Мы используем cookies.{" "}
        <span className="underline">Подробнее...</span>
      </a>
    </div>
  );
}

export default CookiesModal;
