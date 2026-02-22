import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Description_component from "../components/Description_component";

const Calendar = () => {
  const currentYear = new Date().getFullYear().toString();
  const { year } = useParams();
  const [selectedYear, setSelectedYear] = useState(year || currentYear);
  const [calendarData, setCalendarData] = useState({});
  const [statistics, setStatistics] = useState({});

  // Праздничные дни России (нерабочие)
  const holidays = {
    2025: [
      "01.01.2025",
      "07.01.2025",
      "23.02.2025",
      "08.03.2025",
      "01.05.2025",
      "09.05.2025",
      "12.06.2025",
      "04.11.2025",
    ],
    2026: [
      "01.01.2026",
      "07.01.2026",
      "23.02.2026",
      "08.03.2026",
      "01.05.2026",
      "09.05.2026",
      "12.06.2026",
      "04.11.2026",
    ],
  };

  // Предпраздничные дни (сокращенные на 1 час)
  const preHolidays = {
    2025: ["07.03.2025", "30.04.2025", "11.06.2025", "01.11.2025"],
    2026: ["30.04.2026", "08.05.2026", "11.06.2026", "03.11.2026"],
  };

  // Выходные дни
  const weekends = {
    2025: [
      "02.01.2025",
      "03.01.2025",
      "06.01.2025",
      "08.01.2025",
      "02.05.2025",
      "08.05.2025",
      "13.06.2025",
      "03.11.2025",
      "31.12.2025",
    ],
    2026: [
      "02.01.2026",
      "05.01.2026",
      "06.01.2026",
      "07.01.2026",
      "08.01.2026",
      "09.01.2026",
      "09.03.2026",
      "11.05.2026",
      "31.12.2026",
    ],
  };

  // Генерация календаря на год
  const generateCalendar = (year) => {
    const months = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ];

    const calendar = {};
    let totalWorkingDays = 0;
    let totalWorkingHours = 0;

    months.forEach((monthName, monthIndex) => {
      const monthDays = [];
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, monthIndex, day);
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
        const dayOfWeek = date.getDay(); // 0 - воскресенье, 1 - понедельник...
        const dateString = `${day.toString().padStart(2, "0")}.${(
          monthIndex + 1
        )
          .toString()
          .padStart(2, "0")}.${year}`;

        // Определяем тип дня
        let dayType = "workday";
        let isHoliday = false;
        let isPreHoliday = false;
        let isWeekendTransfer = false;
        let isToday = false;

        // Проверяем праздничные дни
        if (holidays[year]?.includes(dateString)) {
          dayType = "holiday";
          isHoliday = true;
        }
        // Проверяем предпраздничные дни
        else if (preHolidays[year]?.includes(dateString)) {
          dayType = "preholiday";
          isPreHoliday = true;
        }
        // Проверяем выходные дни дни
        else if (weekends[year]?.includes(dateString)) {
          dayType = "weekend";
          isWeekendTransfer = true;
        }
        // Проверяем выходные (суббота и воскресенье)
        else if (dayOfWeek === 0 || dayOfWeek === 6) {
          dayType = "weekend";
        }

        // Проверяем сегодня
        if (date.getTime() === today.getTime()) {
          isToday = true;
        }

        // Считаем рабочие дни и часы
        if (dayType === "workday") {
          totalWorkingDays++;
          if (isPreHoliday) {
            totalWorkingHours += 7; // Сокращенный день
          } else {
            totalWorkingHours += 8;
          }
        }

        monthDays.push({
          day,
          date: dateString,
          dayOfWeek,
          dayType,
          isHoliday,
          isPreHoliday,
          isWeekendTransfer,
          isToday,
          weekdayName: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][dayOfWeek],
        });
      }

      calendar[monthIndex] = {
        name: monthName,
        days: monthDays,
      };
    });

    setStatistics({
      workingDays: totalWorkingDays,
      workingHours: totalWorkingHours,
      weekends: 365 - totalWorkingDays - holidays[year].length,
      holidays: holidays[year].length,
    });

    setCalendarData(calendar);
  };

  // Получение цвета для типа дня
  const getDayColor = (day) => {
    if (day.isHoliday) return "bg-red-100 border-red-300 text-red-800";
    if (day.dayType === "weekend")
      return "bg-blue-50 border-blue-200 text-blue-700";
    if (day.isPreHoliday)
      return "bg-yellow-50 border-yellow-200 text-yellow-800";
    if (day.isWeekendTransfer)
      return "bg-green-50 border-green-200 text-green-800";
    if (day.isToday) return "bg-green-100 border-green-200 text-green-800";
    return "bg-white border-gray-200 text-gray-800";
  };

  useEffect(() => {
    if (year && year !== selectedYear) {
      setSelectedYear(year);
    }
    generateCalendar(year || selectedYear);
  }, [year, selectedYear]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Шапка с переключателем годов */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-blue-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
                Производственный календарь
              </h1>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to="/calendar/2025"
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedYear === "2025"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                2025 год
              </Link>
              <Link
                to="/calendar/2026"
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedYear === "2026"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                2026 год
              </Link>
            </div>
          </div>
        </div>

        {/* Календарь по месяцам */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 cursor-default">
          {Object.entries(calendarData).map(([monthIndex, month]) => (
            <div
              key={monthIndex}
              className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden"
            >
              <div className="bg-linear-to-r from-blue-500 to-cyan-500 p-4">
                <h3 className="text-lg font-bold text-white text-center">
                  {month.name} {selectedYear}
                </h3>
              </div>

              <div className="p-4">
                {/* Заголовки дней недели */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(
                    (day, idx) => (
                      <div
                        key={idx}
                        className="text-center text-xs font-semibold text-blue-600 py-1"
                      >
                        {day}
                      </div>
                    ),
                  )}
                </div>

                {/* Дни месяца */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Пустые ячейки для выравнивания первого дня */}
                  {Array.from({
                    length:
                      month.days[0].dayOfWeek === 0
                        ? 6
                        : month.days[0].dayOfWeek - 1,
                  }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="h-10"></div>
                  ))}

                  {month.days.map((day) => (
                    <div
                      key={day.date}
                      className={`relative h-10 flex flex-col items-center justify-center border rounded-lg transition-all hover:scale-105 hover:shadow-sm ${getDayColor(
                        day,
                      )}`}
                    >
                      <div className="text-sm font-medium">{day.day}</div>
                      <div className="text-xs opacity-75">
                        {day.weekdayName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Статистика */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100">
            Статистика за {selectedYear} год
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200">
              <div className="text-sm text-blue-600 mb-2">Рабочих дней</div>
              <div className="text-3xl font-bold text-blue-800">
                {statistics.workingDays}
              </div>
              <div className="text-xs text-blue-500 mt-2">Всего в году</div>
            </div>

            <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200">
              <div className="text-sm text-blue-600 mb-2">Рабочих часов</div>
              <div className="text-3xl font-bold text-blue-800">
                {statistics.workingHours}
              </div>
              <div className="text-xs text-blue-500 mt-2">
                При 40-часовой неделе
              </div>
            </div>

            <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200">
              <div className="text-sm text-blue-600 mb-2">Выходных дней</div>
              <div className="text-3xl font-bold text-blue-800">
                {statistics.weekends || 0}
              </div>
              <div className="text-xs text-blue-500 mt-2">
                Субботы и воскресенья
              </div>
            </div>

            <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200">
              <div className="text-sm text-blue-600 mb-2">Праздничных дней</div>
              <div className="text-3xl font-bold text-blue-800">
                {statistics.holidays || 0}
              </div>
              <div className="text-xs text-blue-500 mt-2">
                Государственные праздники
              </div>
            </div>
          </div>

          {/* Информация о месяцах */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">
              📅 Распределение по месяцам
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(calendarData).map(([monthIndex, month]) => {
                let workingDays = month.days.filter(
                  (d) => d.dayType === "workday",
                ).length;
                const holidays = month.days.filter((d) => d.isHoliday).length;
                const weekends = month.days.filter(
                  (d) => d.dayType === "weekend",
                ).length;
                const preholiday = month.days.filter(
                  (d) => d.isPreHoliday,
                ).length;
                let workHours = 0;
                if (preholiday > 0) {
                  workingDays += preholiday;
                  workHours = preholiday * 7 + (workingDays - preholiday) * 8;
                } else {
                  workHours = workingDays * 8;
                }

                return (
                  <div
                    key={monthIndex}
                    className="bg-blue-50 p-3 rounded-lg border border-blue-200"
                  >
                    <div className="font-semibold text-blue-800 text-sm mb-2">
                      {month.name}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-blue-600">Рабочих:</span>
                        <span className="font-semibold">{workingDays}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-red-600">Праздники:</span>
                        <span className="font-semibold">{holidays}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-blue-500">Выходных:</span>
                        <span className="font-semibold">{weekends}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-green-500">Рабочих часов:</span>
                        <span className="font-semibold">{workHours}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <Description_component>
          <p className="font-bold mt-6 text-center">
            📅 Онлайн Календарь | Календарь на 2025, 2026 год с Праздниками и
            Производственным Календарем
          </p>
          <p className="mt-6">
            <strong>Онлайн календарь</strong> — это универсальный инструмент для
            планирования, отслеживания дат. Наш
            <strong>бесплатный интерактивный календарь</strong>
            предоставляет актуальную информацию о днях недели, праздниках и
            выходных, помогая эффективно управлять личными и рабочими задачами.
          </p>
          <p className="mt-6 font-bold">
            Основные возможности онлайн календаря:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Календарь на 2025 год</strong> — просмотр месяцев и дней
                года с выделением праздников и выходных
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Производственный календарь</strong> — актуальные рабочие
                и выходные дни с учетом официальных переносов
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Календарь с праздниками</strong> — отображение
                государственных, международных и профессиональных праздников
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                Мгновенный переход между годами и месяцами без перезагрузки
                страницы
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Календарь на 2026 год</strong> — предварительное
                планирование на следующий год
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Календарь для компьютера</strong> — работает прямо в
                браузере, не требует установки
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Календарь событий</strong> — возможность добавлять
                личные события, встречи и напоминания
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Календарь с номерами недель</strong> — удобно для
                корпоративного и учебного планирования
              </span>
            </li>
          </ul>
          <p className="mt-6 font-bold">
            Почему выбирают наш онлайн календарь:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Актуальная информация.</strong> Регулярное обновление
                праздников и производственного календаря согласно
                законодательству
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Удобный интерфейс.</strong> Четкое отображение дней,
                интуитивная навигация и быстрый поиск дат
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Кроссплатформенность.</strong> Полная адаптация под
                любые устройства: компьютер, планшет, смартфон
              </span>
            </li>
          </ul>
          <p className="mt-6 font-bold">
            Практическое применение онлайн календаря:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Планирование отпуска.</strong> Выбор дат отдыха с учетом
                праздников и длинных выходных
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Рабочее планирование.</strong> Составление графика
                работы, встреч и дедлайнов
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Учебный процесс.</strong> Отслеживание учебных недель,
                каникул и дат экзаменов
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Личные цели.</strong> Отметки о днях рождения,
                годовщинах и важных семейных событиях
              </span>
            </li>
          </ul>
          <p className="mt-4">
            Наш <strong>электронный календарь</strong> позволяет быстро
            определить, на какой день недели выпадает любая дата, рассчитать
            количество дней между событиями и получить информацию о{" "}
            <strong>праздничных днях</strong> и{" "}
            <strong>переносах выходных</strong>. Вы можете легко переключаться
            между <strong>календарем на месяц</strong> и{" "}
            <strong>видом на весь год</strong>, а также распечатать нужный
            период для личного использования.
          </p>
          <p className="mt-6">
            <strong>Бесплатный онлайн календарь с праздниками</strong> — это ваш
            надежный помощник в управлении временем! Попробуйте наш{" "}
            <strong>интерактивный календарь</strong> прямо сейчас — это лучший
            способ всегда быть в курсе важных дат, эффективно планировать свое
            будущее и никогда не пропускать значимые события.{" "}
            <strong>Современный календарь</strong> для организованной жизни!
          </p>
          <p className="mt-6">
            Популярные запросы: календарь, календарь на 2025, производственный
            календарь, календарь с праздниками, календарь на 2026, онлайн
            календарь, календарь на год, праздничные дни, календарь выходных,
            рабочие дни
          </p>
        </Description_component>
      </div>
    </div>
  );
};

export default Calendar;
