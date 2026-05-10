import React, { useState, useEffect } from "react";
import Description_component from "../components/Description_component";

const TraderCalculator = () => {
  // Состояния для параметров трейдинга
  const [initialDeposit, setInitialDeposit] = useState(100000);
  const [tradesPerMonth, setTradesPerMonth] = useState(20);
  const [winRate, setWinRate] = useState(60);
  const [riskRewardRatio, setRiskRewardRatio] = useState(2);
  const [riskPerTrade, setRiskPerTrade] = useState(2);
  const [monthsToSimulate, setMonthsToSimulate] = useState(12);

  // Результаты
  const [finalBalance, setFinalBalance] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [profitPercentage, setProfitPercentage] = useState(0);
  const [averageMonthlyProfit, setAverageMonthlyProfit] = useState(0);
  const [monthlyPerformance, setMonthlyPerformance] = useState([]);

  // Форматирование чисел
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Обработчики изменений
  const handleInitialDepositChange = (e) => {
    const value = Math.min(
      100000000,
      Math.max(0, parseInt(e.target.value) || 0),
    );
    setInitialDeposit(value);
  };

  const handleTradesPerMonthChange = (e) => {
    const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
    setTradesPerMonth(value);
  };

  const handleWinRateChange = (e) => {
    const value = Math.min(100, Math.max(1, parseInt(e.target.value) || 50));
    setWinRate(value);
  };

  const handleRiskRewardRatioChange = (e) => {
    const value = Math.min(10, Math.max(1, parseFloat(e.target.value) || 2));
    setRiskRewardRatio(value);
  };

  const handleRiskPerTradeChange = (e) => {
    const value = Math.min(100, Math.max(0.1, parseFloat(e.target.value) || 2));
    setRiskPerTrade(value);
  };

  const handleMonthsChange = (e) => {
    const value = Math.min(60, Math.max(1, parseInt(e.target.value) || 12));
    setMonthsToSimulate(value);
  };

  const handleSliderDepositChange = (e) => {
    setInitialDeposit(parseInt(e.target.value));
  };

  const handleSliderTradesChange = (e) => {
    setTradesPerMonth(parseInt(e.target.value));
  };

  const handleSliderWinRateChange = (e) => {
    setWinRate(parseInt(e.target.value));
  };

  const handleSliderRatioChange = (e) => {
    setRiskRewardRatio(parseFloat(e.target.value));
  };

  const handleSliderRiskChange = (e) => {
    setRiskPerTrade(parseFloat(e.target.value));
  };

  const handleSliderMonthsChange = (e) => {
    setMonthsToSimulate(parseInt(e.target.value));
  };

  // Расчет математического ожидания
  const calculateExpectedValue = () => {
    const winProbability = winRate / 100;
    const lossProbability = 1 - winProbability;
    return (winProbability * riskRewardRatio - lossProbability * 1).toFixed(2);
  };

  // Симуляция торговли
  const simulateTrading = () => {
    let balance = initialDeposit;
    let maxBalance = initialDeposit;
    let totalTrades = 0;
    let profitableTrades = 0;
    let losingTrades = 0;
    const monthlyResults = [];
    const tradeHistory = [];

    for (let month = 1; month <= monthsToSimulate; month++) {
      let monthlyProfit = 0;
      let monthlyTrades = 0;
      let monthProfitable = 0;
      let monthLosing = 0;

      for (let trade = 1; trade <= tradesPerMonth; trade++) {
        totalTrades++;
        monthlyTrades++;

        // Определяем размер риска от текущего баланса
        const tradeRisk = balance * (riskPerTrade / 100);

        // Симулируем результат сделки на основе win rate
        const isProfitable = Math.random() * 100 < winRate;

        if (isProfitable) {
          // Прибыльная сделка
          const profit = tradeRisk * riskRewardRatio;
          balance += profit;
          monthlyProfit += profit;
          profitableTrades++;
          monthProfitable++;
          tradeHistory.push({
            month,
            trade: monthlyTrades,
            result: "profit",
            amount: profit,
            balance,
          });
        } else {
          // Убыточная сделка
          balance -= tradeRisk;
          monthlyProfit -= tradeRisk;
          losingTrades++;
          monthLosing++;
          tradeHistory.push({
            month,
            trade: monthlyTrades,
            result: "loss",
            amount: -tradeRisk,
            balance,
          });
        }

        // Обновляем максимальный баланс для расчета просадки
        if (balance > maxBalance) {
          maxBalance = balance;
        }
      }

      monthlyResults.push({
        month,
        startingBalance:
          month === 1
            ? initialDeposit
            : monthlyResults[month - 2].endingBalance,
        endingBalance: balance,
        monthlyProfit,
        trades: monthlyTrades,
        profitable: monthProfitable,
        losing: monthLosing,
        winRateMonth: ((monthProfitable / monthlyTrades) * 100).toFixed(1),
      });
    }

    // Рассчитываем максимальную просадку
    let drawdown = 0;
    let peak = initialDeposit;

    for (const result of monthlyResults) {
      if (result.endingBalance > peak) {
        peak = result.endingBalance;
      }
      const currentDrawdown = ((peak - result.endingBalance) / peak) * 100;
      if (currentDrawdown > drawdown) {
        drawdown = currentDrawdown;
      }
    }

    setFinalBalance(balance);
    setTotalProfit(balance - initialDeposit);
    setProfitPercentage(
      initialDeposit > 0
        ? ((balance - initialDeposit) / initialDeposit) * 100
        : 0,
    );
    setAverageMonthlyProfit((balance - initialDeposit) / monthsToSimulate);
    setMonthlyPerformance(monthlyResults);
  };

  // Расчет при изменении параметров
  useEffect(() => {
    simulateTrading();
  }, [
    initialDeposit,
    tradesPerMonth,
    winRate,
    riskRewardRatio,
    riskPerTrade,
    monthsToSimulate,
  ]);

  // Расчет необходимого win rate для безубыточности
  const calculateBreakEvenWinRate = () => {
    return (100 / (riskRewardRatio + 1)).toFixed(1);
  };

  // Расчет риска разорения (риск-менеджмент)
  const calculateRiskOfRuin = () => {
    const winProb = winRate / 100;
    const lossProb = 1 - winProb;
    const risk = riskPerTrade / 100;
    const n = Math.log(initialDeposit) / Math.log(1 - risk);
    return Math.pow(lossProb, n).toFixed(2);
  };

  return (
    <div className="min-h-screen">
      <title>Калькулятор трейдера - Полезные инструменты - use-tools.ru</title>
      <meta
        name="description"
        content="Калькулятор трейдера - инструмент поможет рассчитать раличные комбинации профита или стоп-лосса, процент побед и процент вложений, для эффективной торговли. "
      />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-8">
          {/* Верхняя часть: Параметры трейдинга */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100">
              Параметры трейдинга
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Начальный депозит */}
              <div>
                <label className="block text-blue-700 font-semibold mb-3">
                  Начальный депозит
                </label>
                <div className="relative mb-2">
                  <input
                    type="number"
                    min="0"
                    max="100000000"
                    step="10000"
                    value={initialDeposit}
                    onChange={handleInitialDepositChange}
                    className="w-full p-3 pl-10 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                  <div className="absolute left-3 top-3 text-blue-600">
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                </div>

                <div className="mt-2 text-sm text-blue-500">
                  <span className="font-medium">Текущая сумма:</span>{" "}
                  {formatCurrency(initialDeposit)}
                </div>
              </div>

              {/* Количество сделок в месяц */}
              <div>
                <label className="block text-blue-700 font-semibold mb-3">
                  Сделок в месяц
                </label>
                <div className="relative mb-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={tradesPerMonth}
                    onChange={handleTradesPerMonthChange}
                    className="w-full p-3 pl-10 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                  <div className="absolute left-3 top-3 text-blue-600">
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      ></path>
                    </svg>
                  </div>
                </div>

                <div className="mt-2 text-sm text-blue-500">
                  <span className="font-medium">Текущее значение:</span>{" "}
                  {tradesPerMonth}
                </div>
              </div>

              {/* Процент прибыльных сделок */}
              <div>
                <label className="block text-blue-700 font-semibold mb-3">
                  Прибыльных сделок (%)
                </label>
                <div className="relative mb-2">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    value={winRate}
                    onChange={handleWinRateChange}
                    className="w-full p-3 pl-10 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                  <div className="absolute left-3 top-3 text-blue-600">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                </div>

                <div className="mt-2 text-sm text-blue-500">
                  <span className="font-medium">Текущее значение:</span>{" "}
                  {winRate}%
                </div>
              </div>

              {/* Соотношение риск/прибыль */}
              <div>
                <label className="block text-blue-700 font-semibold mb-3">
                  Соотношение риск/прибыль
                </label>
                <div className="relative mb-2">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    value={riskRewardRatio}
                    onChange={handleRiskRewardRatioChange}
                    className="w-full p-3 pl-10 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                  <div className="absolute left-3 top-3 text-blue-600">
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      ></path>
                    </svg>
                  </div>
                </div>

                <div className="mt-2 text-sm text-blue-500">
                  <span className="font-medium">Текущее значение:</span> 1:
                  {riskRewardRatio}
                </div>
              </div>

              {/* Риск на сделку */}
              <div>
                <label className="block text-blue-700 font-semibold mb-3">
                  Риск на сделку (%)
                </label>
                <div className="relative mb-2">
                  <input
                    type="number"
                    min="0.1"
                    max="100"
                    step="0.1"
                    value={riskPerTrade}
                    onChange={handleRiskPerTradeChange}
                    className="w-full p-3 pl-10 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                  <div className="absolute left-3 top-3 text-blue-600">
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
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.768 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z"
                      ></path>
                    </svg>
                  </div>
                </div>

                <div className="mt-2 text-sm text-blue-500">
                  <span className="font-medium">Текущее значение:</span>{" "}
                  {riskPerTrade}%
                </div>
              </div>

              {/* Период симуляции */}
              <div>
                <label className="block text-blue-700 font-semibold mb-3">
                  Период (месяцев)
                </label>
                <div className="relative mb-2">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    step="1"
                    value={monthsToSimulate}
                    onChange={handleMonthsChange}
                    className="w-full p-3 pl-10 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                  <div className="absolute left-3 top-3 text-blue-600">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                </div>

                <div className="mt-2 text-sm text-blue-500">
                  <span className="font-medium">Текущее значение:</span>{" "}
                  {monthsToSimulate} месяцев
                </div>
              </div>
            </div>

            {/* Информационная панель с метриками */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-linear-to-r from-blue-100 to-cyan-100 p-4 rounded-xl border border-blue-200">
                <div className="text-sm text-blue-600 mb-1">
                  Математическое ожидание
                </div>
                <div
                  className={`text-lg font-bold ${
                    calculateExpectedValue() > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {calculateExpectedValue() > 0 ? "+" : ""}
                  {calculateExpectedValue()}%
                </div>
                <div className="text-xs text-blue-500 mt-1">
                  Средняя прибыль на сделку
                </div>
              </div>

              <div className="bg-linear-to-r from-blue-100 to-cyan-100 p-4 rounded-xl border border-blue-200">
                <div className="text-sm text-blue-600 mb-1">
                  Безубыточный win rate
                </div>
                <div className="text-lg font-bold text-blue-800">
                  {calculateBreakEvenWinRate()}%
                </div>
                <div className="text-xs text-blue-500 mt-1">
                  Минимальный процент прибыльных сделок
                </div>
              </div>
            </div>
          </div>

          {/* Нижняя часть: Результаты симуляции */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100">
              Результаты симуляции
            </h2>

            {/* Основные показатели */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200">
                <div className="text-sm text-blue-600 mb-2">
                  Итоговый баланс
                </div>
                <div className="text-2xl font-bold text-blue-800">
                  {formatCurrency(finalBalance)}
                </div>
                <div className="text-xs text-blue-500 mt-2">
                  Через {monthsToSimulate} месяцев
                </div>
              </div>

              <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200">
                <div className="text-sm text-blue-600 mb-2">Общая прибыль</div>
                <div
                  className={`text-2xl font-bold ${
                    totalProfit >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {totalProfit >= 0 ? "+" : ""}
                  {formatCurrency(totalProfit)}
                </div>
                <div className="text-xs text-blue-500 mt-2">
                  {profitPercentage.toFixed(1)}% от депозита
                </div>
              </div>

              <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200">
                <div className="text-sm text-blue-600 mb-2">
                  Среднемесячная прибыль
                </div>
                <div
                  className={`text-2xl font-bold ${
                    averageMonthlyProfit >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {averageMonthlyProfit >= 0 ? "+" : ""}
                  {formatCurrency(averageMonthlyProfit)}
                </div>
                <div className="text-xs text-blue-500 mt-2">
                  За {monthsToSimulate} месяцев
                </div>
              </div>
            </div>

            {/* График месячных результатов */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-4">
                Помесячные результаты
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="p-3 text-left text-blue-700 font-semibold border-b border-blue-200">
                        Месяц
                      </th>
                      <th className="p-3 text-left text-blue-700 font-semibold border-b border-blue-200">
                        Начальный баланс
                      </th>
                      <th className="p-3 text-left text-blue-700 font-semibold border-b border-blue-200">
                        Итоговый баланс
                      </th>
                      <th className="p-3 text-left text-blue-700 font-semibold border-b border-blue-200">
                        Прибыль за месяц
                      </th>
                      <th className="p-3 text-left text-blue-700 font-semibold border-b border-blue-200">
                        Сделок
                      </th>
                      <th className="p-3 text-left text-blue-700 font-semibold border-b border-blue-200">
                        Win Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyPerformance.map((month) => (
                      <tr
                        key={month.month}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="p-3 border-b border-blue-100 text-blue-800 font-medium">
                          {month.month}
                        </td>
                        <td className="p-3 border-b border-blue-100 text-blue-700">
                          {formatCurrency(month.startingBalance)}
                        </td>
                        <td className="p-3 border-b border-blue-100 text-blue-800 font-semibold">
                          {formatCurrency(month.endingBalance)}
                        </td>
                        <td
                          className={`p-3 border-b border-blue-100 font-semibold ${
                            month.monthlyProfit >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {month.monthlyProfit >= 0 ? "+" : ""}
                          {formatCurrency(month.monthlyProfit)}
                        </td>
                        <td className="p-3 border-b border-blue-100 text-blue-700">
                          {month.trades}
                        </td>
                        <td className="p-3 border-b border-blue-100 text-blue-700">
                          {month.winRateMonth}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <Description_component>
          <p className="font-bold mt-6 text-center">
            📊 Калькулятор Трейдера Онлайн | Рассчитать Сделку, Риск и Прибыль
            на Форекс и Бирже{" "}
          </p>
          <p className="mt-6">
            <strong>Онлайн калькулятор трейдера</strong> — это профессиональный
            инструмент для точного расчета параметров торговой сделки,
            управления рисками и планирования прибыли на финансовых рынках. Наш{" "}
            <strong>бесплатный калькулятор для трейдинга</strong> помогает
            принимать обоснованные решения и строго следовать торговой
            стратегии.
          </p>
          <p className="mt-6 font-bold">
            Основные возможности калькулятора трейдера:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Калькулятор позиции трейдера</strong> — точный расчет
                объема сделки (лота) на основе капитала и риска
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Калькулятор риска трейдера</strong> — определение
                максимального убытка в деньгах и процентах от депозита
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Калькулятор прибыли и убытка</strong> — вычисление
                потенциального профита и лосса для заданных уровней
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                Мгновенный пересчет параметров сделки при изменении условий
                рынка
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Калькулятор сделки на Форекс</strong> — расчет пунктов,
                стоимости пункта и свопов для валютных пар
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Калькулятор маржи и плеча</strong> — вычисление
                требуемого залога (маржи) для открытия позиции с кредитным
                плечом
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Калькулятор для трейдера на компьютере</strong> —
                работает в браузере, не требует установки
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Калькулятор соотношения риск/прибыль</strong> — оценка
                целесообразности сделки по параметру Reward/Risk (R/R)
              </span>
            </li>
          </ul>
          <p className="mt-6 font-bold">
            Почему выбирают наш калькулятор трейдера:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Быстрые и точные расчеты.</strong> Использование
                правильных биржевых формул для валют, акций, фьючерсов и
                криптовалют
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Профессиональный подход.</strong> Инструмент создан с
                учетом реальных потребностей действующих трейдеров
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Адаптивный интерфейс.</strong> Удобный ввод данных,
                мгновенные результаты и возможность сохранять расчеты
              </span>
            </li>
          </ul>
          <p className="mt-6 font-bold">
            Практическое применение калькулятора трейдера:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Форекс (Forex) торговля.</strong> Расчет сделок по
                EUR/USD, GBP/JPY и другим валютным парам
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Фондовый рынок.</strong> Планирование операций с акциями
                и ETF
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Криптовалютный трейдинг.</strong> Расчет позиций на
                биржах для Bitcoin (BTC), Ethereum (ETH) и альткоинов
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Торговля фьючерсами и опционами.</strong> Расчет маржи,
                точек безубытка и потенциальной доходности
              </span>
            </li>
          </ul>
          <p className="mt-4">
            Наш <strong>калькулятор для расчета сделок</strong> использует
            точные формулы для определения <strong>объема позиции</strong> на
            основе выбранного <strong>процента риска</strong> от депозита,{" "}
            <strong>сумму потенциальной прибыли</strong> и{" "}
            <strong>убытка</strong>. Инструмент помогает строго контролировать
            риск на сделку.
          </p>
          <p className="mt-6">
            <strong>Бесплатный онлайн калькулятор трейдера</strong> — это ваша
            цифровая панель управления рисками! Попробуйте наш{" "}
            <strong>профессиональный калькулятор для трейдинга</strong> прямо
            сейчас — это лучший способ дисциплинировать свою торговлю, защитить
            депозит от эмоциональных решений и повысить шансы на долгосрочную
            прибыль. <strong>Незаменимый инструмент</strong> для серьезного
            трейдера!
          </p>
          <p className="mt-6">
            Популярные запросы: калькулятор трейдера, калькулятор позиции,
            калькулятор риска, калькулятор лота, форекс калькулятор, калькулятор
            сделки, рассчитать объем позиции, калькулятор прибыли и убытка,
            калькулятор маржи, риск менеджмент в трейдинге
          </p>
        </Description_component>
      </div>
    </div>
  );
};

export default TraderCalculator;
