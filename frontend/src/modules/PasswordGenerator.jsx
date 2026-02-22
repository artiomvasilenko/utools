import React, { useState, useEffect } from "react";
import Description_component from "../components/Description_component";

const PasswordGenerator = () => {
  // Состояния
  const [passwordCount, setPasswordCount] = useState(4);
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecial, setIncludeSpecial] = useState(true);
  const [passwords, setPasswords] = useState([]);
  const [copied, setCopied] = useState(false);

  // Наборы символов
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  // Генерация паролей
  const generatePasswords = () => {
    let charSet = "";
    if (includeUppercase) charSet += uppercaseChars;
    if (includeLowercase) charSet += lowercaseChars;
    if (includeNumbers) charSet += numberChars;
    if (includeSpecial) charSet += specialChars;

    // Если ничего не выбрано, используем хотя бы строчные буквы
    if (charSet === "") {
      charSet = lowercaseChars;
      setIncludeLowercase(true);
    }

    const newPasswords = [];
    for (let i = 0; i < passwordCount; i++) {
      let password = "";
      for (let j = 0; j < passwordLength; j++) {
        const randomIndex = Math.floor(Math.random() * charSet.length);
        password += charSet[randomIndex];
      }
      newPasswords.push(password);
    }
    setPasswords(newPasswords);
  };

  // Обработчики изменений
  const handlePasswordCountChange = (e) => {
    const value = Math.min(7, Math.max(1, parseInt(e.target.value)));
    if (isNaN(value)) {
      setPasswordCount("");
    } else {
      setPasswordCount(value);
    }
  };

  const handlePasswordLengthChange = (e) => {
    const value = Math.min(18, Math.max(4, parseInt(e.target.value)));
    if (isNaN(value)) {
      setPasswordLength("");
    } else {
      setPasswordLength(value);
    }
  };

  const copyToClipboard = () => {
    const text = passwords.join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const copySinglePassword = (password) => {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  };

  const calculateStrength = (password) => {
    let score = 0;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  // Генерируем пароли при изменении параметров
  useEffect(() => {
    generatePasswords();
  }, [
    passwordCount,
    passwordLength,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSpecial,
  ]);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая колонка: Параметры генерации */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
              <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100">
                Параметры генерации
              </h2>

              {/* Количество паролей */}
              <div className="mb-8">
                <label className="block text-blue-700 font-semibold mb-3">
                  Количество паролей (макс. 7)
                </label>
                <div className="relative mb-2">
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={passwordCount}
                    onChange={handlePasswordCountChange}
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-sm text-blue-500">
                  <span className="font-medium">Текущее значение:</span>{" "}
                  {passwordCount}
                </div>
              </div>

              {/* Длина пароля */}
              <div className="mb-8">
                <label className="block text-blue-700 font-semibold mb-3">
                  Длина пароля (макс. 18 символов)
                </label>
                <div className="relative mb-2">
                  <input
                    type="number"
                    min="4"
                    max="18"
                    value={passwordLength}
                    onChange={handlePasswordLengthChange}
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-sm text-blue-500">
                  <span className="font-medium">Текущее значение:</span>{" "}
                  {passwordLength}
                </div>
              </div>

              {/* Чекбоксы в стиле iOS переключателей */}
              <div className="space-y-4 mb-8">
                <h3 className="text-blue-700 font-semibold mb-3">
                  Наборы символов:
                </h3>

                {/* Заглавные буквы */}
                <div className="flex items-center justify-between">
                  <span className="text-blue-800">Заглавные буквы (A-Z)</span>
                  <button
                    onClick={() => setIncludeUppercase(!includeUppercase)}
                    className={`relative inline-flex cursor-pointer h-6 w-11 min-w-11 items-center rounded-full transition-colors duration-300 ${
                      includeUppercase ? "bg-blue-500" : "bg-blue-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        includeUppercase ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Строчные буквы */}
                <div className="flex items-center justify-between">
                  <span className="text-blue-800">Строчные буквы (a-z)</span>
                  <button
                    onClick={() => setIncludeLowercase(!includeLowercase)}
                    className={`relative inline-flex cursor-pointer h-6 w-11 min-w-11 items-center rounded-full transition-colors duration-300 ${
                      includeLowercase ? "bg-blue-500" : "bg-blue-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        includeLowercase ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Цифры */}
                <div className="flex items-center justify-between">
                  <span className="text-blue-800">Цифры (0-9)</span>
                  <button
                    onClick={() => setIncludeNumbers(!includeNumbers)}
                    className={`relative inline-flex cursor-pointer h-6 w-11 min-w-11 items-center rounded-full transition-colors duration-300 ${
                      includeNumbers ? "bg-blue-500" : "bg-blue-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        includeNumbers ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Спецсимволы */}
                <div className="flex items-center justify-between">
                  <span className="text-blue-800">Спецсимволы (!@#$%)</span>
                  <button
                    onClick={() => setIncludeSpecial(!includeSpecial)}
                    className={`relative inline-flex cursor-pointer h-6 w-11 min-w-11 items-center rounded-full transition-colors duration-300 ${
                      includeSpecial ? "bg-blue-500" : "bg-blue-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        includeSpecial ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Информационный блок */}
              <div className="bg-linear-to-r from-blue-100 to-cyan-100 p-4 rounded-lg border border-blue-200">
                <h3 className="font-bold text-blue-800 mb-2">
                  ℹ️ Советы по безопасности
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Используйте длинные пароли (12+ символов)</li>
                  <li>• Включайте разные типы символов</li>
                  <li>• Не используйте один пароль на разных сайтах</li>
                  <li>• Регулярно обновляйте пароли</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Правая колонка: Результаты */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 h-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-3 border-b border-blue-100">
                <h2 className="text-xl font-bold text-blue-700 mb-4 sm:mb-0">
                  Сгенерированные пароли
                </h2>
                <button
                  onClick={copyToClipboard}
                  className="max-md:hidden cursor-pointer text-xs bg-linear-to-r from-blue-500 to-cyan-500 text-white px-5 py-2.5 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {copied ? (
                    <>
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
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      Скопировано!
                    </>
                  ) : (
                    <>
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
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        ></path>
                      </svg>
                      Копировать все
                    </>
                  )}
                </button>
              </div>

              {/* Отображение сгенерированных паролей */}
              <div className="space-y-4">
                {passwords.map((password, index) => {
                  const strength = calculateStrength(password);
                  const strengthColor =
                    strength === 1
                      ? "bg-red-100 text-red-800"
                      : strength === 2
                        ? "bg-yellow-100 text-yellow-800"
                        : strength === 3
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800";

                  const strengthText =
                    strength === 1
                      ? "Слабый"
                      : strength === 2
                        ? "Средний"
                        : strength === 3
                          ? "Хороший"
                          : "Отличный";

                  return (
                    <div
                      key={index}
                      className="bg-linear-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-5 transform transition-all hover:scale-[1.02] hover:shadow-md"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-sm font-semibold text-blue-300 bg-blue-50 px-3 py-1 rounded-full cursor-default">
                              №{index + 1}
                            </div>
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-full ${strengthColor} cursor-default`}
                            >
                              {strengthText}
                            </span>
                          </div>
                          <div className="font-mono text-lg md:text-xl font-bold text-blue-800 break-all">
                            {password}
                          </div>
                        </div>
                        <button
                          onClick={() => copySinglePassword(password)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700  cursor-pointer px-4 py-2 rounded-lg transition-colors flex items-center justify-center md:justify-start whitespace-nowrap"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            ></path>
                          </svg>
                          Копировать
                        </button>
                      </div>

                      {/* Индикатор сложности */}
                      <div className="mt-3">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                                level <= strength
                                  ? level === 1
                                    ? "bg-green-300"
                                    : level === 2
                                      ? "bg-green-400"
                                      : level === 3
                                        ? "bg-green-600"
                                        : "bg-green-800"
                                  : "bg-blue-100"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <Description_component>
          <p className="font-bold mt-6 text-center">
            🔐 Генератор Паролей Онлайн | Создать Надежный и Сложный Пароль
            Бесплатно
          </p>
          <p className="mt-6">
            <strong>Онлайн генератор паролей</strong> — это профессиональный
            инструмент для создания стойких криптографических ключей, которые
            защитят ваши аккаунты от взлома. Наш{" "}
            <strong>бесплатный генератор паролей</strong> использует современные
            алгоритмы для генерации уникальных и надежных комбинаций за секунду.
          </p>
          <p className="mt-6 font-bold">
            Основные возможности генератора паролей:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Генератор сложных паролей</strong> — создание комбинаций
                с буквами, цифрами и специальными символами
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Генератор надежных паролей</strong> — использование
                криптографически стойких алгоритмов для максимальной
                безопасности
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Настройка длины пароля</strong> — гибкая установка
                количества символов от 6 до 64
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                Мгновенная генерация паролей без перезагрузки страницы
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Генератор паролей онлайн бесплатно</strong> — полный
                функционал доступен без ограничений и регистрации
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Создание мнемонических паролей</strong> — генерация
                запоминающихся, но безопасных комбинаций
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Генератор паролей для компьютера</strong> — работает
                прямо в браузере без установки программ
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Инструмент для создания паролей</strong> — поддержка
                разных типов символов (верхний/нижний регистр, цифры,
                спецсимволы)
              </span>
            </li>
          </ul>
          <p className="mt-6 font-bold">
            Почему выбирают наш генератор паролей:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Высокая безопасность.</strong> Пароли генерируются
                локально в вашем браузере и никуда не передаются
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Гибкая настройка.</strong> Возможность выбрать типы
                используемых символов и длину пароля
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Кроссплатформенность.</strong> Работает на всех
                устройствах и операционных системах
              </span>
            </li>
          </ul>
          <p className="mt-6 font-bold">
            Практическое применение генератора паролей:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Личные аккаунты.</strong> Создание надежных паролей для
                почты, социальных сетей и мессенджеров
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Бизнес и работа.</strong> Защита корпоративных
                аккаунтов, CRM-систем и баз данных
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Финансовая безопасность.</strong> Генерация паролей для
                интернет-банкинга, платежных систем и криптокошельков
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Администрирование.</strong> Создание временных паролей
                для сотрудников и клиентов
              </span>
            </li>
          </ul>
          <p className="mt-4">
            Наш <strong>генератор надежных паролей</strong> использует
            современные криптографические алгоритмы для создания уникальных
            комбинаций. Вы можете настроить <strong>длину пароля</strong>,
            включить или отключить <strong>заглавные буквы</strong>,{" "}
            <strong>цифры</strong> и <strong>специальные символы</strong>. Для
            удобства доступна функция <strong>быстрого копирования</strong>{" "}
            созданного пароля в буфер обмена.
          </p>
          <p className="mt-6">
            <strong>Бесплатный онлайн генератор паролей</strong> — это ваш
            надежный союзник в защите цифровой жизни! Попробуйте наш{" "}
            <strong>инструмент для создания паролей</strong> прямо сейчас — это
            лучший способ обезопасить свои аккаунты от взлома и кражи данных.{" "}
            <strong>Простой генератор</strong> с профессиональным уровнем
            безопасности!
          </p>
          <p className="mt-6">
            Популярные запросы: генератор паролей, создать пароль, надежный
            пароль, сложный пароль, генератор паролей онлайн, бесплатный
            генератор паролей, сгенерировать пароль, генератор паролей
            бесплатно, создать надежный пароль, генератор сложных паролей
          </p>
        </Description_component>
      </div>
    </div>
  );
};

export default PasswordGenerator;
