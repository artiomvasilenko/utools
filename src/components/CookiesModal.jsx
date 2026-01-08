function CookiesModal() {
  function closeCookiesModal() {
    document.getElementById("cookies-modal").classList.add("hidden");
    document.cookie = "cookies-accepted; path=/";
  }
  function hiddenCookiesModal() {
    if (document.cookie.indexOf("cookies-accepted") === 0) {
      return "hidden";
    }
  }
  return (
    <div
      className={`${hiddenCookiesModal()} fixed right-0 bottom-0 z-auto flex flex-col w-60 h-40 p-4 m-1 items-end bg-orange-600 rounded-xl shadow-2xl/100 transition-all transition-discrete`}
      id="cookies-modal"
    >
      <div
        className="bg-orange-800 hover:bg-orange-900 text-white w-6 text-center mb-4 rounded-full shadow-2xl/100 cursor-pointer hover:scale-150 transition-all"
        onClick={closeCookiesModal}
      >
        X
      </div>
      <p className="text-center text-white text-shadow-lg">
        Мы не используем куки и никак не обрабатываем ваши данные.
      </p>
    </div>
  );
}

export default CookiesModal;
