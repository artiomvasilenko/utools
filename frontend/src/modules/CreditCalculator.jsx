import React, { useState, useEffect } from "react";
import Description_component from "../components/Description_component";

const CreditCalculator = () => {
  // Состояния для параметров кредита
  const [loanAmount, setLoanAmount] = useState(100000);
  const [loanTerm, setLoanTerm] = useState(12);
  const [termType, setTermType] = useState("months"); // months или years
  const [interestRate, setInterestRate] = useState(18);
  const [paymentType, setPaymentType] = useState("annuity"); // annuity или differentiated
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [overpayment, setOverpayment] = useState(0);
  const [paymentSchedule, setPaymentSchedule] = useState([]);

  // Расчёт аннуитетного платежа
  const calculateAnnuityPayment = (amount, rate, months) => {
    const monthlyRate = rate / 100 / 12;
    const annuityCoefficient =
      (monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return amount * annuityCoefficient;
  };

  // Расчёт дифференцированного платежа
  const calculateDifferentiatedPayment = (amount, rate, months) => {
    const monthlyRate = rate / 100 / 12;
    const mainDebt = amount / months;
    const payments = [];

    let remainingDebt = amount;
    let total = 0;

    for (let i = 1; i <= months; i++) {
      const interest = remainingDebt * monthlyRate;
      const payment = mainDebt + interest;
      remainingDebt -= mainDebt;
      total += payment;

      payments.push({
        month: i,
        payment: Math.round(payment),
        mainDebt: Math.round(mainDebt),
        interest: Math.round(interest),
        remainingDebt: Math.round(remainingDebt),
      });
    }

    return { averagePayment: total / months, total, payments };
  };

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
    setLoanTerm(value);
  };

  const handleInterestRateChange = (e) => {
    const value = Math.min(100, Math.max(1, parseFloat(e.target.value)));
    if (isNaN(value)) {
      setInterestRate("");
    } else {
      setInterestRate(value);
    }
  };

  // Вычисление кредита
  useEffect(() => {
    const months = termType === "months" ? loanTerm : loanTerm * 12;

    if (paymentType === "annuity") {
      const monthly = calculateAnnuityPayment(loanAmount, interestRate, months);
      const total = monthly * months;

      setMonthlyPayment(Math.round(monthly));
      setTotalPayment(Math.round(total));
      setOverpayment(Math.round(total - loanAmount));

      // Генерация графика платежей для аннуитета
      const schedule = [];
      let remainingDebt = loanAmount;
      const monthlyRate = interestRate / 100 / 12;

      for (let i = 1; i <= months; i++) {
        const interest = remainingDebt * monthlyRate;
        const mainDebt = monthly - interest;
        remainingDebt -= mainDebt;

        schedule.push({
          month: i,
          payment: Math.round(monthly),
          mainDebt: Math.round(mainDebt),
          interest: Math.round(interest),
          remainingDebt: Math.round(remainingDebt > 0 ? remainingDebt : 0),
        });
      }

      setPaymentSchedule(schedule.slice(0, 12)); // Показываем первые 12 месяцев
    } else {
      const result = calculateDifferentiatedPayment(
        loanAmount,
        interestRate,
        months,
      );

      setMonthlyPayment(Math.round(result.averagePayment));
      setTotalPayment(Math.round(result.total));
      setOverpayment(Math.round(result.total - loanAmount));
      setPaymentSchedule(result.payments.slice(0, 12)); // Показываем первые 12 месяцев
    }
  }, [loanAmount, loanTerm, termType, interestRate, paymentType]);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-8">
          {/* Верхняя часть: Параметры кредита */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100">
              Параметры кредита
            </h2>

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
                  {formatCurrency(loanAmount)}
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

              {/* Ставка */}
              <div>
                <label className="block text-blue-700 font-semibold mb-3">
                  Ставка (% годовых)
                </label>
                <div className="relative mb-2">
                  <input
                    type="number"
                    min="1"
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

              {/* Тип платежа */}
              <div>
                <label className="block text-blue-700 font-semibold mb-3">
                  Вид платежа
                </label>
                <div className="space-y-4">
                  <button
                    onClick={() => setPaymentType("annuity")}
                    className={`w-full p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentType === "annuity"
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-blue-200 bg-white hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <div className="font-semibold text-blue-800 max-xl:text-xs">
                          Аннуитетный
                        </div>
                        <div className="text-sm text-blue-600 mt-1 max-xl:text-xs">
                          Равные платежи каждый месяц
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentType("differentiated")}
                    className={`w-full p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentType === "differentiated"
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-blue-200 bg-white hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <div className="font-semibold  text-blue-800 max-xl:text-xs">
                          Дифференцированный
                        </div>
                        <div className="text-sm text-blue-600 mt-1 max-xl:text-xs">
                          Платеж уменьшается каждый месяц
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Нижняя часть: Результаты расчета */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100">
              Результаты расчета
            </h2>
            {loanAmount && loanTerm && interestRate ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200">
                    <div className="text-sm text-blue-600 mb-2">
                      Ежемесячный платеж
                    </div>
                    <div className="text-2xl font-bold text-blue-800">
                      {formatCurrency(monthlyPayment)}
                    </div>
                    <div className="text-xs text-blue-500 mt-2">
                      {paymentType === "annuity"
                        ? "Фиксированная сумма"
                        : "Средний платеж"}
                    </div>
                  </div>

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

                  <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200">
                    <div className="text-sm text-blue-600 mb-2">
                      Переплата по кредиту
                    </div>
                    <div className="text-2xl font-bold text-blue-800">
                      {formatCurrency(overpayment)}
                    </div>
                    <div className="text-xs text-blue-500 mt-2">
                      {((overpayment / loanAmount) * 100).toFixed(1)}% от суммы
                      кредита
                    </div>
                  </div>

                  <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200">
                    <div className="text-sm text-blue-600 mb-2">
                      Эффективная ставка
                    </div>
                    <div className="text-2xl font-bold text-blue-800">
                      {(
                        interestRate ||
                        0 +
                          ((overpayment / loanAmount) * 100) /
                            (termType === "months" ? loanTerm / 12 : loanTerm)
                      ).toFixed(2)}
                      %
                    </div>
                    <div className="text-xs text-blue-500 mt-2">
                      С учетом всех платежей
                    </div>
                  </div>
                </div>

                {/* График платежей */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-blue-700 mb-4">
                    График платежей (первые 12 месяцев)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-blue-50">
                          <th className="p-3 text-left text-blue-700 font-semibold border-b border-blue-200">
                            Месяц
                          </th>
                          <th className="p-3 text-left text-blue-700 font-semibold border-b border-blue-200">
                            Платеж
                          </th>
                          <th className="p-3 text-left text-blue-700 font-semibold border-b border-blue-200">
                            Основной долг
                          </th>
                          <th className="p-3 text-left text-blue-700 font-semibold border-b border-blue-200">
                            Проценты
                          </th>
                          <th className="p-3 text-left text-blue-700 font-semibold border-b border-blue-200">
                            Остаток долга
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentSchedule.map((item) => (
                          <tr
                            key={item.month}
                            className="hover:bg-blue-50 transition-colors"
                          >
                            <td className="p-3 border-b border-blue-100 text-blue-800 font-medium">
                              {item.month}
                            </td>
                            <td className="p-3 border-b border-blue-100 text-blue-800 font-semibold">
                              {formatCurrency(item.payment)}
                            </td>
                            <td className="p-3 border-b border-blue-100 text-blue-700">
                              {formatCurrency(item.mainDebt)}
                            </td>
                            <td className="p-3 border-b border-blue-100 text-blue-600">
                              {formatCurrency(item.interest)}
                            </td>
                            <td className="p-3 border-b border-blue-100 text-blue-800">
                              {formatCurrency(item.remainingDebt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}

            {/* Информация о типах платежей */}
            <div className="bg-linear-to-r from-blue-100 to-cyan-100 p-5 rounded-xl border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-3">
                ℹ️ О типах платежей
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-blue-700 mb-2">
                    Аннуитетный платеж
                  </h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Ежемесячный платеж одинаковый</li>
                    <li>• Удобно для планирования бюджета</li>
                    <li>• В начале срока платите больше процентов</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-blue-700 mb-2">
                    Дифференцированный платеж
                  </h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Платеж уменьшается каждый месяц</li>
                    <li>• Общая переплата меньше</li>
                    <li>• В начале срока платежи больше</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Description_component>
          <p className="font-bold mt-6 text-center">
            🧮 Калькулятор Кредита Онлайн | Рассчитать Кредит и Проценты с
            Детальным Платежом
          </p>
          <p className="mt-6">
            <strong>Калькулятор кредита онлайн</strong> — это точный и
            универсальный финансовый инструмент для расчета условий займа,
            ежемесячных платежей, переплаты и процентной ставки. Наш{" "}
            <strong>бесплатный кредитный калькулятор</strong> позволяет
            мгновенно рассчитать потребительский, ипотечный или автокредит,
            сравнить предложения банков и принять взвешенное решение.
          </p>
          <p className="mt-6 font-bold">
            Основные возможности онлайн калькулятора кредита:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Кредитный калькулятор онлайн</strong> — точный расчет
                аннуитетных платежей и графика погашения
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Калькулятор процентов по кредиту</strong> — расчет
                переплаты и процентной ставки за весь срок
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Калькулятор ежемесячного платежа</strong> — точный
                расчет суммы регулярного взноса по кредиту
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Онлайн калькулятор для кредита</strong> — работает в
                браузере без скачивания, подходит для физических лиц
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Калькулятор расчета кредита</strong> — вычисление
                оптимальной суммы займа на основе платежеспособности
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Калькулятор переплаты по кредиту</strong> — наглядный
                расчет общей суммы процентов и стоимости кредита
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Калькулятор кредитной ставки</strong> — анализ и
                сравнение процентных ставок разных банков
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Универсальный кредитный калькулятор</strong> — подходит
                для расчета потребительского, ипотечного кредита и автокредита
              </span>
            </li>
          </ul>
          <p className="mt-6 font-bold">
            Почему выбирают наш калькулятор кредитов онлайн:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Мгновенный и точный расчет.</strong> Использование
                банковских формул для достоверного расчета платежей, процентов и
                переплаты.
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Детальная аналитика платежей.</strong> Наглядный график
                погашения с разбивкой на основной долг и проценты по каждому
                периоду.
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Простой и понятный интерфейс.</strong> Интуитивное
                управление для быстрого расчета кредита, ставки и ежемесячного
                платежа.
              </span>
            </li>
          </ul>
          <p className="mt-6 font-bold">
            Практическое применение кредитного калькулятора онлайн:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Рассчитать кредит онлайн</strong> перед обращением в
                банк для оценки своих возможностей.
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Посчитать переплату и проценты</strong> по кредиту для
                выбора самого выгодного предложения.
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Сравнить условия</strong> потребительского, ипотечного и
                автокредита в разных банках.
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Спланировать бюджет</strong>, точно зная сумму
                ежемесячного платежа по кредиту.
              </span>
            </li>
          </ul>
        </Description_component>
      </div>
    </div>
  );
};

export default CreditCalculator;
