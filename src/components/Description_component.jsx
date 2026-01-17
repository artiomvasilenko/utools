function Description_component({ children }) {
  return (
    <div className="text-gray-800 text-sm my-4 md:mt-16">
      <details className="group ">
        <summary className="flex items-center justify-between p-3 bg-slate-300 hover:bg-slate-400 rounded-lg cursor-pointer transition-color duration-300">
          <span className="font-medium text-gray-700 group-open:hidden">
            Описание
          </span>
          <span className="font-medium text-gray-700 hidden group-open:inline">
            Скрыть
          </span>
          <svg
            className="w-5 h-5 text-gray-500 transition-transform duration-300 group-open:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </summary>
        <div className="overflow-hidden  max-h-0 group-open:max-h-500 transition-all duration-500 ease-in-out">
          <div className="text-gray-800 text-sm">{children}</div>
        </div>
      </details>
    </div>
  );
}

export default Description_component;
