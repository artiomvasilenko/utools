// components/PollCreator.jsx
import React, { useState } from "react";
import Description_component from "../../components/Description_component";
import { fetchWithCSRF } from "../../components/csrf";

const PollCreator = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([""]);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);

    // Добавляем новое поле, если это последнее поле и оно не пустое
    if (
      index === options.length - 1 &&
      value.trim() !== "" &&
      options.length < 10
    ) {
      setOptions([...newOptions, ""]);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (options[index].trim() !== "" && options.length < 10) {
        setOptions([...options, ""]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Валидация
    if (!question.trim()) {
      setError("Введите вопрос");
      return;
    }

    const validOptions = options.filter((opt) => opt.trim() !== "");
    if (validOptions.length < 2) {
      setError("Добавьте минимум 2 варианта ответа");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetchWithCSRF(
        window.location.origin + "/api/polls/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question.trim(),
            allow_multiple: allowMultiple,
            options: validOptions,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Ошибка при создании опроса");
      }

      const data = await response.json();
      setSuccess(data);

      // Очищаем форму
      setQuestion("");
      setOptions([""]);
      setAllowMultiple(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-teal-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Левая колонка: Создание опроса */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 animate-fadeIn">
              <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100">
                Создание опроса
              </h2>

              {success ? (
                <div className="text-center py-6 animate-slideUp">
                  <div className="mb-4 text-green-500">
                    <svg
                      className="w-16 h-16 mx-auto"
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
                  <h3 className="text-xl font-bold text-blue-800 mb-2">
                    Опрос создан!
                  </h3>
                  <p className="text-blue-600 mb-4">Ссылка для голосования:</p>
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <a
                      href={`/poll/${success.slug}`}
                      className="text-teal-600 font-mono break-all hover:underline"
                    >
                      {window.location.origin}/poll/{success.slug}
                    </a>
                  </div>
                  <button
                    onClick={() => setSuccess(null)}
                    className="bg-linear-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg"
                  >
                    Создать новый опрос
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Поле вопроса */}
                  <div className="mb-6">
                    <label className="block text-teal-700 font-semibold mb-2">
                      Вопрос
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Введите ваш вопрос..."
                        className="w-full p-3 pl-10 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      />
                      <div className="absolute left-3 top-4 text-teal-600">
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
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Варианты ответов */}
                  <div className="mb-6">
                    <label className="block text-teal-700 font-semibold mb-2">
                      Варианты ответа (макс. 10)
                    </label>
                    <div className="space-y-3">
                      {options.map((option, index) => (
                        <div
                          key={index}
                          className="relative animate-slideIn"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            placeholder={`Вариант ${index + 1}`}
                            className="w-full p-3 pl-10 pr-10 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                          />
                          <div className="absolute left-3 top-4 text-teal-600">
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
                                d="M9 5l7 7-7 7"
                              ></path>
                            </svg>
                          </div>
                          {options.length > 1 &&
                            option === "" &&
                            index !== options.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveOption(index)}
                                className="absolute right-3 top-3 text-red-400 hover:text-red-600 transition-colors"
                              >
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  ></path>
                                </svg>
                              </button>
                            )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-sm text-blue-500">
                      <span className="font-medium">Добавлено:</span>{" "}
                      {options.filter((o) => o.trim() !== "").length} из 10
                      вариантов
                    </div>
                  </div>

                  {/* Ползунок выбора нескольких вариантов */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between">
                      <label className="text-teal-700 font-semibold">
                        Выбор нескольких вариантов
                      </label>
                      <button
                        type="button"
                        onClick={() => setAllowMultiple(!allowMultiple)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                          allowMultiple ? "bg-teal-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            allowMultiple ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-blue-500">
                      {allowMultiple
                        ? "Участники смогут выбрать несколько вариантов"
                        : "Участники смогут выбрать только один вариант"}
                    </p>
                  </div>

                  {/* Кнопка сохранения */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-linear-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
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
                        Создание...
                      </>
                    ) : (
                      "Создать опрос"
                    )}
                  </button>

                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 animate-shake">
                      {error}
                    </div>
                  )}
                </form>
              )}

              {/* Информационный блок */}
              <div className="mt-6 bg-linear-to-r from-cyan-100 to-teal-100 p-4 rounded-lg border border-blue-200">
                <h3 className="font-bold text-blue-800 mb-2">ℹ️ Информация</h3>
                <p className="text-sm text-blue-700">
                  Создавайте опросы с возможностью выбора одного или нескольких
                  вариантов. Максимальное количество вариантов - 10. После
                  создания вы получите уникальную ссылку для голосования.
                </p>
              </div>
            </div>
          </div>

          {/* Правая колонка: Превью */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 h-full animate-fadeIn">
              <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100">
                Превью опроса
              </h2>

              {question || options.some((opt) => opt.trim() !== "") ? (
                <div className="space-y-6">
                  {/* Вопрос */}
                  <div className="bg-linear-to-r from-blue-50 to-teal-50 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold text-blue-800">
                      {question || "Ваш вопрос появится здесь"}
                    </h3>
                  </div>

                  {/* Варианты ответов */}
                  <div className="space-y-3">
                    {options
                      .filter((opt) => opt.trim() !== "")
                      .map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 bg-blue-50 rounded-lg border-2 border-blue-100 hover:border-teal-200 transition-all animate-slideIn"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          {allowMultiple ? (
                            <div className="w-5 h-5 border-2 border-teal-400 rounded mr-3 flex-shrink-0"></div>
                          ) : (
                            <div className="w-5 h-5 border-2 border-teal-400 rounded-full mr-3 flex-shrink-0"></div>
                          )}
                          <span className="text-blue-700">{option}</span>
                        </div>
                      ))}
                  </div>

                  {allowMultiple && (
                    <div className="text-sm text-teal-600 bg-teal-50 p-2 rounded-lg">
                      ✓ Можно выбрать несколько вариантов
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-blue-400">
                  <svg
                    className="w-24 h-24 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  <p className="text-lg">
                    Заполните форму слева, чтобы увидеть превью
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Description_component>
          <p className="font-bold mt-6 text-center">
            Создание опросов онлайн | Бесплатный инструмент для голосования
          </p>

          <p className="mt-6">
            <strong>Конструктор опросов</strong> — это мощный онлайн-инструмент,
            позволяющий мгновенно создавать интерактивные опросы для различных
            целей. Наш сервис предлагает{" "}
            <strong>быстрое создание опросов онлайн</strong>с возможностью
            настройки всех параметров.
          </p>

          <p className="mt-6 font-bold">Основные возможности конструктора:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2 text-teal-500">✓</span>
              <span>Создание опросов с любыми вопросами</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-teal-500">✓</span>
              <span>Добавление до 10 вариантов ответа</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-teal-500">✓</span>
              <span>Выбор одного или нескольких вариантов</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-teal-500">✓</span>
              <span>Автоматическое добавление новых полей</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-teal-500">✓</span>
              <span>Мгновенное превью опроса</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-teal-500">✓</span>
              <span>Уникальная ссылка для каждого опроса</span>
            </li>
          </ul>
        </Description_component>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
          opacity: 0;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default PollCreator;
