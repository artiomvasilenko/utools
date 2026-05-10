import React, { useState, useEffect, useCallback } from "react";
import Description_component from "../components/Description_component";

const RealInterestRate = () => {
  // Состояния для параметров
  const [loanAmount, setLoanAmount] = useState(500000);
  const [loanTerm, setLoanTerm] = useState(12);
  const [termType, setTermType] = useState("months"); // months или years
  const [monthlyPayment, setMonthlyPayment] = useState(46000);
  const [realRate, setRealRate] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [overpayment, setOverpayment] = useState(0);
  const [calculationDone, setCalculationDone] = useState(false);

  // Форматирование чисел
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Метод Ньютона для поиска месячной процентной ставки, дающей заданный аннуитетный платёж
  const findMonthlyRate = useCallback((amount, months, payment) => {
    if (amount <= 0 || months <= 0 || payment <= 0) return 0;
    // Минимальный платёж — просто тело долга / месяцы, ставка 0%
    if (payment <= amount / months) return 0;

    // Начальное приближение
    let rate = 0.01; // 1% в месяц
    const tolerance = 1e-7;
    const maxIter = 100;

    for (let i = 0; i < maxIter; i++) {
      const onePlusR = 1 + rate;
      const pow = Math.pow(onePlusR, months);
      // annuityCoefficient = (r * (1+r)^months) / ((1+r)^months - 1)
      const coeff = (rate * pow) / (pow - 1);
      const f = amount * coeff - payment;

      if (Math.abs(f) < tolerance) break;

      // Производная annuityCoefficient по ставке
      const dpow = months * Math.pow(onePlusR, months - 1);
      const dcoeff =
        (pow * (pow - 1) + rate * dpow * (pow - 1) - rate * pow * dpow) /
        Math.pow(pow - 1, 2);
      const df = amount * dcoeff;

      if (Math.abs(df) < 1e-12) break;
      rate = rate - f / df;
      if (rate < 0) rate = 0.0001;
      if (rate > 2) rate = 2; // ограничение 200% в месяц
    }

    return rate;
  }, []);

  // Обработчики изменений с защитой от NaN
  const handleLoanAmountChange = (e) => {
    const value = Math.min(1000000000, Math.max(0, parseInt(e.target.value)));
    if (isNaN(value)) {
      setLoanAmount("");
    } else {
      setLoanAmount(value);
    }
  };

  const handleLoanTermChange = (e) => {
    const maxTerm = termType === "months" ? 360 : 30;
    const value = Math.min(maxTerm, Math.max(1, parseInt(e.target.value)));
    if (isNaN(value)) {
      setLoanTerm(1);
    } else {
      setLoanTerm(value);
    }
  };

  const handleMonthlyPaymentChange = (e) => {
    const value = Math.min(1000000000, Math.max(0, parseInt(e.target.value)));
    if (isNaN(value)) {
      setMonthlyPayment("");
    } else {
      setMonthlyPayment(value);
    }
  };

  // Основной расчёт
  useEffect(() => {
    if (
      !loanAmount ||
      !loanTerm ||
      !monthlyPayment ||
      loanAmount <= 0 ||
      loanTerm <= 0 ||
      monthlyPayment <= 0
    ) {
      setRealRate(0);
      setTotalPayment(0);
      setOverpayment(0);
      setCalculationDone(false);
      return;
    }

    const months = termType === "months" ? loanTerm : loanTerm * 12;
    const total = monthlyPayment * months;
    setTotalPayment(Math.round(total));
    setOverpayment(Math.round(total - loanAmount));

    const monthlyRate = findMonthlyRate(loanAmount, months, monthlyPayment);
    const annualRate = monthlyRate * 12 * 100; // переводим в годовые проценты
    setRealRate(annualRate);
    setCalculationDone(true);
  }, [loanAmount, loanTerm, termType, monthlyPayment, findMonthlyRate]);

  // Форматирование процентной ставки
  const formatRate = (rate) => {
    if (rate < 0.01) return "менее 0.01%";
    if (rate > 100000) return "очень высокая";
    return `${rate.toFixed(3)}%`;
  };

  // Определение уровня ставки для оформления
  const getRateLevel = (rate) => {
    if (rate <= 10) return "low";
    if (rate <= 25) return "medium";
    return "high";
  };

  const rateLevel = getRateLevel(realRate);

  const getRateColor = (level) => {
    switch (level) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "high":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  const getRateBg = (level) => {
    switch (level) {
      case "low":
        return "bg-green-50 border-green-200";
      case "medium":
        return "bg-yellow-50 border-yellow-200";
      case "high":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="min-h-screen">
      <title>
        Расчёт реальной процентной ставки - Полезные инструменты - use-tools.ru
      </title>
      <meta
        name="description"
        content="Узнайте реальную процентную ставку по кредиту, зная сумму, срок и ежемесячный платёж"
      />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-8">
          {/* Верхняя часть: Параметры расчёта */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100">
              Параметры для расчёта реальной ставки
            </h2>
            <p className="text-sm text-blue-600 mb-6 -mt-3">
              Укажите известные параметры кредита, и мы рассчитаем реальную
              процентную ставку
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Сумма кредита */}
              <div>
                <label className="block text-blue-700 font-semibold mb-3">
                  Сумма кредита
                </label>
                <div className="relative mb-2">
                  <input
                    type="number"
                    min="0"
                    max="1000000000"
                    step="1000"
                    value={loanAmount}
                    onChange={handleLoanAmountChange}
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
                  <span className="font-medium">Текущая сумма: </span>
                  {loanAmount ? formatCurrency(loanAmount) : "—"}
                </div>
              </div>

              {/* Срок кредита */}
              <div>
                <label className="block text-blue-700 font-semibold mb-3">
                  Срок кредита
                </label>
                <div className="relative mb-2">
                  <input
                    type="number"
                    min="1"
                    max={termType === "months" ? 360 : 30}
                    value={loanTerm}
                    onChange={handleLoanTermChange}
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

              {/* Ежемесячный платёж */}
              <div>
                <label className="block text-blue-700 font-semibold mb-3">
                  Ежемесячный платёж
                </label>
                <div className="relative mb-2">
                  <input
                    type="number"
                    min="0"
                    max="1000000000"
                    step="100"
                    value={monthlyPayment}
                    onChange={handleMonthlyPaymentChange}
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
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-sm text-blue-500">
                  <span className="font-medium">Аннуитетный платёж: </span>
                  {monthlyPayment ? formatCurrency(monthlyPayment) : "—"}
                </div>
              </div>

              {/* Подсказка */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-start space-x-2">
                  <svg
                    className="w-5 h-5 text-blue-500 mt-0.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <div className="text-sm text-blue-700">
                    <p className="font-semibold mb-1">Как это работает?</p>
                    <p>
                      Мы вычисляем реальную процентную ставку, решая обратную
                      задачу аннуитетного платежа методом Ньютона.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Нижняя часть: Результаты расчёта */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100">
              Результаты расчёта
            </h2>

            {calculationDone && loanAmount && loanTerm && monthlyPayment ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Реальная ставка */}
                  <div
                    className={`${getRateBg(
                      rateLevel,
                    )} p-5 rounded-xl border transition-all`}
                  >
                    <div className="text-sm text-blue-600 mb-2">
                      Реальная процентная ставка
                    </div>
                    <div
                      className={`text-3xl font-bold ${getRateColor(
                        rateLevel,
                      )}`}
                    >
                      {formatRate(realRate)}
                    </div>
                    <div className="text-xs text-blue-500 mt-2">
                      Годовых процентов
                    </div>
                  </div>

                  {/* Ежемесячный платёж */}
                  <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200">
                    <div className="text-sm text-blue-600 mb-2">
                      Ежемесячный платёж
                    </div>
                    <div className="text-2xl font-bold text-blue-800">
                      {formatCurrency(monthlyPayment)}
                    </div>
                    <div className="text-xs text-blue-500 mt-2">
                      Фиксированная сумма
                    </div>
                  </div>

                  {/* Общая сумма выплат */}
                  <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200">
                    <div className="text-sm text-blue-600 mb-2">
                      Общая сумма выплат
                    </div>
                    <div className="text-2xl font-bold text-blue-800">
                      {formatCurrency(totalPayment)}
                    </div>
                    <div className="text-xs text-blue-500 mt-2">
                      За весь срок кредита
                    </div>
                  </div>

                  {/* Переплата */}
                  <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200">
                    <div className="text-sm text-blue-600 mb-2">
                      Переплата по кредиту
                    </div>
                    <div className="text-2xl font-bold text-blue-800">
                      {formatCurrency(overpayment)}
                    </div>
                    <div className="text-xs text-blue-500 mt-2">
                      {loanAmount > 0
                        ? `${((overpayment / loanAmount) * 100).toFixed(
                            1,
                          )}% от суммы кредита`
                        : "—"}
                    </div>
                  </div>
                </div>

                {/* Детализация ставки */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-blue-700 mb-4">
                    Детализация расчёта
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-5 border border-blue-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-blue-600">Сумма кредита: </span>
                        <span className="font-semibold text-blue-800">
                          {formatCurrency(loanAmount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-600">Срок кредита: </span>
                        <span className="font-semibold text-blue-800">
                          {loanTerm}{" "}
                          {termType === "months"
                            ? "месяцев"
                            : loanTerm === 1
                              ? "год"
                              : loanTerm < 5
                                ? "года"
                                : "лет"}
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-600">
                          Ежемесячный платёж:{" "}
                        </span>
                        <span className="font-semibold text-blue-800">
                          {formatCurrency(monthlyPayment)}
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-600">
                          Реальная ставка (месячная):{" "}
                        </span>
                        <span className="font-semibold text-blue-800">
                          {(realRate / 12).toFixed(4)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-600">
                          Реальная ставка (годовая):{" "}
                        </span>
                        <span
                          className={`font-semibold ${getRateColor(rateLevel)}`}
                        >
                          {formatRate(realRate)}
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-600">Переплата: </span>
                        <span className="font-semibold text-blue-800">
                          {formatCurrency(overpayment)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-blue-400">
                <svg
                  className="w-16 h-16 mx-auto mb-4 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  ></path>
                </svg>
                <p className="text-lg">
                  Заполните все поля для расчёта реальной процентной ставки
                </p>
              </div>
            )}

            {/* Информация о методе расчёта */}
            <div className="bg-linear-to-r from-blue-100 to-cyan-100 p-5 rounded-xl border border-blue-200 mt-6">
              <h4 className="font-bold text-blue-800 mb-3">
                ℹ️ О расчёте реальной ставки
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-blue-700 mb-2">
                    Как рассчитывается ставка?
                  </h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>
                      • Решается обратная задача аннуитетного платежа
                      (нахождение ставки)
                    </li>
                    <li>• Используется численный метод Ньютона</li>
                    <li>
                      • Точность расчёта до 7 знаков после запятой в месячной
                      ставке
                    </li>
                    <li>• Годовая ставка получается умножением на 12</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-blue-700 mb-2">
                    Почему это важно?
                  </h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>
                      • Реальная ставка может отличаться от заявленной банком
                    </li>
                    <li>• Учитывает все комиссии и скрытые платежи</li>
                    <li>
                      • Позволяет сравнить предложения разных банков на основе
                      реальной ставки
                    </li>
                    <li>
                      • Помогает понять, сколько вы на самом деле платите за
                      кредит
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Description_component>
          <p className="font-bold mt-6 text-center">
            📊 Калькулятор Реальной Процентной Ставки Онлайн | Расчёт Истинной
            Ставки по Кредиту
          </p>
          <p className="mt-6">
            <strong>Калькулятор реальной процентной ставки онлайн</strong> — это
            профессиональный финансовый инструмент для определения истинной
            стоимости кредита. В отличие от обычных кредитных калькуляторов,
            которые работают с номинальной ставкой, наш{" "}
            <strong>калькулятор реальной ставки</strong> решает обратную задачу
            — по заданным сумме, сроку и ежемесячному платежу вычисляет реальную
            процентную ставку, которую банк фактически применил.
          </p>
          <p className="mt-6 font-bold">
            Основные возможности калькулятора реальной процентной ставки:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Расчёт реальной ставки по кредиту</strong> — точное
                определение процентной ставки на основе известных параметров
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Проверка заявленной банком ставки</strong> —
                сопоставление объявленной и реальной стоимости кредита
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Калькулятор скрытых процентов</strong> — выявление
                дополнительных комиссий в структуре платежа
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Инструмент сравнения кредитных предложений</strong> —
                объективная оценка выгодности разных кредитов по реальной ставке
              </span>
            </li>
          </ul>
          <p className="mt-6 font-bold">
            Когда нужно использовать калькулятор реальной процентной ставки:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Проверка одобренного кредита</strong> — банк назвал
                сумму, срок и платёж, но не сказал реальную ставку
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Анализ кредита с комиссиями</strong> — страховка и
                дополнительные услуги увеличивают реальную стоимость займа
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Сравнение предложений банков</strong> — объективное
                сравнение на основе реальной, а не номинальной ставки
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Оценка рефинансирования</strong> — расчёт реальной
                выгоды от перекредитования
              </span>
            </li>
          </ul>
        </Description_component>
      </div>
    </div>
  );
};

export default RealInterestRate;
