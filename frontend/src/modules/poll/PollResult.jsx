// components/PollResults.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Description_component from "../../components/Description_component";

const PollResults = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResults();
  }, [slug]);

  const fetchResults = async () => {
    try {
      const response = await fetch(
        `/api/polls/${slug}/results/`,
      );
      if (!response.ok) {
        throw new Error("Результаты не найдены");
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getPercentage = (votes, total) => {
    if (total === 0) return 0;
    return ((votes / total) * 100).toFixed(1);
  };

  const getBarColor = (index) => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-teal-500 to-green-500",
      "from-purple-500 to-pink-500",
      "from-yellow-500 to-orange-500",
      "from-red-500 to-pink-500",
      "from-indigo-500 to-blue-500",
    ];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-teal-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-blue-600">Загрузка результатов...</p>
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
          {/* Левая колонка: результаты опроса */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 animate-fadeIn">
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-blue-100">
                <h2 className="text-2xl font-bold text-blue-700">
                  Результаты опроса
                </h2>
              </div>

              {/* Вопрос */}
              <div className="mb-8">
                <div className="bg-linear-to-r from-blue-500 to-teal-500 text-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-semibold">{results.question}</h3>
                </div>
              </div>

              {/* Результаты вариантов */}
              <div className="space-y-6">
                {results.options.map((option, index) => {
                  const percentage = getPercentage(
                    option.votes_count,
                    results.total_votes,
                  );
                  const barColor = getBarColor(index);

                  return (
                    <div
                      key={option.order}
                      className="space-y-2 animate-slideIn"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-blue-800">
                          {option.option_text}
                        </span>
                        <span className="text-sm font-medium text-blue-600">
                          {option.votes_count}{" "}
                          {option.votes_count === 1
                            ? "голос"
                            : option.votes_count > 1 && option.votes_count < 5
                              ? "голоса"
                              : "голосов"}
                          {results.total_votes > 0 && ` (${percentage}%)`}
                        </span>
                      </div>
                      <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full bg-linear-to-r ${barColor} transition-all duration-1000 ease-out`}
                          style={{
                            width: `${percentage}%`,
                            animation: "growBar 1s ease-out",
                          }}
                        >
                          <div className="absolute inset-0 flex items-center justify-end px-2 text-white text-sm font-semibold">
                            {percentage > 10 && `${percentage}%`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {results.total_votes === 0 && (
                <div className="mt-8 text-center py-8 text-blue-400 border-2 border-dashed border-blue-200 rounded-lg">
                  <svg
                    className="w-16 h-16 mx-auto mb-4"
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
                    Пока нет результатов. Будьте первым, кто проголосует!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Правая колонка: статистика */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 animate-fadeIn">
              <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100">
                Статистика
              </h2>

              <div className="space-y-4">
                <div className="bg-linear-to-r from-cyan-100 to-teal-100 p-6 rounded-lg text-center">
                  <p className="text-4xl font-bold text-blue-700 mb-2">
                    {results.total_votes}
                  </p>
                  <p className="text-sm text-blue-600">
                    {results.total_votes === 1
                      ? "голос"
                      : results.total_votes > 1 && results.total_votes < 5
                        ? "голоса"
                        : "голосов"}
                  </p>
                </div>

                {results.user_voted && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-green-700 font-semibold flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
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
                      Вы уже проголосовали в этом опросе
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Description_component>
          <p className="font-bold mt-6 text-center">
            Результаты опроса | Статистика голосования в реальном времени
          </p>

          <p className="mt-6">
            <strong>Аналитика результатов</strong> показывает распределение
            голосов в наглядном виде. Следите за тем, как участники отвечают на
            вопросы, и анализируйте предпочтения аудитории.
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

        @keyframes growBar {
          from {
            width: 0;
          }
          to {
            width: var(--width);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default PollResults;
