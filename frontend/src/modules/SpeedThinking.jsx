import React, { useState, useRef, useEffect } from "react";
import Description_component from "../components/Description_component";

const SpeedThinking = () => {
  // Состояния игры
  const [gameState, setGameState] = useState("menu");
  const [currentRound, setCurrentRound] = useState(0);
  const totalRounds = 10;
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [reactionTime, setReactionTime] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [bestResult, setBestResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [playerName, setPlayerName] = useState("");

  // Рефы для хранения актуальных значений
  const roundStartTimeRef = useRef(null);
  const currentRoundRef = useRef(0);
  const resultsRef = useRef([]);
  const scoreRef = useRef(0);
  const countdownTimerRef = useRef(null);
  const transitionTimerRef = useRef(null);
  const emergencyTimerRef = useRef(null); // Аварийный таймер

  // Загрузка истории
  useEffect(() => {
    const savedHistory = localStorage.getItem("speedThinkingHistory");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
        if (parsed.length > 0) {
          setBestResult(Math.min(...parsed.map((h) => h.averageTime)));
        }
      } catch (e) {}
    }

    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      if (emergencyTimerRef.current) clearTimeout(emergencyTimerRef.current);
    };
  }, []);

  // Типы заданий (4 типа)
  const taskTypes = [
    {
      name: "Сравнение чисел",
      icon: "🔢",
      instruction: "Какое число больше?",
      generate: () => {
        let num1 = Math.floor(Math.random() * 90) + 10;
        let num2 = Math.floor(Math.random() * 90) + 10;
        while (num1 === num2) {
          num2 = Math.floor(Math.random() * 90) + 10;
        }
        return {
          display: `${num1}  ?  ${num2}`,
          options: ["Левое больше", "Правое больше"],
          correctAnswer: num1 > num2 ? "Левое больше" : "Правое больше",
        };
      },
    },
    {
      name: "Цвет слова",
      icon: "🎨",
      instruction: "Какого ЦВЕТА написано слово?",
      generate: () => {
        const colorNames = ["Красный", "Синий", "Зелёный", "Жёлтый", "Чёрный"];
        const colorCodes = {
          Красный: "#EF4444",
          Синий: "#3B82F6",
          Зелёный: "#10B981",
          Жёлтый: "#F59E0B",
          Чёрный: "#1F2937",
        };
        let wordColor =
          colorNames[Math.floor(Math.random() * colorNames.length)];
        let wordText =
          colorNames[Math.floor(Math.random() * colorNames.length)];
        while (wordText === wordColor) {
          wordText = colorNames[Math.floor(Math.random() * colorNames.length)];
        }
        return {
          display: wordText,
          displayColor: colorCodes[wordColor],
          options: colorNames,
          correctAnswer: wordColor,
        };
      },
    },
    {
      name: "Быстрая математика",
      icon: "🧮",
      instruction: "Решите пример:",
      generate: () => {
        const op = ["+", "-", "×"][Math.floor(Math.random() * 3)];
        let num1, num2, answer;
        if (op === "+") {
          num1 = Math.floor(Math.random() * 50) + 10;
          num2 = Math.floor(Math.random() * 50) + 10;
          answer = num1 + num2;
        } else if (op === "-") {
          num1 = Math.floor(Math.random() * 50) + 30;
          num2 = Math.floor(Math.random() * num1);
          answer = num1 - num2;
        } else {
          num1 = Math.floor(Math.random() * 10) + 2;
          num2 = Math.floor(Math.random() * 10) + 2;
          answer = num1 * num2;
        }
        const options = new Set([answer]);
        while (options.size < 4) {
          const wrong = answer + (Math.floor(Math.random() * 20) - 10);
          if (wrong > 0 && wrong !== answer) options.add(wrong);
        }
        return {
          display: `${num1} ${op} ${num2} = ?`,
          options: [...options].sort(() => Math.random() - 0.5).map(String),
          correctAnswer: String(answer),
        };
      },
    },
    {
      name: "Чёт или нечет",
      icon: "🔲",
      instruction: "Это число чётное или нечётное?",
      generate: () => {
        const number = Math.floor(Math.random() * 199) + 2;
        return {
          display: String(number),
          options: ["Чётное", "Нечётное"],
          correctAnswer: number % 2 === 0 ? "Чётное" : "Нечётное",
        };
      },
    },
  ];

  // Генерация задания
  const generateTask = () => {
    const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    const taskData = taskType.generate();
    return {
      ...taskData,
      taskTypeName: taskType.name,
      taskTypeIcon: taskType.icon,
      instruction: taskType.instruction,
    };
  };

  // Очистка всех таймеров
  const clearAllTimers = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    if (emergencyTimerRef.current) {
      clearTimeout(emergencyTimerRef.current);
      emergencyTimerRef.current = null;
    }
  };

  // Принудительный переход дальше (аварийный механизм)
  const forceNextRound = (nextRound) => {
    console.log("Аварийный переход к раунду:", nextRound);
    clearAllTimers();

    if (nextRound < totalRounds) {
      startCountdown(nextRound);
    } else {
      finishGame();
    }
  };

  // Запуск нового раунда
  const startRound = (roundNum) => {
    clearAllTimers();

    const task = generateTask();
    setCurrentTask(task);
    setGameState("playing");
    setFeedback(null);
    setReactionTime(0);
    setCurrentRound(roundNum);
    currentRoundRef.current = roundNum;
    roundStartTimeRef.current = Date.now();

    // Аварийный таймер: если игрок не ответит за 30 секунд, принудительно идём дальше
    emergencyTimerRef.current = setTimeout(() => {
      console.log("Аварийный таймер: игрок не ответил");
      // Записываем фейковый результат
      const roundResult = {
        round: roundNum + 1,
        taskType: task.taskTypeName,
        question: task.display,
        userAnswer: "Нет ответа",
        correctAnswer: task.correctAnswer,
        isCorrect: false,
        reactionTime: 30000,
      };
      const newResults = [...resultsRef.current, roundResult];
      resultsRef.current = newResults;
      setResults(newResults);

      forceNextRound(roundNum + 1);
    }, 30000);
  };

  // Обратный отсчёт
  const startCountdown = (roundNum) => {
    clearAllTimers();

    setGameState("countdown");
    let count = 3;
    setCountdown(3);

    countdownTimerRef.current = setInterval(() => {
      count--;
      if (count <= 0) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
        startRound(roundNum);
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  // Обработка ответа
  const handleAnswer = (answer) => {
    if (gameState !== "playing" || !currentTask) return;

    clearAllTimers();

    const endTime = Date.now();
    const reactTime = endTime - (roundStartTimeRef.current || endTime);
    const isCorrect = answer === currentTask.correctAnswer;

    setReactionTime(reactTime);

    if (isCorrect) {
      const newScore = scoreRef.current + 1;
      scoreRef.current = newScore;
      setScore(newScore);
      setFeedback({ type: "correct", message: "✅ Правильно!" });
    } else {
      setFeedback({
        type: "incorrect",
        message: `❌ Неправильно. Ответ: ${currentTask.correctAnswer}`,
      });
    }

    // Сохраняем результат
    const roundResult = {
      round: currentRoundRef.current + 1,
      taskType: currentTask.taskTypeName,
      question: currentTask.display,
      userAnswer: answer,
      correctAnswer: currentTask.correctAnswer,
      isCorrect,
      reactionTime: reactTime,
    };

    const newResults = [...resultsRef.current, roundResult];
    resultsRef.current = newResults;
    setResults(newResults);

    setGameState("roundResult");

    const nextRound = currentRoundRef.current + 1;

    // Планируем переход
    transitionTimerRef.current = setTimeout(() => {
      forceNextRound(nextRound);
    }, 1500);
  };

  // Завершение игры
  const finishGame = () => {
    clearAllTimers();

    const finalResults = resultsRef.current;

    if (finalResults.length === 0) {
      setGameState("menu");
      return;
    }

    const totalTime = finalResults.reduce((sum, r) => sum + r.reactionTime, 0);
    const averageTime = Math.round(totalTime / finalResults.length);
    const correctAnswers = finalResults.filter((r) => r.isCorrect).length;
    const accuracy = Math.round((correctAnswers / finalResults.length) * 100);

    let rating;
    if (averageTime < 2000)
      rating = {
        text: "Молниеносная реакция! ⚡",
        color: "text-yellow-600",
        level: 5,
      };
    else if (averageTime < 3000)
      rating = {
        text: "Отличная скорость! 🚀",
        color: "text-green-600",
        level: 4,
      };
    else if (averageTime < 5000)
      rating = {
        text: "Хорошая скорость 👍",
        color: "text-blue-600",
        level: 3,
      };
    else if (averageTime < 8000)
      rating = {
        text: "Средняя скорость 🤔",
        color: "text-orange-600",
        level: 2,
      };
    else
      rating = {
        text: "Нужно больше практики 📚",
        color: "text-red-600",
        level: 1,
      };

    const gameResult = {
      id: Date.now(),
      date: new Date().toLocaleDateString("ru-RU"),
      time: new Date().toLocaleTimeString("ru-RU"),
      playerName: playerName || "Аноним",
      averageTime,
      accuracy,
      correctAnswers,
      totalRounds: finalResults.length,
      rating,
      details: [...finalResults],
    };

    setHistory((prev) => {
      const newHistory = [gameResult, ...prev].slice(0, 20);
      localStorage.setItem("speedThinkingHistory", JSON.stringify(newHistory));
      return newHistory;
    });

    if (!bestResult || averageTime < bestResult) {
      setBestResult(averageTime);
    }

    setGameState("finished");
  };

  // Начать игру заново
  const startGame = () => {
    clearAllTimers();
    currentRoundRef.current = 0;
    resultsRef.current = [];
    scoreRef.current = 0;
    setCurrentRound(0);
    setScore(0);
    setResults([]);
    setFeedback(null);
    startCountdown(0);
  };

  // Вернуться в меню
  const goToMenu = () => {
    clearAllTimers();
    currentRoundRef.current = 0;
    resultsRef.current = [];
    scoreRef.current = 0;
    setGameState("menu");
    setCurrentRound(0);
    setScore(0);
    setResults([]);
    setCurrentTask(null);
    setFeedback(null);
  };

  // Экспорт
  const exportResults = (result) => {
    const text = [
      "Результат теста скорости мышления",
      "=================================",
      `Дата: ${result.date} ${result.time}`,
      `Имя: ${result.playerName}`,
      `Среднее время реакции: ${(result.averageTime / 1000).toFixed(2)} сек`,
      `Точность: ${result.accuracy}%`,
      `Правильных ответов: ${result.correctAnswers} из ${result.totalRounds}`,
      `Оценка: ${result.rating.text}`,
      "",
      "Детали раундов:",
      ...result.details.map(
        (r, i) =>
          `Раунд ${i + 1}: ${r.taskType} | ${r.question} | Ответ: ${r.userAnswer} | ${r.isCorrect ? "✓" : "✗"} | ${(r.reactionTime / 1000).toFixed(2)}с`,
      ),
    ].join("\n");

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `тест_мышления_${result.date.replace(/\./g, "-")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Очистка истории
  const clearHistory = () => {
    setHistory([]);
    setBestResult(null);
    localStorage.removeItem("speedThinkingHistory");
  };

  // Форматирование времени
  const formatTime = (ms) => {
    if (!ms) return "0 мс";
    if (ms < 1000) return `${ms} мс`;
    return `${(ms / 1000).toFixed(2)} сек`;
  };

  // Рендер содержимого в зависимости от состояния
  const renderContent = () => {
    switch (gameState) {
      case "menu":
        return (
          <div className="text-center">
            <div className="text-8xl mb-6">🧠</div>
            <p className="text-xl text-blue-800 font-semibold mb-4">
              Проверьте свою скорость мышления!
            </p>
            <p className="text-blue-600 mb-8 max-w-lg mx-auto">
              Вам предстоит пройти {totalRounds} заданий на скорость реакции,
              логику и внимание. Отвечайте быстро и точно!
            </p>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-blue-700 mb-2">
                Ваше имя (необязательно)
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Введите имя"
                maxLength={30}
                className="max-w-xs mx-auto w-full p-3 border-2 border-blue-200 rounded-xl text-center text-blue-800 focus:border-blue-500 outline-none"
              />
            </div>
            <button
              onClick={startGame}
              className="px-10 py-4 bg-blue-500 text-white rounded-xl font-bold text-xl hover:bg-blue-600 transition-all shadow-lg cursor-pointer transform hover:scale-105 active:scale-95"
            >
              🚀 Начать тест
            </button>
            {bestResult && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200 max-w-xs mx-auto">
                <p className="text-sm text-yellow-700">🏆 Лучший результат:</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {formatTime(bestResult)}
                </p>
              </div>
            )}
          </div>
        );

      case "countdown":
        return (
          <div className="text-center py-20">
            <div className="text-8xl font-bold text-blue-500 animate-pulse">
              {countdown}
            </div>
            <p className="text-xl text-blue-600 mt-4">Приготовьтесь...</p>
          </div>
        );

      case "playing":
        if (!currentTask) return null;
        return (
          <div className="text-center">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-blue-600 font-semibold">
                Раунд {currentRound + 1} из {totalRounds}
              </span>
              <span className="text-sm text-blue-600">Правильно: {score}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentRound + 1) / totalRounds) * 100}%`,
                }}
              ></div>
            </div>
            <div className="mb-8">
              <div className="text-4xl mb-4">{currentTask.taskTypeIcon}</div>
              <p className="text-lg text-blue-700 mb-4">
                {currentTask.instruction}
              </p>
              {currentTask.displayColor ? (
                <div
                  className="text-5xl md:text-6xl font-bold mb-6 p-6 rounded-xl inline-block"
                  style={{ color: currentTask.displayColor }}
                >
                  {currentTask.display}
                </div>
              ) : (
                <div className="text-5xl md:text-6xl font-bold text-blue-800 mb-6">
                  {currentTask.display}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              {currentTask.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className="py-4 px-6 bg-blue-50 border-2 border-blue-200 rounded-xl text-xl font-bold text-blue-800 hover:bg-blue-100 hover:border-blue-400 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case "roundResult":
        if (!feedback) return null;
        return (
          <div className="text-center py-10">
            <div className="text-4xl mb-4">{feedback.message}</div>
            <p className="text-blue-600 text-lg">
              Время реакции: {formatTime(reactionTime)}
            </p>
            <p className="text-blue-400 text-sm mt-2">
              Следующий раунд начнётся автоматически...
            </p>
          </div>
        );

      case "finished":
        const lastResult = history[0];
        if (!lastResult) return null;
        return (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-blue-800 mb-6">
              Тест завершён!
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                <div className="text-3xl font-bold text-blue-800">
                  {formatTime(lastResult.averageTime)}
                </div>
                <div className="text-sm text-blue-600 mt-1">Среднее время</div>
              </div>
              <div className="bg-green-50 p-5 rounded-xl border border-green-200">
                <div className="text-3xl font-bold text-green-800">
                  {lastResult.correctAnswers}/{lastResult.totalRounds}
                </div>
                <div className="text-sm text-green-600 mt-1">
                  Правильных ответов
                </div>
              </div>
              <div className="bg-purple-50 p-5 rounded-xl border border-purple-200">
                <div className="text-3xl font-bold text-purple-800">
                  {lastResult.accuracy}%
                </div>
                <div className="text-sm text-purple-600 mt-1">Точность</div>
              </div>
            </div>
            <div
              className={`text-2xl font-bold mb-8 ${lastResult.rating.color}`}
            >
              {lastResult.rating.text}
            </div>
            <div className="max-w-lg mx-auto mb-8">
              <h4 className="font-semibold text-blue-700 mb-4">
                Детали раундов:
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {lastResult.details.map((r, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      r.isCorrect ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-mono text-gray-500">
                        #{i + 1}
                      </span>
                      <span className="text-sm font-medium">{r.question}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`text-sm ${r.isCorrect ? "text-green-600" : "text-red-600"}`}
                      >
                        {r.isCorrect ? "✓" : "✗"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatTime(r.reactionTime)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={startGame}
                className="px-8 py-4 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg cursor-pointer"
              >
                🔄 Пройти заново
              </button>
              <button
                onClick={goToMenu}
                className="px-8 py-4 bg-gray-500 text-white rounded-xl font-bold hover:bg-gray-600 transition-all shadow-lg cursor-pointer"
              >
                🏠 В меню
              </button>
              <button
                onClick={() => exportResults(lastResult)}
                className="px-8 py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg cursor-pointer"
              >
                💾 Сохранить результат
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <title>Тест скорости мышления - use-tools.ru</title>
      <meta
        name="description"
        content="Бесплатный онлайн тест для измерения скорости мышления и реакции."
      />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-8">
          {/* Основной блок */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-blue-100 min-h-[500px] flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100 text-center">
              🧠 Тест скорости мышления
            </h2>
            {renderContent()}
          </div>

          {/* История */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-blue-100">
              <h2 className="text-2xl font-bold text-blue-700">
                📊 История результатов
              </h2>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                {showHistory ? "Скрыть" : "Показать"}
              </button>
            </div>
            {showHistory &&
              (history.length === 0 ? (
                <p className="text-center text-blue-400 py-8">
                  Пока нет сохранённых результатов
                </p>
              ) : (
                <>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-semibold text-blue-800">
                              {item.playerName}
                            </span>
                            <span className="text-sm text-gray-500 ml-3">
                              {item.date} {item.time}
                            </span>
                          </div>
                          <span
                            className={`font-bold text-lg ${item.rating.color}`}
                          >
                            {formatTime(item.averageTime)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-green-600">
                            ✓ {item.correctAnswers}/{item.totalRounds}
                          </span>
                          <span className="text-purple-600">
                            {item.accuracy}%
                          </span>
                        </div>
                        <button
                          onClick={() => exportResults(item)}
                          className="mt-2 text-xs text-blue-500 hover:text-blue-700 underline cursor-pointer"
                        >
                          💾 Экспорт
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <button
                      onClick={clearHistory}
                      className="text-sm text-red-500 hover:text-red-700 underline cursor-pointer"
                    >
                      Очистить историю
                    </button>
                  </div>
                </>
              ))}
          </div>

          {/* Инфо */}
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-5 rounded-xl border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-3">
              ℹ️ О тесте скорости мышления
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-blue-700 mb-2">
                  Что измеряет тест?
                </h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Скорость реакции на визуальные стимулы</li>
                  <li>• Способность быстро принимать решения</li>
                  <li>• Точность когнитивной обработки</li>
                  <li>• Концентрацию внимания</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-blue-700 mb-2">
                  Типы заданий:
                </h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>🔢 Сравнение чисел</li>
                  <li>🎨 Цвет слова (тест Струпа)</li>
                  <li>🧮 Быстрая математика</li>
                  <li>🔲 Чёт/нечет</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeedThinking;
