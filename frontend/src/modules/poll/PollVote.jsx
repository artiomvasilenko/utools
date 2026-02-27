// components/PollVote.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Description_component from "../../components/Description_component";

const PollVote = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPoll();
  }, [slug]);

  const fetchPoll = async () => {
    try {
      const response = await fetch(
        window.location.origin + `/api/polls/${slug}/`,
      );
      if (!response.ok) {
        throw new Error("Опрос не найден");
      }
      const data = await response.json();
      setPoll(data);

      // Инициализируем выбранные опции в зависимости от типа
      setSelectedOptions(data.allow_multiple ? [] : null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionChange = (optionId) => {
    if (poll.allow_multiple) {
      // Для множественного выбора
      setSelectedOptions((prev) => {
        if (prev.includes(optionId)) {
          return prev.filter((id) => id !== optionId);
        } else {
          return [...prev, optionId];
        }
      });
    } else {
      // Для одиночного выбора
      setSelectedOptions(optionId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация
    if (poll.allow_multiple && selectedOptions.length === 0) {
      setError("Выберите хотя бы один вариант");
      return;
    }
    if (!poll.allow_multiple && selectedOptions === null) {
      setError("Выберите вариант ответа");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const optionIds = poll.allow_multiple
        ? selectedOptions
        : [selectedOptions];

      const response = await fetch(
        window.location.origin + "/api/polls/vote/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ option_ids: optionIds }),
        },
      );

      if (!response.ok) {
        throw new Error("Ошибка при отправке голоса");
      }

      const data = await response.json();

      // Перенаправляем на страницу результатов
      navigate(window.location.origin + `/poll/${slug}/results`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-teal-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-blue-600">Загрузка опроса...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-teal-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <svg
              className="w-20 h-20 mx-auto text-red-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Ошибка</h2>
            <p className="text-blue-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="bg-linear-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all"
            >
              На главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-teal-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая колонка: Информация */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 animate-fadeIn">
              <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100">
                Информация
              </h2>

              <div className="space-y-4">
                <div className="bg-linear-to-r from-cyan-100 to-teal-100 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <span className="font-bold">Дата создания:</span>
                    <br />
                    {formatDate(poll.created_at)}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-700">
                    <span className="font-bold">Тип голосования:</span>
                    <br />
                    {poll.allow_multiple
                      ? "✓ Можно выбрать несколько вариантов"
                      : "✓ Можно выбрать только один вариант"}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-700">
                    <span className="font-bold">Всего вариантов:</span>
                    <br />
                    {poll.options.length}
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-linear-to-r from-cyan-100 to-teal-100 p-4 rounded-lg border border-blue-200">
                <h3 className="font-bold text-blue-800 mb-2">
                  ℹ️ Как голосовать
                </h3>
                <p className="text-sm text-blue-700">
                  {poll.allow_multiple
                    ? 'Отметьте все подходящие варианты и нажмите "Голосовать"'
                    : 'Выберите один вариант и нажмите "Голосовать"'}
                </p>
              </div>
            </div>
          </div>

          {/* Правая колонка: Голосование */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 animate-fadeIn">
              <div className="mb-6 pb-3 border-b border-blue-100">
                <h2 className="text-2xl font-bold text-blue-700">
                  Голосование
                </h2>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Вопрос */}
                <div className="mb-8">
                  <div className="bg-linear-to-r from-blue-500 to-teal-500 text-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-semibold">{poll.question}</h3>
                  </div>
                </div>

                {/* Варианты ответов */}
                <div className="space-y-4 mb-8">
                  {poll.options.map((option, index) => (
                    <label
                      key={option.id}
                      className={`flex items-center p-4 bg-linear-to-r from-blue-50 to-teal-50 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md animate-slideIn ${
                        (
                          poll.allow_multiple
                            ? selectedOptions.includes(option.id)
                            : selectedOptions === option.id
                        )
                          ? "border-teal-500 bg-teal-50"
                          : "border-blue-100 hover:border-teal-200"
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <input
                        type={poll.allow_multiple ? "checkbox" : "radio"}
                        name="poll-option"
                        checked={
                          poll.allow_multiple
                            ? selectedOptions.includes(option.id)
                            : selectedOptions === option.id
                        }
                        onChange={() => handleOptionChange(option.id)}
                        className="w-5 h-5 text-teal-500 focus:ring-teal-400 cursor-pointer"
                      />
                      <span className="ml-4 text-lg text-blue-800">
                        {option.option_text}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Кнопка голосования */}
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    (poll.allow_multiple
                      ? selectedOptions.length === 0
                      : !selectedOptions)
                  }
                  className="w-full bg-linear-to-r from-blue-500 to-teal-500 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-teal-600 transition-all flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
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
                      Отправка...
                    </>
                  ) : (
                    "Голосовать"
                  )}
                </button>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 animate-shake">
                    {error}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        <Description_component>
          <p className="font-bold mt-6 text-center">
            Голосование в опросе | Примите участие в онлайн-опросе
          </p>

          <p className="mt-6">
            <strong>Система голосования</strong> позволяет легко и удобно
            участвовать в опросах. Просто выберите подходящий вариант ответа и
            нажмите кнопку "Голосовать".
          </p>
        </Description_component>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default PollVote;
