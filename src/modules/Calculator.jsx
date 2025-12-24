import { useState, useEffect } from "react";
import { evaluate } from "mathjs";

function Calculator() {
  const [input, setInput] = useState("0");

  function handleClick(value) {
    if (value === "C") {
      setInput("0");
      return;
    } else if (value === "Backspace") {
      setInput((prev) => (prev.length === 1 ? "0" : prev.slice(0, -1)));
      return;
    } else if (value === "=") {
      setInput(evaluate(input).toString());
      return;
    }
    setInput((prev) => (prev === "0" ? value : prev + value));
  }

  // Функция-обработчик нажатия клавиш
  function handleKeyPress(event) {
    const { key } = event;
    // Разрешаем цифры, знаки операций и точку
    const isValidInput = /^[0-9+\-*/.=]$/.test(key);

    if (isValidInput) {
      // Предотвращаем поведение по умолчанию (например, скролл)
      event.preventDefault();
      setInput((prev) => (prev === "0" ? key : prev + key));
    } else if (key === "Backspace") {
      event.preventDefault();
      setInput((prev) => (prev.length === 1 ? "0" : prev.slice(0, -1))); // Удаляем последний символ
    } else if (key === "Escape") {
      event.preventDefault();
      setInput("0");
    } else if (key === "Enter") {
      event.preventDefault();
      setInput((prev) => evaluate(prev.replace(/[^0-9]+$/, "")).toString());
    }
  }
  // Подключаем обработчик при монтировании компонента
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    // Очищаем слушатель при размонтировании
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [input]);

  return (
    <>
      <div className="flex items-center justify-center text-white">
        <div className="p-5 rounded-xl bg-gray-700 shadow-2xl">
          <div className="p-4 mb-4 text-3xl text-right bg-gray-900 text-green-500 rounded shadow-lg">
            {input}
          </div>

          <div className="grid grid-cols-4 gap-3">
            <button
              className="cursor-pointer transition-colors hover:bg-gray-800 rounded"
              onClick={() => handleClick("1")}
            >
              1
            </button>
            <button
              className="cursor-pointer transition-colors hover:bg-gray-800 rounded"
              onClick={() => handleClick("2")}
            >
              2
            </button>
            <button
              className="cursor-pointer transition-colors hover:bg-gray-800 rounded"
              onClick={() => handleClick("3")}
            >
              3
            </button>
            <button
              className="p-5 text-xl text-white rounded cursor-pointer transition-colors bg-amber-500 hover:bg-amber-600"
              onClick={() => handleClick("+")}
            >
              +
            </button>
            <button
              className="cursor-pointer transition-colors hover:bg-gray-800 rounded"
              onClick={() => handleClick("4")}
            >
              4
            </button>
            <button
              className="cursor-pointer transition-colors hover:bg-gray-800 rounded"
              onClick={() => handleClick("5")}
            >
              5
            </button>
            <button
              className="cursor-pointer transition-colors hover:bg-gray-800 rounded"
              onClick={() => handleClick("6")}
            >
              6
            </button>
            <button
              className="p-5 text-xl text-white rounded cursor-pointer transition-colors bg-amber-500 hover:bg-amber-600"
              onClick={() => handleClick("-")}
            >
              -
            </button>
            <button
              className="cursor-pointer transition-colors hover:bg-gray-800 rounded"
              onClick={() => handleClick("7")}
            >
              7
            </button>
            <button
              className="cursor-pointer transition-colors hover:bg-gray-800 rounded"
              onClick={() => handleClick("8")}
            >
              8
            </button>
            <button
              className="cursor-pointer transition-colors hover:bg-gray-800 rounded"
              onClick={() => handleClick("9")}
            >
              9
            </button>
            <button
              className="p-5 text-xl text-white rounded cursor-pointer transition-colors bg-amber-500 hover:bg-amber-600"
              onClick={() => handleClick("*")}
            >
              ×
            </button>
            <button
              className="cursor-pointer transition-colors hover:bg-gray-800 rounded"
              onClick={() => handleClick("0")}
            >
              0
            </button>
            <button
              className="cursor-pointer transition-colors hover:bg-gray-800 rounded"
              onClick={() => handleClick(".")}
            >
              ,
            </button>
            <button
              className="p-5 text-xl text-white rounded cursor-pointer transition-colors bg-green-500 hover:bg-green-600"
              onClick={() => handleClick("=")}
            >
              =
            </button>
            <button
              className="p-5 text-xl text-white rounded cursor-pointer transition-colors bg-amber-500 hover:bg-amber-600"
              onClick={() => handleClick("/")}
            >
              ÷
            </button>
            <button
              className="p-5 text-xl text-white rounded cursor-pointer transition-colors bg-red-500 hover:bg-red-600"
              onClick={() => handleClick("C")}
            >
              C
            </button>
            <button
              className="p-5 text-xl text-white rounded cursor-pointer transition-colors bg-red-500 hover:bg-red-600"
              onClick={() => handleClick("Backspace")}
            >
              ←
            </button>
          </div>
        </div>
      </div>
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
            <div className="p-4 pt-6"></div>
            <div className="text-gray-800 text-sm mt-16">
              {" "}
              <p className="font-bold mt-6 text-center">
                {" "}
                ➗ Онлайн Калькулятор | Бесплатный Калькулятор для Расчета и
                Решения Задач{" "}
              </p>
              <p className="mt-6">
                <strong>Онлайн калькулятор</strong> — это универсальный
                инструмент для мгновенного выполнения математических операций и
                сложных расчетов. Наш{" "}
                <strong>бесплатный калькулятор онлайн</strong> предоставляет
                мощный функционал в простом и удобном интерфейсе, доступном
                прямо в браузере.
              </p>
              <p className="mt-6 font-bold">
                Основные возможности онлайн калькулятора:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>
                    <strong>Простой калькулятор</strong> — сложение, вычитание,
                    умножение и деление для повседневных задач
                  </span>
                </li>
                <li className="flex items-start">
                  <span className=" mr-2">✓</span>
                  <span>
                    <strong>Инженерный калькулятор</strong> — тригонометрия,
                    логарифмы, степени, корни и константы
                  </span>
                </li>
                <li className="flex items-start">
                  <span className=" mr-2">✓</span>
                  <span>
                    <strong>Калькулятор процентов</strong> — расчет скидок,
                    наценок, процента от числа и прироста
                  </span>
                </li>
                <li className="flex items-start">
                  <span className=" mr-2">✓</span>
                  <span>
                    Мгновенный расчет и точные результаты без перезагрузки
                    страницы
                  </span>
                </li>
                <li className="flex items-start">
                  <span className=" mr-2">✓</span>
                  <span>
                    <strong>Калькулятор на компьютер</strong> — работает в
                    браузере без скачивания и установки
                  </span>
                </li>
                <li className="flex items-start">
                  <span className=" mr-2">✓</span>
                  <span>
                    <strong>Калькулятор кредита</strong> — расчет ежемесячного
                    платежа, переплаты и графика погашения
                  </span>
                </li>
                <li className="flex items-start">
                  <span className=" mr-2">✓</span>
                  <span>
                    <strong>Калькулятор для учебы</strong> — решение
                    алгебраических уравнений и математических задач
                  </span>
                </li>
                <li className="flex items-start">
                  <span className=" mr-2">✓</span>
                  <span>
                    <strong>Калькулятор ипотеки</strong> — расчет платежей по
                    ипотечному кредиту и первоначального взноса
                  </span>
                </li>
              </ul>
              <p className="mt-6 font-bold">
                Почему выбирают наш онлайн калькулятор:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>
                    <strong>Удобный интерфейс.</strong> Интуитивное управление,
                    крупные кнопки, история вычислений
                  </span>
                </li>
                <li className="flex items-start">
                  <span className=" mr-2">✓</span>
                  <span>
                    <strong>Высокая точность.</strong> Надежные алгоритмы для
                    сложных финансовых и инженерных расчетов
                  </span>
                </li>
                <li className="flex items-start">
                  <span className=" mr-2">✓</span>
                  <span>
                    <strong>Кроссплатформенность.</strong> Работает на всех
                    устройствах: ПК, ноутбук, планшет, смартфон
                  </span>
                </li>
              </ul>
              <p className="mt-6 font-bold">
                Практическое применение калькулятора:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>
                    <strong>Финансы.</strong> Расчет бюджета, кредитов,
                    депозитов, налогов и бизнес-планов
                  </span>
                </li>
                <li className="flex items-start">
                  <span className=" mr-2">✓</span>
                  <span>
                    <strong>Строительство и ремонт.</strong> Расчет площади,
                    объема, расхода материалов и сметы
                  </span>
                </li>
                <li className="flex items-start">
                  <span className=" mr-2">✓</span>
                  <span>
                    <strong>Образование.</strong> Решение домашних заданий,
                    контрольных работ, подготовка к экзаменам
                  </span>
                </li>
                <li className="flex items-start">
                  <span className=" mr-2">✓</span>
                  <span>
                    <strong>Кулинария.</strong> Пересчет ингредиентов,
                    пропорций, времени и температуры
                  </span>
                </li>
              </ul>
              <p className="mt-4">
                Наш <strong>онлайн калькулятор расчетов</strong> использует
                точные математические алгоритмы. Вы можете выполнить как{" "}
                <strong>простые расчеты</strong> (например,{" "}
                <strong>калькулятор процентов онлайн</strong>), так и сложные
                инженерные вычисления. Доступен режим{" "}
                <strong>научного калькулятора</strong> для студентов и
                специалистов. Все расчеты сохраняются в истории для вашего
                удобства.
              </p>
              <p className="mt-6">
                <strong>Бесплатный онлайн калькулятор</strong> — это ваш
                надежный помощник в учебе, работе и быту! Попробуйте наш{" "}
                <strong>калькулятор для компьютера</strong> прямо сейчас — это
                лучший способ быстро и точно выполнить любые расчеты.{" "}
                <strong>Универсальный калькулятор</strong> с мощным функционалом
                для решения любых задач!
              </p>
              <p className="mt-6">
                Популярные запросы: калькулятор онлайн, инженерный калькулятор,
                калькулятор процентов, калькулятор кредита, ипотечный
                калькулятор, научный калькулятор, простой калькулятор, расчет
                онлайн, калькулятор на компьютер
              </p>
            </div>
          </div>
        </details>
      </div>
    </>
  );
}

export default Calculator;
