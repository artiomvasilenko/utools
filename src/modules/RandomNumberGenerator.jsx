import React, { useState, useEffect, useRef } from "react";

const RandomNumberGenerator = () => {
  // Состояния для полей ввода
  const [count, setCount] = useState(5);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);

  // Состояние для сгенерированных чисел
  const [numbers, setNumbers] = useState([]);

  // Функция для генерации случайных чисел
  const generateRandomNumbers = () => {
    const numCount = Math.min(Math.max(1, count), 30); // Ограничение до 30
    const numMin = Math.min(min, max);
    const numMax = Math.max(min, max);

    const newNumbers = [];
    for (let i = 0; i < numCount; i++) {
      const randomNum =
        Math.floor(Math.random() * (numMax - numMin + 1)) + numMin;
      newNumbers.push(randomNum);
    }

    setNumbers(newNumbers);
  };

  // Генерация чисел при изменении параметров
  useEffect(() => {
    generateRandomNumbers();
  }, [count, min, max]);

  // Обработчики изменения полей ввода
  const handleCountChange = (e) => {
    const value = Math.min(Math.max(1, parseInt(e.target.value) || 1), 30);
    setCount(value);
  };

  const handleMinChange = (e) => {
    setMin(parseInt(e.target.value) || 0);
  };

  const handleMaxChange = (e) => {
    setMax(parseInt(e.target.value) || 100);
  };

  // Функция для копирования чисел в буфер обмена
  const copyToClipboard = () => {
    navigator.clipboard.writeText(numbers.join(", "));
    alert("Числа скопированы в буфер обмена!");
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая колонка: Параметры генерации */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
              <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100">
                Параметры генерации
              </h2>

              {/* Поле ввода: количество чисел */}
              <div className="mb-6">
                <label className="block text-teal-700 font-semibold mb-2">
                  Количество чисел (макс. 30)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={count}
                    onChange={handleCountChange}
                    className="w-full p-3 pl-10 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                  />
                  <div className="absolute left-3 top-3 text-teal-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-sm text-blue-500">
                  <span className="font-medium">Текущее значение:</span> {count}
                </div>
              </div>

              {/* Поле ввода: минимальное значение */}
              <div className="mb-6">
                <label className="block text-teal-700 font-semibold mb-2">
                  Минимальное значение
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={min}
                    onChange={handleMinChange}
                    className="w-full p-3 pl-10 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                  />
                  <div className="absolute left-3 top-3 text-teal-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18 12H6"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Поле ввода: максимальное значение */}
              <div className="mb-8">
                <label className="block text-teal-700 font-semibold mb-2">
                  Максимальное значение
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={max}
                    onChange={handleMaxChange}
                    className="w-full p-3 pl-10 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                  />
                  <div className="absolute left-3 top-3 text-teal-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Информационный блок */}
              <div className="bg-linear-to-r from-cyan-100 to-teal-100 p-4 rounded-lg border border-blue-200">
                <h3 className="font-bold text-blue-800 mb-2">ℹ️ Информация</h3>
                <p className="text-sm text-blue-700">
                  Числа генерируются автоматически при каждом изменении
                  параметров. Максимальное количество чисел ограничено 30 для
                  оптимальной производительности.
                </p>
              </div>
            </div>
          </div>

          {/* Правая колонка: Результаты */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 h-full">
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-blue-100">
                <h2 className="text-2xl font-bold text-blue-700">
                  Сгенерированные числа
                </h2>
                <button
                  onClick={copyToClipboard}
                  className="bg-linear-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all flex items-center shadow-md hover:shadow-lg"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    ></path>
                  </svg>
                  Копировать
                </button>
              </div>

              {/* Отображение сгенерированных чисел */}
              <div className="mb-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {numbers.map((number, index) => (
                    <div
                      key={index}
                      className="bg-linear-to-br from-blue-100 to-teal-100 border-2 border-blue-200 rounded-xl p-4 text-center transform transition-transform hover:scale-105 hover:shadow-md"
                    >
                      <div className="text-xs text-blue-300 mb-1">
                        №{index + 1}
                      </div>
                      <div className="text-2xl font-bold text-blue-800">
                        {number}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO-описание инструмента */}
        <div className="text-gray-800 text-sm mt-16">
          <details className="group">
            <summary className="flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors duration-200 list-none">
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
            <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-0 group-open:max-h-[2000px]">
              <div className="p-4 pt-6">
                <div className="text-gray-800 text-sm mt-16">
                  <p className="font-bold mt-6 text-center">
                    Генератор случайных чисел онлайн | Бесплатный инструмент для
                    быстрой генерации
                  </p>

                  <p className="mt-6">
                    <strong>Генератор случайных чисел</strong> — это мощный
                    онлайн-инструмент, позволяющий мгновенно создавать
                    последовательности случайных чисел для различных целей. Наш
                    сервис предлагает{" "}
                    <strong>быструю генерацию случайных чисел онлайн</strong>с
                    возможностью настройки всех параметров.
                  </p>

                  <p className="mt-6 font-bold">
                    Основные возможности генератора:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>
                        Генерация случайных чисел от 1 до 100, 1000 или любого
                        другого диапазона
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className=" mr-2">✓</span>
                      <span>
                        Создание нескольких случайных чисел одновременно (до 30
                        чисел)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className=" mr-2">✓</span>
                      <span>
                        Настраиваемый диапазон чисел — от минимального до
                        максимального значения
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className=" mr-2">✓</span>
                      <span>
                        Мгновенная генерация чисел без перезагрузки страницы
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className=" mr-2">✓</span>
                      <span>
                        Возможность копирования всех сгенерированных чисел одним
                        кликом
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className=" mr-2">✓</span>
                      <span>
                        Алгоритм псевдослучайных чисел для равномерного
                        распределения
                      </span>
                    </li>
                  </ul>

                  <p className="mt-4">
                    Наш <strong>генератор случайных цифр</strong> незаменим для
                    проведения лотерей, розыгрышей, случайного выбора
                    победителей, статистических выборок, научных исследований,
                    тестирования программного обеспечения и многих других задач.
                    Инструмент работает как <strong>рандомайзер чисел</strong> с
                    заданными параметрами, обеспечивая честный и непредвзятый
                    результат.
                  </p>

                  <p className="mt-6">
                    В отличие от других сервисов, наш{" "}
                    <strong>онлайн генератор случайных чисел</strong> предлагает
                    немедленную генерацию при каждом изменении параметров,
                    интуитивно понятный интерфейс, адаптивный дизайн для всех
                    устройств и абсолютно бесплатное использование без
                    ограничений. Мы обеспечиваем{" "}
                    <strong>случайную выборку чисел</strong> с помощью
                    проверенных алгоритмов.
                  </p>

                  <p className="mt-6">
                    <strong>Генерация случайных чисел онлайн</strong> — это
                    просто, быстро и удобно! Попробуйте наш инструмент прямо
                    сейчас для любых ваших задач, требующих{" "}
                    <strong>случайный выбор чисел</strong> или{" "}
                    <strong>создание числовой последовательности</strong>.
                  </p>
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default RandomNumberGenerator;
