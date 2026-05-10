import React, { useState, useEffect } from "react";
import Description_component from "../components/Description_component";

const InvestmentCalculator = () => {
  // Состояния для параметров инвестирования
  const [initialCapital, setInitialCapital] = useState(100000);
  const [investmentTerm, setInvestmentTerm] = useState(5);
  const [termType, setTermType] = useState("years"); // months или years
  const [interestRate, setInterestRate] = useState(10);
  const [reinvestmentPeriod, setReinvestmentPeriod] = useState("monthly"); // monthly или yearly
  const [additionalContributions, setAdditionalContributions] = useState(10000);
  const [contributionFrequency, setContributionFrequency] = useState("monthly"); // monthly или yearly
  const [finalAmount, setFinalAmount] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [growthChart, setGrowthChart] = useState([]);

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
  const handleInitialCapitalChange = (e) => {
    const value = Math.min(1000000000, Math.max(0, parseInt(e.target.value)));
    if (isNaN(value)) {
      setInitialCapital("");
    } else {
      setInitialCapital(value);
    }
  };

  const handleInvestmentTermChange = (e) => {
    const maxTerm = termType === "months" ? 360 : 30;
    const value = Math.min(maxTerm, Math.max(0, parseInt(e.target.value)));
    if (isNaN(value)) {
      setInvestmentTerm("");
    } else {
      setInvestmentTerm(value);
    }
  };

  const handleInterestRateChange = (e) => {
    const value = Math.min(100, Math.max(0, parseFloat(e.target.value)));
    if (isNaN(value)) {
      setInterestRate("");
    } else {
      setInterestRate(value);
    }
  };

  const handleAdditionalContributionsChange = (e) => {
    const value = Math.min(10000000, Math.max(0, parseInt(e.target.value)));
    if (isNaN(value)) {
      setAdditionalContributions("");
    } else {
      setAdditionalContributions(value);
    }
  };

  // Расчет сложного процента с регулярными пополнениями
  const calculateCompoundInterest = () => {
    const months = termType === "months" ? investmentTerm : investmentTerm * 12;
    const monthlyRate = interestRate / 100 / 12;
    const compoundPeriods = reinvestmentPeriod === "monthly" ? 12 : 1;

    let currentAmount = initialCapital;
    const chart = [];
    let totalContributed = initialCapital;

    // Рассчитываем для каждого месяца
    for (let month = 1; month <= months; month++) {
      // Добавляем дополнительные взносы
      if (contributionFrequency === "monthly" && month > 1) {
        currentAmount += additionalContributions;
        totalContributed += additionalContributions;
      } else if (
        contributionFrequency === "yearly" &&
        month % 12 === 1 &&
        month > 1
      ) {
        currentAmount += additionalContributions;
        totalContributed += additionalContributions;
      }

      // Начисляем проценты в зависимости от периода реинвестирования
      if (reinvestmentPeriod === "monthly") {
        currentAmount *= 1 + monthlyRate;
      } else if (month % 12 === 0) {
        // Ежегодное реинвестирование
        currentAmount *= 1 + interestRate / 100;
      }

      // Сохраняем данные для графика (каждый год или каждый месяц для коротких сроков)
      if (months <= 12 || month % 12 === 0 || month === months) {
        chart.push({
          period:
            termType === "months"
              ? `Месяц ${month}`
              : `Год ${Math.ceil(month / 12)}`,
          month: month,
          amount: currentAmount,
          invested: totalContributed,
          profit: currentAmount - totalContributed,
        });
      }
    }

    setFinalAmount(currentAmount);
    setTotalInvested(totalContributed);
    setTotalProfit(currentAmount - totalContributed);
    setGrowthChart(chart);
  };

  // Расчет результатов
  useEffect(() => {
    calculateCompoundInterest();
  }, [
    initialCapital,
    investmentTerm,
    termType,
    interestRate,
    reinvestmentPeriod,
    additionalContributions,
    contributionFrequency,
  ]);

  // Расчет годового дохода в процентах
  const calculateAnnualReturn = () => {
    if (totalInvested === 0) return 0;
    const totalMonths =
      termType === "months" ? investmentTerm : investmentTerm * 12;
    const totalYears = totalMonths / 12;
    const totalReturn = (finalAmount / totalInvested - 1) * 100;
    return (Math.pow(1 + totalReturn / 100, 1 / totalYears) - 1) * 100;
  };

  return (
    <div className="min-h-screen">
      <title>Калькулятор инвестора - Полезные инструменты - use-tools.ru</title>
      <meta
        name="description"
        content="Калькулятор для инвестора, поможет рассчитать выгодны ли накопления"
      />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-8">
          {/* Верхняя часть: Параметры инвестирования */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100">
              Параметры инвестирования
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Стартовый капитал */}
              <div>
                <label className="block text-blue-700 font-semibold mb-3">
                  Стартовый капитал
                </label>
                <div className="relative mb-2">
                  <input
                    type="number"
                    min="0"
                    max="1000000000"
                    step="1000"
                    value={initialCapital}
                    onChange={handleInitialCapitalChange}
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
                        d="M9 8h6m-6 4h6m-3-4v8m4-8h2a1 1 0 011 1v2a1 1 0 01-1 1h-2m-4-8H8a1 1 0 00-1 1v2a1 1 0 001 1h2M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                </div>

                <div className="mt-2 text-sm text-blue-500">
                  <span className="font-medium">Текущая сумма:</span>{" "}
                  {formatCurrency(initialCapital)}
                </div>
              </div>

              {/* Срок инвестирования */}
              <div>
                <label className="block text-blue-700 font-semibold mb-3">
                  Срок инвестирования
                </label>
                <div className="relative mb-2">
                  <input
                    type="number"
                    min="1"
                    max={termType === "months" ? 360 : 30}
                    value={investmentTerm}
                    onChange={handleInvestmentTermChange}
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

                <div className="mt-2 flex space-x-4">
                  <button
                    onClick={() => setTermType("months")}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      termType === "months"
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    Месяцев
                  </button>
                  <button
                    onClick={() => setTermType("years")}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      termType === "years"
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    Лет
                  </button>
                </div>
              </div>

              {/* Ставка доходности */}
              <div>
                <label className="block text-blue-700 font-semibold mb-3">
                  Ставка доходности <span className="text-xs">(% годовых)</span>
                </label>
                <div className="relative mb-2">
                  <input
                    type="number"
                    min="0.1"
                    max="100"
                    step="0.1"
                    value={interestRate}
                    onChange={handleInterestRateChange}
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
                        d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                      ></path>
                    </svg>
                  </div>
                </div>

                <div className="mt-2 text-sm text-blue-500">
                  <span className="font-medium">Текущая ставка:</span>{" "}
                  {interestRate}%
                </div>
              </div>

              {/* Период реинвестирования */}
              <div>
                <label className="block text-blue-700 font-semibold mb-3">
                  Период реинвестирования
                </label>
                <div className="space-y-3">
                  <button
                    onClick={() => setReinvestmentPeriod("monthly")}
                    className={`w-full p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      reinvestmentPeriod === "monthly"
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-blue-200 bg-white hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <div className="font-semibold text-blue-800">
                          Ежемесячно
                        </div>
                        <div className="text-sm text-blue-600 mt-1">
                          Более быстрый рост капитала
                        </div>
                      </div>
                      <div
                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          reinvestmentPeriod === "monthly"
                            ? "border-blue-500 bg-blue-500"
                            : "border-blue-300"
                        }`}
                      >
                        {reinvestmentPeriod === "monthly" && (
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setReinvestmentPeriod("yearly")}
                    className={`w-full p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      reinvestmentPeriod === "yearly"
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-blue-200 bg-white hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <div className="font-semibold text-blue-800">
                          Ежегодно
                        </div>
                        <div className="text-sm text-blue-600 mt-1">
                          Стандартный подход
                        </div>
                      </div>
                      <div
                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          reinvestmentPeriod === "yearly"
                            ? "border-blue-500 bg-blue-500"
                            : "border-blue-300"
                        }`}
                      >
                        {reinvestmentPeriod === "yearly" && (
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Дополнительные вложения */}
              <div>
                <label className="block text-blue-700 font-semibold mb-3">
                  Дополнительные вложения
                </label>
                <div className="relative mb-2">
                  <input
                    type="number"
                    min="0"
                    max="10000000"
                    step="1000"
                    value={additionalContributions}
                    onChange={handleAdditionalContributionsChange}
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
                        d="M12 4v16m8-8H4"
                      ></path>
                    </svg>
                  </div>
                </div>

                <div className="mt-2 flex space-x-4">
                  <button
                    onClick={() => setContributionFrequency("monthly")}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      contributionFrequency === "monthly"
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    Раз в месяц
                  </button>
                  <button
                    onClick={() => setContributionFrequency("yearly")}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      contributionFrequency === "yearly"
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    Раз в год
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Нижняя часть: Результаты расчета */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100">
              Результаты инвестирования
            </h2>
            {initialCapital && investmentTerm && interestRate ? (
              <>
                {/* Основные показатели */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200">
                    <div className="text-sm text-blue-600 mb-2">
                      Итоговая сумма
                    </div>
                    <div className="text-2xl font-bold text-blue-800">
                      {formatCurrency(finalAmount)}
                    </div>
                    <div className="text-xs text-blue-500 mt-2">
                      Через {investmentTerm}{" "}
                      {termType === "months" ? "месяцев" : "лет"}
                    </div>
                  </div>

                  <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200">
                    <div className="text-sm text-blue-600 mb-2">
                      Всего вложено
                    </div>
                    <div className="text-2xl font-bold text-blue-800">
                      {formatCurrency(totalInvested)}
                    </div>
                    <div className="text-xs text-blue-500 mt-2">
                      Ваши инвестиции
                    </div>
                  </div>

                  <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200">
                    <div className="text-sm text-blue-600 mb-2">
                      Чистая прибыль
                    </div>
                    <div className="text-2xl font-bold text-blue-800">
                      {formatCurrency(totalProfit)}
                    </div>
                    <div className="text-xs text-blue-500 mt-2">
                      {totalInvested > 0
                        ? ((totalProfit / totalInvested) * 100).toFixed(1)
                        : 0}
                      % от вложений
                    </div>
                  </div>

                  <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200">
                    <div className="text-sm text-blue-600 mb-2">
                      Годовая доходность
                    </div>
                    <div className="text-2xl font-bold text-blue-800">
                      {calculateAnnualReturn().toFixed(2)}%
                    </div>
                    <div className="text-xs text-blue-500 mt-2">
                      В среднем за год
                    </div>
                  </div>
                </div>

                {/* График роста капитала */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-blue-700 mb-4">
                    Рост капитала во времени
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-blue-50">
                          <th className="p-3 text-left text-blue-700 font-semibold border-b border-blue-200">
                            Период
                          </th>
                          <th className="p-3 text-left text-blue-700 font-semibold border-b border-blue-200">
                            Сумма на счете
                          </th>
                          <th className="p-3 text-left text-blue-700 font-semibold border-b border-blue-200">
                            Всего вложено
                          </th>
                          <th className="p-3 text-left text-blue-700 font-semibold border-b border-blue-200">
                            Прибыль
                          </th>
                          <th className="p-3 text-left text-blue-700 font-semibold border-b border-blue-200">
                            Доходность
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {growthChart.map((item, index) => (
                          <tr
                            key={index}
                            className="hover:bg-blue-50 transition-colors"
                          >
                            <td className="p-3 border-b border-blue-100 text-blue-800 font-medium">
                              {item.period}
                            </td>
                            <td className="p-3 border-b border-blue-100 text-blue-800 font-semibold">
                              {formatCurrency(item.amount)}
                            </td>
                            <td className="p-3 border-b border-blue-100 text-blue-700">
                              {formatCurrency(item.invested)}
                            </td>
                            <td className="p-3 border-b border-blue-100 text-blue-700">
                              {formatCurrency(item.profit)}
                            </td>
                            <td className="p-3 border-b border-blue-100 text-blue-700">
                              {item.invested > 0
                                ? ((item.profit / item.invested) * 100).toFixed(
                                    1,
                                  ) + "%"
                                : "0%"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Визуализация распределения */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-linear-to-r from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200">
                    <h4 className="font-bold text-blue-800 mb-4">
                      📊 Структура итоговой суммы
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-blue-700">
                            Ваши вложения
                          </span>
                          <span className="text-sm font-medium text-blue-800">
                            {formatCurrency(totalInvested)} (
                            {((totalInvested / finalAmount) * 100).toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${(totalInvested / finalAmount) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-blue-700">
                            Накопленная прибыль
                          </span>
                          <span className="text-sm font-medium text-blue-800">
                            {formatCurrency(totalProfit)} (
                            {((totalProfit / finalAmount) * 100).toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${(totalProfit / finalAmount) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-linear-to-r from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200">
                    <h4 className="font-bold text-blue-800 mb-3">
                      📈 Эффект сложного процента
                    </h4>
                    <div className="text-sm text-blue-700 space-y-2">
                      <p>
                        Сложный процент — это когда проценты начисляются на
                        проценты.
                      </p>
                      <p>
                        При ежемесячном реинвестировании ваш капитал растет
                        быстрее:
                      </p>
                      <ul className="space-y-1">
                        <li>
                          • {interestRate}% годовых ={" "}
                          {(
                            Math.pow(1 + interestRate / 100 / 12, 12) - 1
                          ).toFixed(2) * 100}
                          % эффективно
                        </li>
                        <li>
                          • За {investmentTerm}{" "}
                          {termType === "months" ? "месяцев" : "лет"} ваш
                          капитал увеличится в{" "}
                          {(finalAmount / initialCapital).toFixed(1)} раза
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
        <Description_component>
          <p className="font-bold mt-6 text-center">
            📈 Калькулятор Инвестора Онлайн | Рассчитать Доходность Инвестиций и
            Сложный Процент
          </p>
          <p className="mt-6">
            <strong>Онлайн калькулятор инвестора</strong> — это мощный
            аналитический инструмент для расчета потенциальной доходности
            инвестиций, планирования финансовых целей и понимания работы
            сложного процента. Наш
            <strong>бесплатный инвестиционный калькулятор</strong> поможет вам
            принимать взвешенные финансовые решения и строить долгосрочные
            стратегии.
          </p>
          <p className="mt-6 font-bold">
            Основные возможности калькулятора инвестора:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Калькулятор сложного процента</strong> — расчет дохода
                на реинвестированную прибыль (капитализацию)
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Калькулятор доходности инвестиций</strong> — вычисление
                общей прибыли и годовой процентной доходности
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Калькулятор инвестора для акций</strong> — моделирование
                дохода с учетом дивидендов и роста курсовой стоимости
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                Мгновенный расчет инвестиционных сценариев без перезагрузки
                страницы
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Калькулятор инвестиционного портфеля</strong> — оценка
                совокупной доходности нескольких активов
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Калькулятор регулярных инвестиций</strong> — расчет
                накоплений при ежемесячных или ежеквартальных пополнениях
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Калькулятор для компьютера инвестора</strong> — работает
                в браузере без установки программ
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Калькулятор финансовой цели</strong> — определение суммы
                и срока регулярных вложений для достижения цели
              </span>
            </li>
          </ul>
          <p className="mt-6 font-bold">
            Почему выбирают наш калькулятор инвестора:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Профессиональные формулы.</strong> Использование точных
                математических моделей для расчета сложного процента и
                доходности
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Наглядная визуализация.</strong> Графики роста капитала,
                распределения дохода и влияния разных параметров
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Гибкие настройки.</strong> Учет инфляции, комиссий,
                налогов и различных периодичностей пополнения
              </span>
            </li>
          </ul>
          <p className="mt-6 font-bold">
            Практическое применение калькулятора инвестора:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Банковские вклады.</strong> Расчет конечной суммы по
                депозиту с капитализацией процентов
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Кальякулятор вкладов.</strong> Расчет суммы по вкладу с
                капитализацией процентов и без
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Фондовый рынок.</strong> Планирование инвестиций в
                акции, облигации и ETF с учетом дивидендов
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Накопительные цели.</strong> Расчет инвестиций для
                будущей покупки недвижимости, образования или пенсии
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Сравнение стратегий.</strong> Анализ эффективности
                единоразовых вложений против регулярных инвестиций
              </span>
            </li>
          </ul>
          <p className="mt-4">
            Наш <strong>калькулятор расчета инвестиций</strong> использует
            проверенные финансовые формулы для моделирования{" "}
            <strong>роста капитала</strong>,{" "}
            <strong>эффекта сложного процента</strong> и{" "}
            <strong>реальной доходности</strong> с поправкой на инфляцию. Вы
            можете настроить <strong>начальный капитал</strong>,{" "}
            <strong>срок инвестирования</strong>,{" "}
            <strong>ожидаемую годовую доходность</strong>,{" "}
            <strong>сумму регулярных пополнений</strong> и дополнительные
            параметры. Калькулятор автоматически покажет{" "}
            <strong>график роста инвестиций</strong> и{" "}
            <strong>детализацию дохода</strong> по годам.
          </p>
          <p className="mt-6">
            <strong>Бесплатный онлайн калькулятор инвестора</strong> — это ваш
            персональный финансовый аналитик! Попробуйте наш{" "}
            <strong>инструмент для расчета инвестиций</strong> прямо сейчас —
            это лучший способ визуализировать силу сложного процента,
            спланировать свое финансовое будущее и двигаться к цели с четкими
            цифрами. <strong>Умный калькулятор</strong> для разумных
            инвестиционных решений!
          </p>
          <p className="mt-6">
            Популярные запросы: калькулятор инвестора, сложный процент
            калькулятор, калькулятор инвестиций, доходность инвестиций,
            калькулятор сложных процентов, инвестиционный калькулятор,
            рассчитать инвестиции, калькулятор капитализации, калькулятор
            регулярных инвестиций, финансовая цель
          </p>
        </Description_component>
      </div>
    </div>
  );
};

export default InvestmentCalculator;
