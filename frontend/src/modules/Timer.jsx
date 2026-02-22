import React, { useState, useEffect, useRef } from "react";
import timermp3 from "../assets/timer.mp3";
import Description_component from "../components/Description_component";

// Функция воспроизведения звука

const playSound = () => {
  const audio = new Audio(timermp3);
  audio.play();
};

const Timer = () => {
  const [time, setTime] = useState(300); // 5 минут в секундах
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(100);
  const [customMinutes, setCustomMinutes] = useState(5);
  const [customSeconds, setCustomSeconds] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Форматирование времени
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Сброс таймера
  const resetTimer = () => {
    setTime(totalTimeRef.current);
    setIsActive(false);
    setProgress(100);
    setIsComplete(false);
  };

  // Установка пользовательского времени
  const setCustomTime = () => {
    const totalSeconds = customMinutes * 60 + customSeconds;
    if (totalSeconds > 0 && totalSeconds <= 3600) {
      // Максимум 1 час
      setTime(totalSeconds);
      totalTimeRef.current = totalSeconds;
      setProgress(100);
      setIsEditing(false);
      setIsComplete(false);
    }
  };

  // Быстрая установка времени
  const handleQuickTime = (minutes) => {
    if (!isActive) {
      const totalSeconds = minutes * 60;
      setTime(totalSeconds);
      totalTimeRef.current = totalSeconds;
      setProgress(100);
      setIsComplete(false);
    }
  };

  const totalTimeRef = useRef(300);

  // Обработка таймера
  useEffect(() => {
    let timerId;

    if (isActive && time > 0) {
      timerId = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - 1;
          const newProgress = (newTime / totalTimeRef.current) * 100;
          setProgress(newProgress);

          if (newTime === 0) {
            setIsComplete(true);
            setIsActive(false);
            // Воспроизводим звук только здесь
            playSound();
          }

          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isActive, time]);

  return (
    <>
      <div className="w-full max-w-md mx-auto">
        {/* Основной контейнер таймера */}
        <div
          className={`relative bg-linear-to-br from-slate-800 to-gray-900 rounded-3xl border ${
            isComplete ? "border-emerald-500/40" : "border-cyan-500/20"
          } shadow-2xl overflow-hidden transition-all duration-500`}
        >
          {/* Верхний градиент */}
          <div
            className={`h-2 bg-linear-to-r ${
              isComplete
                ? "from-emerald-500 to-green-400"
                : "from-cyan-500 via-teal-400 to-emerald-500"
            }`}
          ></div>

          <div className="p-6">
            {/* Заголовок */}
            <div className="text-center mb-6 cursor-default">
              <h1
                className={`text-2xl font-bold bg-linear-to-r ${
                  isComplete
                    ? "from-emerald-300 to-green-300"
                    : "from-cyan-400 to-emerald-400"
                } bg-clip-text text-transparent`}
              >
                {isComplete ? "Время вышло!" : "Таймер"}
              </h1>
              {isComplete && (
                <p className="text-emerald-300 text-sm mt-1 animate-pulse">
                  🔔 Таймер окончен
                </p>
              )}
            </div>

            {/* Круг прогресса */}
            <div className="relative w-56 h-56 mx-auto mb-6">
              {/* Внешний круг */}
              <div className="absolute inset-0 rounded-full border-4 border-slate-700/50"></div>

              {/* Круг прогресса */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle
                  cx="112"
                  cy="112"
                  r="104"
                  fill="none"
                  stroke="url(#gradient-progress)"
                  strokeWidth="8"
                  strokeDasharray="654"
                  strokeDashoffset={654 - (654 * progress) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient
                    id="gradient-progress"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Пульсация */}

              {isComplete ? (
                <div className="absolute inset-0">
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-400/40 animate-ping"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-cyan-400/30 animate-pulse"></div>
                </div>
              ) : (
                <div></div>
              )}

              {/* Отображение времени */}
              <div className="absolute inset-0 flex flex-col items-center justify-center cursor-default">
                <div
                  className={`text-5xl font-bold bg-linear-to-r ${
                    isComplete
                      ? "from-emerald-200 to-green-200"
                      : "from-cyan-300 to-emerald-300"
                  } bg-clip-text text-transparent`}
                >
                  {formatTime(time)}
                </div>
                <div className="text-slate-400 text-sm mt-2">
                  {progress.toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Пользовательский ввод времени */}
            {isEditing ? (
              <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-cyan-500/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-slate-300 font-medium">
                    Установите время
                  </h3>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-slate-400 hover:text-slate-300 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex gap-3 mb-4">
                  <div className="flex-1">
                    <label className="block text-slate-400 text-sm mb-1">
                      Минуты
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="240"
                      value={customMinutes}
                      onChange={(e) =>
                        setCustomMinutes(
                          Math.min(
                            240,
                            Math.max(0, parseInt(e.target.value) || 0),
                          ),
                        )
                      }
                      className="w-full bg-slate-900 border border-cyan-500/30 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-slate-400 text-sm mb-1">
                      Секунды
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={customSeconds}
                      onChange={(e) =>
                        setCustomSeconds(
                          Math.min(
                            59,
                            Math.max(0, parseInt(e.target.value) || 0),
                          ),
                        )
                      }
                      className="w-full bg-slate-900 border border-cyan-500/30 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <button
                  onClick={setCustomTime}
                  className="w-full py-2 bg-linear-to-r from-cyan-600 to-teal-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Установить время
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full cursor-pointer mb-6 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800/70 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>⏱️</span>
                  <span>Установить свое время</span>
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  Текущее: {formatTime(time)}
                </div>
              </button>
            )}

            {/* Быстрый выбор времени */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[1, 3, 5, 10, 15, 30].map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => handleQuickTime(minutes)}
                  disabled={isActive}
                  className={`py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-105 active:scale-95 cursor-pointer"
                  } ${
                    time === minutes * 60
                      ? "bg-linear-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-500/30"
                      : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700 "
                  }`}
                >
                  {minutes} мин
                </button>
              ))}
            </div>

            {/* Кнопки управления */}
            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={() => setIsActive(!isActive)}
                disabled={time === 0}
                className={`px-6 cursor-pointer py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  isActive
                    ? "bg-linear-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30"
                    : time === 0
                      ? "bg-linear-to-r from-slate-700 to-slate-800 text-white"
                      : "bg-linear-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/30"
                } ${time === 0 ? "cursor-not-allowed" : ""}`}
              >
                {isActive ? "Пауза" : time === 0 ? "Завершено" : "Старт"}
              </button>
              <button
                onClick={resetTimer}
                className={`px-6 py-3 bg-linear-to-r cursor-pointer ${
                  time === 0
                    ? "from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30"
                    : "from-slate-700 to-slate-800"
                }  text-slate-300 rounded-xl font-semibold border border-slate-600 transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-slate-700/30`}
              >
                Сброс
              </button>
            </div>

            {/* Индикатор состояния */}
            <div className="flex items-center justify-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isActive
                    ? "bg-emerald-400 animate-pulse"
                    : isComplete
                      ? "bg-emerald-400"
                      : "bg-cyan-400"
                }`}
              ></div>
              <span className="text-slate-400 text-sm">
                {isComplete
                  ? "Таймер завершен"
                  : isActive
                    ? "Таймер активен"
                    : "Таймер на паузе"}
              </span>
            </div>
          </div>

          {/* Нижний градиент */}
          <div
            className={`h-2 bg-linear-to-r ${
              isComplete
                ? "from-green-400 to-emerald-500"
                : "from-emerald-500 via-teal-400 to-cyan-500"
            }`}
          ></div>
        </div>

        {/* Информация о звуке */}
        <div className="mt-4 text-center">
          <p className="text-slate-500 text-sm">
            По окончании таймера прозвучит звуковой сигнал
          </p>
        </div>
      </div>
      <Description_component>
        <p className="font-bold mt-6 text-center">
          ⏱️ Онлайн Таймер Обратного Отсчета | Бесплатный Таймер для Кухни,
          Тренировок и Работы
        </p>

        <p className="mt-6">
          <strong>Онлайн таймер обратного отсчета</strong> — это незаменимый
          инструмент для управления временем, который помогает контролировать
          длительность любых процессов. Наш{" "}
          <strong>бесплатный таймер онлайн</strong> предлагает удобный интерфейс
          и множество полезных функций для личного и профессионального
          использования.
        </p>

        <p className="mt-6 font-bold">Основные возможности онлайн таймера:</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>
              <strong>Таймер для кухни</strong> — идеален для приготовления
              пищи, выпечки и соблюдения рецептов
            </span>
          </li>
          <li className="flex items-start">
            <span className=" mr-2">✓</span>
            <span>
              <strong>Таймер для тренировок</strong> — контроль интервалов,
              подходов и отдыха в спортивных занятиях
            </span>
          </li>
          <li className="flex items-start">
            <span className=" mr-2">✓</span>
            <span>
              <strong>Таймер для работы</strong> — организация рабочего времени
              по методу Помодоро
            </span>
          </li>
          <li className="flex items-start">
            <span className=" mr-2">✓</span>
            <span>Мгновенная генерация чисел без перезагрузки страницы</span>
          </li>
          <li className="flex items-start">
            <span className=" mr-2">✓</span>
            <span>
              <strong>Обратный отсчет</strong> с точностью до секунды для любых
              задач
            </span>
          </li>
          <li className="flex items-start">
            <span className=" mr-2">✓</span>
            <span>
              <strong>Таймер с звуковым сигналом</strong> — громкое оповещение
              об окончании времени
            </span>
          </li>
          <li className="flex items-start">
            <span className=" mr-2">✓</span>
            <span>
              <strong>Таймер на компьютере</strong> — работает прямо в браузере
              без установки программ
            </span>
          </li>
          <li className="flex items-start">
            <span className=" mr-2">✓</span>
            <span>
              <strong>Таймер для учебы</strong> — планирование времени на
              выполнение заданий и перерывы
            </span>
          </li>
          <li className="flex items-start">
            <span className=" mr-2">✓</span>
            <span>
              <strong>Таймер для игр</strong> — контроль времени в настольных и
              спортивных играх
            </span>
          </li>
        </ul>

        <p className="mt-6 font-bold">Почему выбирают наш онлайн таймер:</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>
              <strong>Удобный интерфейс.</strong> Интуитивно понятное
              управление, крупные цифры, настраиваемые цвета и темы
            </span>
          </li>
          <li className="flex items-start">
            <span className=" mr-2">✓</span>
            <span>
              <strong>Быстрая настройка.</strong> Предустановки для популярных
              задач (5, 10, 15, 25, 30, 60 минут)
            </span>
          </li>
          <li className="flex items-start">
            <span className=" mr-2">✓</span>
            <span>
              <strong>Кроссплатформенность.</strong> Работает на всех
              устройствах: компьютеры, планшеты, смартфоны
            </span>
          </li>
        </ul>
        <p className="mt-6 font-bold">Практическое применение таймера:</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>
              <strong>Кулинария.</strong> Приготовление пищи, выпечка, варка яиц
            </span>
          </li>
          <li className="flex items-start">
            <span className=" mr-2">✓</span>
            <span>
              <strong>Бизнес. </strong> Презентации, встречи, дедлайны
            </span>
          </li>
          <li className="flex items-start">
            <span className=" mr-2">✓</span>
            <span>
              <strong>Фитнес.</strong> Интервальные тренировки, HIIT, отдых
            </span>
          </li>
          <li className="flex items-start">
            <span className=" mr-2">✓</span>
            <span>
              <strong>Образование.</strong> Экзамены, тесты, домашние задания
            </span>
          </li>
        </ul>

        <p className="mt-4">
          Наш <strong>таймер онлайн с обратным отсчетом</strong> использует
          точные алгоритмы JavaScript для измерения времени. Вы можете
          установить <strong>таймер на 5 минут</strong>,{" "}
          <strong>таймер на 10 минут</strong>,{" "}
          <strong>таймер на 15 минут</strong> или любое другое значение до 24
          часов. После окончания отсчета срабатывает{" "}
          <strong>звуковой сигнал таймера</strong>, который можно настроить по
          громкости и мелодии.
        </p>

        <p className="mt-6">
          <strong>Онлайн таймер обратного отсчета</strong> — это ваш надежный
          помощник в управлении временем! Попробуйте наш{" "}
          <strong>таймер для компьютера</strong> прямо сейчас — это лучший
          способ повысить продуктивность, соблюдать сроки и эффективно
          планировать свой день. <strong>Простой таймер</strong> с мощным
          функционалом!
        </p>

        <p className="mt-6">
          Популярные запросы: таймер онлайн, таймер обратного отсчета, таймер на
          5 минут, таймер для кухни, таймер для тренировок, таймер с
          будильником, бесплатный таймер, таймер помодоро
        </p>
      </Description_component>
    </>
  );
};

export default Timer;
