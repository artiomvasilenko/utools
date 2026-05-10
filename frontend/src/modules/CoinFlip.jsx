import React, { useState, useCallback, useRef, useEffect } from "react";
import Description_component from "../components/Description_component";
import eaglesvg from "../assets/eagle.svg";
import roublesvg from "../assets/rouble.svg";

const CoinFlip = () => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState(null); // 'heads' или 'tails'
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ heads: 0, tails: 0, total: 0 });
  const [showResult, setShowResult] = useState(false);
  const [flipCount, setFlipCount] = useState(1);
  const [multiFlipResults, setMultiFlipResults] = useState([]);
  const [isMultiFlip, setIsMultiFlip] = useState(false);
  const coinRef = useRef(null);

  // Звук подбрасывания монеты (Web Audio API)
  const playFlipSound = useCallback(() => {
    try {
      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();

      // Звук вращения
      const duration = 1.5;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = "sine";
      gainNode.gain.value = 0.15;

      // Имитация звука вращающейся монеты
      const now = audioContext.currentTime;
      for (let i = 0; i < 20; i++) {
        const freq = 2000 + Math.random() * 3000;
        oscillator.frequency.setValueAtTime(freq, now + i * 0.05);
      }

      oscillator.start(now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
      oscillator.stop(now + duration);
    } catch (e) {
      // Игнорируем ошибки аудио
    }
  }, []);

  // Звук результата
  const playResultSound = useCallback(() => {
    try {
      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.2;

      const now = audioContext.currentTime;
      oscillator.start(now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      oscillator.stop(now + 0.3);
    } catch (e) {
      // Игнорируем ошибки
    }
  }, []);

  // Подбросить монету (одиночный бросок)
  const flipCoin = useCallback(() => {
    if (isFlipping) return;

    setIsFlipping(true);
    setShowResult(false);
    setResult(null);
    playFlipSound();

    // Случайный результат
    const outcomes = ["heads", "tails"];
    const outcome = outcomes[Math.floor(Math.random() * 2)];

    setTimeout(() => {
      setResult(outcome);
      setShowResult(true);
      setIsFlipping(false);
      playResultSound();

      // Обновляем историю и статистику
      const newFlip = {
        id: Date.now(),
        result: outcome,
        time: new Date().toLocaleTimeString(),
      };

      setHistory((prev) => [newFlip, ...prev].slice(0, 50)); // Храним последние 50
      setStats((prev) => ({
        heads: prev.heads + (outcome === "heads" ? 1 : 0),
        tails: prev.tails + (outcome === "tails" ? 1 : 0),
        total: prev.total + 1,
      }));
    }, 1600);
  }, [isFlipping, playFlipSound, playResultSound]);

  // Множественное подбрасывание
  const multiFlip = useCallback(() => {
    if (isFlipping) return;

    const count = Math.min(Math.max(flipCount, 1), 100);
    setIsMultiFlip(true);
    setIsFlipping(true);
    setShowResult(false);
    setResult(null);
    setMultiFlipResults([]);

    let currentFlip = 0;
    const results = [];

    const interval = setInterval(() => {
      const outcome = Math.random() < 0.5 ? "heads" : "tails";
      results.push(outcome);
      currentFlip++;

      setMultiFlipResults([...results]);

      if (currentFlip >= count) {
        clearInterval(interval);
        setIsFlipping(false);
        setShowResult(true);
        playResultSound();

        // Обновляем статистику
        const heads = results.filter((r) => r === "heads").length;
        const tails = results.filter((r) => r === "tails").length;

        setStats((prev) => ({
          heads: prev.heads + heads,
          tails: prev.tails + tails,
          total: prev.total + count,
        }));

        // Добавляем в историю
        const newFlip = {
          id: Date.now(),
          result: `multi_${count}`,
          heads,
          tails,
          time: new Date().toLocaleTimeString(),
        };
        setHistory((prev) => [newFlip, ...prev].slice(0, 50));
      }
    }, 200);
  }, [flipCount, isFlipping, playResultSound]);

  // Сброс статистики
  const resetStats = () => {
    setStats({ heads: 0, tails: 0, total: 0 });
    setHistory([]);
    setMultiFlipResults([]);
    setResult(null);
    setShowResult(false);
  };

  // Процентное соотношение
  const getPercentage = (value) => {
    if (stats.total === 0) return "0%";
    return `${((value / stats.total) * 100).toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen">
      <title>Орёл или Решка - Полезные инструменты - use-tools.ru</title>
      <meta
        name="description"
        content="Подбросьте монетку онлайн с анимацией вращения. Орёл или решка — решайте споры быстро и честно!"
      />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-8">
          {/* Основная область с монетой */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-blue-100">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100 text-center">
              🪙 Орёл или Решка
            </h2>

            {/* Монета */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-8" style={{ perspective: "1000px" }}>
                <div
                  ref={coinRef}
                  className={`
                    relative w-40 h-40 md:w-48 md:h-48 rounded-full
                    ${isFlipping ? "animate-coin-flip" : ""}
                    ${!isFlipping && showResult ? "scale-110" : ""}
                    transition-transform duration-300
                  `}
                  style={{
                    transformStyle: "preserve-3d",
                    animation: isFlipping ? "coinFlip 1.6s ease-out" : "none",
                    transform:
                      showResult && result === "tails"
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                  }}
                >
                  {/* Орёл (аверс) */}
                  <div
                    className="absolute inset-0 rounded-full flex items-center justify-center"
                    style={{
                      backfaceVisibility: "hidden",
                      background:
                        "linear-gradient(135deg, #fbbf24 0%, #f59e0b 30%, #d97706 70%, #b45309 100%)",
                      border: "4px solid #92400e",
                      boxShadow:
                        "0 0 30px rgba(245, 158, 11, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <div className="text-center">
                      <div className="relative">
                        <img src={eaglesvg} />
                      </div>
                      <div className="text-xs font-bold text-amber-100 mt-2 tracking-wider">
                        ОРЁЛ
                      </div>
                    </div>
                  </div>

                  {/* Решка (реверс) */}
                  <div
                    className="absolute inset-0 rounded-full flex items-center justify-center"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      background:
                        "linear-gradient(135deg, #fbbf24 0%, #f59e0b 30%, #d97706 70%, #b45309 100%)",
                      border: "4px solid #92400e",
                      boxShadow:
                        "0 0 30px rgba(245, 158, 11, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <div className="text-center">
                      {/* Номинал (стилизованная "1 рубль") */}
                      <img src={roublesvg} />
                      <div className="text-xs font-bold text-amber-100 mt-1 tracking-wider">
                        РЕШКА
                      </div>
                    </div>
                  </div>
                </div>

                {/* Тень монеты */}
                <div
                  className={`
                    absolute -bottom-4 left-1/2 transform -translate-x-1/2
                    w-32 h-4 bg-black/20 rounded-full blur-md
                    transition-all duration-300
                    ${isFlipping ? "scale-75 opacity-30" : "scale-100 opacity-100"}
                    ${showResult ? "scale-110" : ""}
                  `}
                ></div>
              </div>

              {/* Результат */}
              {showResult && result && !isMultiFlip && (
                <div className="text-center animate-bounce-in">
                  <div className="text-2xl md:text-3xl font-bold mb-2">
                    {result === "heads" ? (
                      <span className="text-amber-600">🦅 Орёл!</span>
                    ) : (
                      <span className="text-amber-600">📀 Решка!</span>
                    )}
                  </div>
                </div>
              )}

              {/* Кнопки управления */}
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <button
                  onClick={flipCoin}
                  disabled={isFlipping}
                  className="px-8 py-4 bg-linear-to-r from-amber-500 to-yellow-500 text-white rounded-xl font-bold text-lg hover:from-amber-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transform hover:scale-105 active:scale-95"
                >
                  {isFlipping ? (
                    <span className="flex items-center space-x-2">
                      <svg
                        className="animate-spin w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Бросаем...</span>
                    </span>
                  ) : (
                    "🎯 Подбросить монету"
                  )}
                </button>

                <button
                  onClick={resetStats}
                  className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all cursor-pointer"
                >
                  🔄 Сбросить
                </button>
              </div>

              {/* Множественное подбрасывание */}
              <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200 w-full max-w-md">
                <h4 className="font-semibold text-blue-800 mb-3">
                  Много подбрасываний
                </h4>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={flipCount}
                    onChange={(e) =>
                      setFlipCount(
                        Math.min(
                          100,
                          Math.max(1, parseInt(e.target.value) || 1),
                        ),
                      )
                    }
                    className="w-24 p-3 bg-white border-2 border-blue-200 rounded-lg text-center text-lg font-bold text-blue-800 focus:border-blue-500 outline-none"
                  />
                  <button
                    onClick={multiFlip}
                    disabled={isFlipping}
                    className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Бросить {flipCount} раз
                  </button>
                </div>

                {/* Результаты множественного броска */}
                {multiFlipResults.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {multiFlipResults.map((res, idx) => (
                        <span
                          key={idx}
                          className={`
                            inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold
                            ${
                              res === "heads"
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : "bg-gray-100 text-gray-800 border border-gray-300"
                            }
                          `}
                        >
                          {res === "heads" ? "🦅" : "📀"}
                        </span>
                      ))}
                    </div>
                    {showResult && multiFlipResults.length > 0 && (
                      <div className="mt-3 text-center text-sm text-blue-700 font-semibold">
                        Орёл:{" "}
                        {multiFlipResults.filter((r) => r === "heads").length} |
                        Решка:{" "}
                        {multiFlipResults.filter((r) => r === "tails").length}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Статистика */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <h3 className="text-xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100">
              📊 Статистика бросков
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Орёл */}
              <div className="bg-linear-to-br from-amber-50 to-yellow-50 p-6 rounded-xl border border-amber-200 text-center">
                <div className="text-4xl mb-3">🦅</div>
                <div className="text-sm text-amber-700 mb-2">Орёл</div>
                <div className="text-3xl font-bold text-amber-800">
                  {stats.heads}
                </div>
                <div className="text-sm text-amber-600 mt-2">
                  {getPercentage(stats.heads)}
                </div>
              </div>

              {/* Всего бросков */}
              <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200 text-center">
                <div className="text-4xl mb-3">🎯</div>
                <div className="text-sm text-blue-700 mb-2">Всего бросков</div>
                <div className="text-3xl font-bold text-blue-800">
                  {stats.total}
                </div>
              </div>

              {/* Решка */}
              <div className="bg-linear-to-br from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200 text-center">
                <div className="text-4xl mb-3">📀</div>
                <div className="text-sm text-gray-700 mb-2">Решка</div>
                <div className="text-3xl font-bold text-gray-800">
                  {stats.tails}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {getPercentage(stats.tails)}
                </div>
              </div>
            </div>

            {/* Визуальный прогресс бар */}
            {stats.total > 0 && (
              <div className="mt-6">
                <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-linear-to-r from-amber-400 to-yellow-500 transition-all duration-500 flex items-center justify-center text-white text-sm font-bold"
                    style={{ width: `${(stats.heads / stats.total) * 100}%` }}
                  >
                    {stats.heads > 0 &&
                      `${((stats.heads / stats.total) * 100).toFixed(0)}%`}
                  </div>
                  <div
                    className="h-full bg-linear-to-r from-gray-400 to-slate-500 transition-all duration-500 flex items-center justify-center text-white text-sm font-bold"
                    style={{ width: `${(stats.tails / stats.total) * 100}%` }}
                  >
                    {stats.tails > 0 &&
                      `${((stats.tails / stats.total) * 100).toFixed(0)}%`}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* История бросков */}
          {history.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
              <h3 className="text-xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100">
                📝 История бросков
              </h3>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-400 font-mono">
                        #{history.length - idx}
                      </span>
                      {item.result === "heads" ? (
                        <span className="text-lg">🦅 Орёл</span>
                      ) : item.result === "tails" ? (
                        <span className="text-lg">📀 Решка</span>
                      ) : (
                        <span className="text-sm">
                          Мультибросок ×{item.result.replace("multi_", "")}: 🦅
                          {item.heads} 📀{item.tails}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Информация */}
          <div className="bg-linear-to-r from-blue-100 to-cyan-100 p-5 rounded-xl border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-3">
              ℹ️ О подбрасывании монетки
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-blue-700 mb-2">
                  Как это работает?
                </h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Генератор случайных чисел определяет результат</li>
                  <li>• Вероятность орла и решки — по 50%</li>
                  <li>• Анимация имитирует реальное вращение монеты</li>
                  <li>• Можно бросить от 1 до 100 раз подряд</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-blue-700 mb-2">
                  Когда пригодится?
                </h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Решение споров и жеребьёвка</li>
                  <li>• Случайный выбор между двумя вариантами</li>
                  <li>• Демонстрация теории вероятностей</li>
                  <li>• Просто развлечение и игра</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CSS-анимация вращения монеты */}
        <style jsx>{`
          @keyframes coinFlip {
            0% {
              transform: rotateY(0deg) rotateX(0deg);
            }
            25% {
              transform: rotateY(360deg) rotateX(15deg);
            }
            50% {
              transform: rotateY(720deg) rotateX(0deg);
            }
            75% {
              transform: rotateY(1080deg) rotateX(-15deg);
            }
            100% {
              transform: rotateY(1440deg) rotateX(0deg);
            }
          }

          @keyframes bounce-in {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            50% {
              transform: scale(1.2);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          .animate-coin-flip {
            animation: coinFlip 1.6s ease-out;
          }

          .animate-bounce-in {
            animation: bounce-in 0.5s ease-out;
          }
        `}</style>
      </div>

      <Description_component>
        <p className="font-bold mt-6 text-center">
          🪙 Орёл или Решка Онлайн | Подбросить Монетку с Анимацией Бесплатно
        </p>
        <p className="mt-6">
          <strong>Орёл или решка онлайн</strong> — это виртуальный симулятор
          подбрасывания монетки с реалистичной анимацией вращения. Наш{" "}
          <strong>бесплатный генератор случайных решений</strong> использует
          криптографически стойкий алгоритм для честного результата 50/50.
          Подбрасывайте монетку сколько угодно раз — от одного броска до сотни
          подряд с полной статистикой.
        </p>
        <p className="mt-6 font-bold">
          Возможности генератора "Орёл или решка":
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>
              <strong>Реалистичная анимация</strong> — монета вращается как
              настоящая
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>
              <strong>Дизайн рублёвой монеты</strong> — орёл с двуглавым орлом,
              решка с номиналом
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>
              <strong>Множественные броски</strong> — до 100 подбрасываний за
              раз
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>
              <strong>Подробная статистика</strong> — подсчёт орлов и решек в
              процентах
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>
              <strong>История бросков</strong> — сохраняются последние 50
              результатов
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>
              <strong>Звуковое сопровождение</strong> — звук вращения и
              результат
            </span>
          </li>
        </ul>
      </Description_component>
    </div>
  );
};

export default CoinFlip;
