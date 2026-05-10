export default function Footer() {
  return (
    <footer>
      <script async src="https://ad.mail.ru/static/ads-async.js"></script>
      <ins
        class="mrg-tag"
        className="display:inline-block;width:auto;height:300px"
        data-ad-client="ad-2008502"
        data-ad-slot="2008502"
      ></ins>
      <script>(MRGtag = window.MRGtag || []).push({});</script>

      <div className="bg-gray-900 text-white w-full transition-all duration-300 text-center text-sm pt-5">
        <p className="font-bold">
          © {new Date().getFullYear()} use-tools.ru — простые веб-инструменты
          для каждого.
        </p>
        <p className="text-slate-600 py-2 text-xs">
          Используя сайт, вы принимаете условия{" "}
          <a href="useragreement" className="text-blue-600 hover:text-blue-700">
            Пользовательского соглашения
          </a>{" "}
          и соглашаетесь на сбор аналитики Яндекс.Вебмастер.
        </p>
      </div>
    </footer>
  );
}
