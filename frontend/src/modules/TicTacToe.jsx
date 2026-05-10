import React, { useState, useEffect, useCallback } from "react";
import Description_component from "../components/Description_component";

const TicTacToe = () => {
  // Режимы игры
  const [gameMode, setGameMode] = useState(null); // null - выбор режима, 'pvp' - два игрока, 'pve' - против компьютера
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [isDraw, setIsDraw] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [isComputerThinking, setIsComputerThinking] = useState(false);
  const [lastMove, setLastMove] = useState(null);

  // Звуковые эффекты (простые, без библиотек)
  const playSound = useCallback((type) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      switch (type) {
        case "move":
          oscillator.frequency.value = 600;
          gainNode.gain.value = 0.1;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
        case "win":
          oscillator.frequency.value = 800;
          gainNode.gain.value = 0.2;
          oscillator.start();
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          oscillator.stop(audioContext.currentTime + 0.5);
          break;
        case "draw":
          oscillator.frequency.value = 400;
          gainNode.gain.value = 0.1;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
        default:
          break;
      }
    } catch (e) {
      // Игнорируем ошибки аудио
    }
  }, []);

  // Проверка победителя
  const checkWinner = useCallback((boardState) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // горизонтали
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // вертикали
      [0, 4, 8], [2, 4, 6] // диагонали
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return { winner: boardState[a], line: lines[i] };
      }
    }
    return null;
  }, []);

  // Проверка ничьей
  const checkDraw = useCallback((boardState) => {
    return boardState.every(cell => cell !== null);
  }, []);

  // Ход компьютера (улучшенная стратегия)
  const computerMove = useCallback((boardState) => {
    // Минимакс алгоритм для более сильной игры
    const minimax = (board, isMaximizing) => {
      const result = checkWinner(board);
      if (result) {
        return result.winner === "O" ? 10 : -10;
      }
      if (checkDraw(board)) {
        return 0;
      }

      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
          if (!board[i]) {
            board[i] = "O";
            const score = minimax(board, false);
            board[i] = null;
            bestScore = Math.max(score, bestScore);
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
          if (!board[i]) {
            board[i] = "X";
            const score = minimax(board, true);
            board[i] = null;
            bestScore = Math.min(score, bestScore);
          }
        }
        return bestScore;
      }
    };

    // Сначала пробуем выиграть или заблокировать
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    // Проверяем возможность выигрыша
    for (const line of lines) {
      const [a, b, c] = line;
      if (boardState[a] === "O" && boardState[b] === "O" && !boardState[c]) return c;
      if (boardState[a] === "O" && !boardState[b] && boardState[c] === "O") return b;
      if (!boardState[a] && boardState[b] === "O" && boardState[c] === "O") return a;
    }

    // Блокируем игрока
    for (const line of lines) {
      const [a, b, c] = line;
      if (boardState[a] === "X" && boardState[b] === "X" && !boardState[c]) return c;
      if (boardState[a] === "X" && !boardState[b] && boardState[c] === "X") return b;
      if (!boardState[a] && boardState[b] === "X" && boardState[c] === "X") return a;
    }

    // Центр
    if (!boardState[4]) return 4;

    // Углы
    const corners = [0, 2, 6, 8];
    const emptyCorners = corners.filter(i => !boardState[i]);
    if (emptyCorners.length > 0) {
      return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
    }

    // Используем минимакс для оставшихся ходов
    let bestScore = -Infinity;
    let bestMove = null;
    const boardCopy = [...boardState];

    for (let i = 0; i < 9; i++) {
      if (!boardCopy[i]) {
        boardCopy[i] = "O";
        const score = minimax(boardCopy, false);
        boardCopy[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove !== null ? bestMove : emptyCorners[0] || boardState.findIndex(cell => !cell);
  }, [checkWinner, checkDraw]);

  // Обработка клика по клетке
  const handleCellClick = (index) => {
    if (!gameStarted || board[index] || winner || isDraw || isComputerThinking) return;
    if (gameMode === "pve" && currentPlayer === "O") return;

    makeMove(index);
  };

  // Совершение хода
  const makeMove = (index) => {
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setLastMove(index);
    setMoveHistory([...moveHistory, { player: currentPlayer, position: index }]);

    playSound("move");

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      setScores(prev => ({
        ...prev,
        [result.winner]: prev[result.winner] + 1
      }));
      playSound("win");
      setGameStarted(false);
      return;
    }

    if (checkDraw(newBoard)) {
      setIsDraw(true);
      setScores(prev => ({
        ...prev,
        draws: prev.draws + 1
      }));
      playSound("draw");
      setGameStarted(false);
      return;
    }

    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  // Ход компьютера
  useEffect(() => {
    if (gameMode === "pve" && currentPlayer === "O" && gameStarted && !winner && !isDraw) {
      setIsComputerThinking(true);
      const timer = setTimeout(() => {
        const moveIndex = computerMove(board);
        if (moveIndex !== null) {
          makeMove(moveIndex);
        }
        setIsComputerThinking(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameMode, gameStarted, winner, isDraw, board, computerMove]);

  // Запуск игры
  const startGame = (mode) => {
    setGameMode(mode);
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setWinningLine([]);
    setIsDraw(false);
    setGameStarted(true);
    setMoveHistory([]);
    setLastMove(null);
    setIsComputerThinking(false);
  };

  // Новая игра (тот же режим)
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setWinningLine([]);
    setIsDraw(false);
    setGameStarted(true);
    setMoveHistory([]);
    setLastMove(null);
    setIsComputerThinking(false);
  };

  // Отмена хода
  const undoMove = () => {
    if (moveHistory.length === 0 || winner || isDraw) return;
    if (gameMode === "pve" && moveHistory.length >= 2) {
      // В режиме с компьютером отменяем два хода
      const newHistory = moveHistory.slice(0, -2);
      const newBoard = Array(9).fill(null);
      newHistory.forEach(move => {
        newBoard[move.position] = move.player;
      });
      setBoard(newBoard);
      setMoveHistory(newHistory);
      setCurrentPlayer("X");
      setLastMove(newHistory.length > 0 ? newHistory[newHistory.length - 1].position : null);
    } else if (gameMode === "pvp") {
      const newHistory = moveHistory.slice(0, -1);
      const newBoard = Array(9).fill(null);
      newHistory.forEach(move => {
        newBoard[move.position] = move.player;
      });
      setBoard(newBoard);
      setMoveHistory(newHistory);
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      setLastMove(newHistory.length > 0 ? newHistory[newHistory.length - 1].position : null);
    }
  };

  // Сброс счета
  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
  };

  // Получение класса для клетки
  const getCellClass = (index) => {
    let baseClass = "w-full h-24 md:h-28 flex items-center justify-center text-5xl md:text-6xl font-bold rounded-xl transition-all duration-200 cursor-pointer ";
    
    if (winningLine.includes(index)) {
      baseClass += "bg-green-100 border-2 border-green-400 scale-105 shadow-lg ";
    } else if (lastMove === index && !winner) {
      baseClass += "bg-blue-100 border-2 border-blue-300 ";
    } else if (board[index]) {
      baseClass += "bg-blue-50 border-2 border-blue-200 ";
    } else if (isComputerThinking || (gameMode === "pve" && currentPlayer === "O")) {
      baseClass += "bg-white border-2 border-gray-200 cursor-not-allowed ";
    } else {
      baseClass += "bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md ";
    }

    // Цвет текста в зависимости от игрока
    if (board[index] === "X") {
      baseClass += "text-blue-600 ";
    } else if (board[index] === "O") {
      baseClass += "text-red-500 ";
    }

    return baseClass;
  };

  // Режим выбора игры
  if (!gameMode) {
    return (
      <div className="min-h-screen">
        <title>Крестики-нолики - Полезные инструменты - use-tools.ru</title>
        <meta
          name="description"
          content="Игра крестики-нолики онлайн: против компьютера или с другом"
        />
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-blue-100">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100 text-center">
              Крестики-нолики
            </h2>
            
            <div className="text-center mb-8">
              <div className="text-7xl mb-6">🎮</div>
              <p className="text-blue-600 text-lg mb-8">
                Выберите режим игры
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <button
                  onClick={() => startGame("pve")}
                  className="group p-8 rounded-2xl border-2 border-blue-200 bg-linear-to-br from-blue-50 to-cyan-50 hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="text-5xl mb-4">🤖</div>
                  <div className="font-bold text-xl text-blue-800 mb-2">
                    Игра с компьютером
                  </div>
                  <div className="text-blue-600 text-sm">
                    Сразитесь с искусственным интеллектом
                  </div>
                </button>

                <button
                  onClick={() => startGame("pvp")}
                  className="group p-8 rounded-2xl border-2 border-blue-200 bg-linear-to-br from-blue-50 to-cyan-50 hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="text-5xl mb-4">👥</div>
                  <div className="font-bold text-xl text-blue-800 mb-2">
                    Два игрока
                  </div>
                  <div className="text-blue-600 text-sm">
                    Играйте с другом на одном устройстве
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <title>Крестики-нолики - Полезные инструменты - use-tools.ru</title>
      <meta
        name="description"
        content="Игра крестики-нолики онлайн: против компьютера или с другом"
      />
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 gap-6">
          {/* Игровое поле */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-blue-100">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100 text-center">
              {gameMode === "pve" ? "🤖 Игра с компьютером" : "👥 Два игрока"}
            </h2>

            {/* Статус игры */}
            <div className="text-center mb-6">
              {winner ? (
                <div className="text-2xl font-bold text-green-600 animate-bounce">
                  🎉 Победил игрок {winner}!
                </div>
              ) : isDraw ? (
                <div className="text-2xl font-bold text-yellow-600">
                  🤝 Ничья!
                </div>
              ) : isComputerThinking ? (
                <div className="text-xl text-blue-600">
                  Компьютер думает...
                  <span className="inline-block ml-2 animate-spin">⚙️</span>
                </div>
              ) : (
                <div className="text-xl">
                  Ход игрока:{" "}
                  <span className={`font-bold ${currentPlayer === "X" ? "text-blue-600" : "text-red-500"}`}>
                    {currentPlayer}
                  </span>
                  {gameMode === "pve" && currentPlayer === "O" && (
                    <span className="text-sm text-gray-500 ml-2">(компьютер)</span>
                  )}
                </div>
              )}
            </div>

            {/* Игровое поле */}
            <div className="max-w-md mx-auto mb-6">
              <div className="grid grid-cols-3 gap-3">
                {board.map((cell, index) => (
                  <button
                    key={index}
                    onClick={() => handleCellClick(index)}
                    disabled={!!cell || !!winner || isDraw || isComputerThinking || (gameMode === "pve" && currentPlayer === "O")}
                    className={getCellClass(index)}
                  >
                    {cell}
                  </button>
                ))}
              </div>
            </div>

            {/* Кнопки управления */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                🔄 Новая игра
              </button>
              
              <button
                onClick={undoMove}
                disabled={moveHistory.length === 0 || !!winner || isDraw || isComputerThinking}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                ↩️ Отменить ход
              </button>

              <button
                onClick={() => setGameMode(null)}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                🏠 Выбор режима
              </button>
            </div>
          </div>

          {/* Статистика */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <h3 className="text-xl font-bold text-blue-700 mb-4">📊 Статистика игр</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-200">
                <div className="text-sm text-blue-600 mb-2">
                  {gameMode === "pve" ? "Человек" : "Игрок X"}
                </div>
                <div className="text-3xl font-bold text-blue-700">
                  {scores.X}
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-xl text-center border border-yellow-200">
                <div className="text-sm text-yellow-600 mb-2">Ничьи</div>
                <div className="text-3xl font-bold text-yellow-700">
                  {scores.draws}
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-xl text-center border border-red-200">
                <div className="text-sm text-red-600 mb-2">
                  {gameMode === "pve" ? "Компьютер" : "Игрок O"}
                </div>
                <div className="text-3xl font-bold text-red-700">
                  {scores.O}
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              <button
                onClick={resetScores}
                className="text-sm text-blue-600 hover:text-blue-800 underline cursor-pointer"
              >
                Сбросить статистику
              </button>
            </div>
          </div>
        </div>

        <Description_component>
          <p className="font-bold mt-6 text-center">
            🎮 Крестики-Нолики Онлайн | Играть Бесплатно с Компьютером или Другом
          </p>
          <p className="mt-6">
            <strong>Крестики-нолики онлайн</strong> — классическая логическая игра,
            реализованная в современном веб-интерфейсе. Играйте{" "}
            <strong>бесплатно и без регистрации</strong> прямо в браузере.
            Доступны два режима: игра против компьютера с интеллектуальным алгоритмом
            и игра для двоих на одном устройстве.
          </p>
          <p className="mt-6 font-bold">
            Особенности нашей игры крестики-нолики:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Игра с компьютером</strong> — улучшенный ИИ с алгоритмом минимакс
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Игра для двоих</strong> — по очереди ставьте крестики и нолики
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Отмена хода</strong> — возможность вернуться на шаг назад
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Статистика игр</strong> — подсчет побед, поражений и ничьих
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Подсветка победной линии</strong> — наглядное отображение результата
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Адаптивный дизайн</strong> — играйте на компьютере, планшете или телефоне
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Звуковое сопровождение</strong> — звуковые эффекты при ходах и победе
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Без рекламы</strong> — ничто не отвлекает от игры
              </span>
            </li>
          </ul>
          <p className="mt-6 font-bold">
            Преимущества игры в крестики-нолики:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Развитие логики</strong> — стратегическое мышление и планирование ходов
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Подходит для всех возрастов</strong> — простая и понятная механика
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Быстрые партии</strong> — игра занимает всего несколько минут
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Тренировка внимания</strong> — отслеживание угроз и возможностей
              </span>
            </li>
          </ul>
        </Description_component>
      </div>
    </div>
  );
};

export default TicTacToe;