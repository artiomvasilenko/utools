import React, { useState, useRef, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import Description_component from "../components/Description_component";

const PdfMerger = () => {
  const [files, setFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeProgress, setMergeProgress] = useState(0);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [mergedFileName, setMergedFileName] = useState("");
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  // Подсчет общего количества страниц
  const getTotalPages = useCallback(() => {
    return files.reduce((total, file) => total + (file.pageCount || 0), 0);
  }, [files]);

  // Общий размер файлов
  const getTotalSize = useCallback(() => {
    const totalBytes = files.reduce((total, file) => total + file.size, 0);
    if (totalBytes < 1024) return `${totalBytes} Б`;
    if (totalBytes < 1024 * 1024) return `${(totalBytes / 1024).toFixed(1)} КБ`;
    return `${(totalBytes / (1024 * 1024)).toFixed(2)} МБ`;
  }, [files]);

  // Чтение файла и получение количества страниц
  const readFileInfo = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });
      return {
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        size: file.size,
        pageCount: pdfDoc.getPageCount(),
        arrayBuffer,
      };
    } catch (err) {
      throw new Error(
        `Не удалось прочитать файл "${file.name}". Возможно, файл повреждён или защищён паролем.`,
      );
    }
  };

  // Обработка выбора файлов
  const handleFileSelect = async (selectedFiles) => {
    setError("");
    const fileList = Array.from(selectedFiles);

    // Проверка на PDF
    const nonPdfFiles = fileList.filter(
      (file) =>
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf"),
    );
    if (nonPdfFiles.length > 0) {
      setError(
        `Файлы не являются PDF: ${nonPdfFiles.map((f) => f.name).join(", ")}`,
      );
      return;
    }

    // Проверка на максимальный размер (100 МБ на файл)
    const oversizedFiles = fileList.filter(
      (file) => file.size > 100 * 1024 * 1024,
    );
    if (oversizedFiles.length > 0) {
      setError(
        `Файлы превышают 100 МБ: ${oversizedFiles.map((f) => f.name).join(", ")}`,
      );
      return;
    }

    try {
      const filesWithInfo = await Promise.all(
        fileList.map((file) => readFileInfo(file)),
      );
      setFiles((prev) => [...prev, ...filesWithInfo]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Drag and drop обработчики
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  // Удаление файла из списка
  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setMergedPdfUrl(null);
  };

  // Очистка всего списка
  const clearAll = () => {
    setFiles([]);
    setMergedPdfUrl(null);
    setMergedFileName("");
    setError("");
  };

  // Перемещение файла вверх
  const moveFileUp = (index) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index - 1], newFiles[index]] = [
      newFiles[index],
      newFiles[index - 1],
    ];
    setFiles(newFiles);
    setMergedPdfUrl(null);
  };

  // Перемещение файла вниз
  const moveFileDown = (index) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index + 1]] = [
      newFiles[index + 1],
      newFiles[index],
    ];
    setFiles(newFiles);
    setMergedPdfUrl(null);
  };

  // Объединение PDF
  const mergePdfs = async () => {
    if (files.length < 2) {
      setError("Добавьте минимум 2 PDF файла для объединения");
      return;
    }

    setIsMerging(true);
    setMergeProgress(0);
    setError("");

    try {
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        const fileData = files[i];
        const sourcePdf = await PDFDocument.load(fileData.arrayBuffer, {
          ignoreEncryption: true,
        });
        const sourcePages = sourcePdf.getPages();

        if (sourcePages.length === 0) {
          setMergeProgress(Math.round(((i + 1) / files.length) * 100));
          continue;
        }

        const copiedPages = await mergedPdf.copyPages(
          sourcePdf,
          sourcePages.map((_, idx) => idx),
        );

        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });

        setMergeProgress(Math.round(((i + 1) / files.length) * 100));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Очищаем предыдущий URL
      if (mergedPdfUrl) {
        URL.revokeObjectURL(mergedPdfUrl);
      }

      setMergedPdfUrl(url);

      // Генерируем имя для объединенного файла
      const baseName = files[0].name.replace(/\.pdf$/i, "");
      setMergedFileName(`${baseName}_объединенный.pdf`);
      setMergeProgress(100);
    } catch (err) {
      setError(`Ошибка при объединении: ${err.message}`);
    } finally {
      setIsMerging(false);
    }
  };

  // Скачивание объединенного PDF
  const downloadMergedPdf = () => {
    if (!mergedPdfUrl) return;

    const link = document.createElement("a");
    link.href = mergedPdfUrl;
    link.download = mergedFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Форматирование размера файла
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} МБ`;
  };

  // Склонение слова "страница"
  const getPageDeclension = (count) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return "страниц";
    if (lastDigit === 1) return "страница";
    if (lastDigit >= 2 && lastDigit <= 4) return "страницы";
    return "страниц";
  };

  return (
    <div className="min-h-screen">
      <title>Объединить PDF - Полезные инструменты - use-tools.ru</title>
      <meta
        name="description"
        content="Бесплатный онлайн инструмент для объединения PDF файлов. Склейте несколько PDF в один документ быстро и безопасно."
      />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-8">
          {/* Зона загрузки файлов */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100">
              Загрузка PDF файлов
            </h2>

            {/* Drag & Drop зона */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all duration-300
                ${
                  dragOver
                    ? "border-blue-500 bg-blue-50 scale-102 shadow-lg"
                    : "border-blue-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />

              <div className="text-6xl mb-4">📄</div>
              <p className="text-lg font-semibold text-blue-800 mb-2">
                Перетащите PDF файлы сюда
              </p>
              <p className="text-blue-600 mb-4">
                или нажмите для выбора файлов
              </p>
              <p className="text-sm text-blue-400">
                Поддерживаются файлы PDF до 100 МБ каждый
              </p>
            </div>

            {/* Сообщение об ошибке */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start space-x-2">
                  <svg
                    className="w-5 h-5 text-red-500 mt-0.5 shrink-0"
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
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              </div>
            )}
          </div>

          {/* Список загруженных файлов */}
          {files.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-blue-100">
                <h2 className="text-2xl font-bold text-blue-700">
                  Загруженные файлы
                </h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-blue-600">
                    {files.length}{" "}
                    {files.length === 1
                      ? "файл"
                      : files.length < 5
                        ? "файла"
                        : "файлов"}{" "}
                    • {getTotalPages()} {getPageDeclension(getTotalPages())} •{" "}
                    {getTotalSize()}
                  </span>
                  <button
                    onClick={clearAll}
                    className="text-sm text-red-500 hover:text-red-700 underline cursor-pointer"
                  >
                    Очистить всё
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {files.map((file, index) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200 hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="text-3xl shrink-0">📕</div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-blue-800 truncate">
                          {file.name}
                        </p>
                        <p className="text-sm text-blue-500">
                          {formatFileSize(file.size)} • {file.pageCount}{" "}
                          {getPageDeclension(file.pageCount)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-sm text-blue-400 font-medium mr-2">
                        #{index + 1}
                      </span>

                      <button
                        onClick={() => moveFileUp(index)}
                        disabled={index === 0}
                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Переместить вверх"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 15l7-7 7 7"
                          ></path>
                        </svg>
                      </button>

                      <button
                        onClick={() => moveFileDown(index)}
                        disabled={index === files.length - 1}
                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Переместить вниз"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </button>

                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        title="Удалить"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Кнопка объединения */}
              <div className="mt-6">
                <button
                  onClick={mergePdfs}
                  disabled={files.length < 2 || isMerging}
                  className="w-full py-4 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isMerging ? (
                    <span className="flex items-center justify-center space-x-2">
                      <svg
                        className="animate-spin w-5 h-5"
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
                      <span>Объединение... {mergeProgress}%</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                        ></path>
                      </svg>
                      <span>Объединить PDF файлы</span>
                    </span>
                  )}
                </button>
              </div>

              {/* Прогресс бар */}
              {isMerging && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${mergeProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Результат объединения */}
          {mergedPdfUrl && !isMerging && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-200">
              <h2 className="text-2xl font-bold text-green-700 mb-6 pb-3 border-b border-green-100">
                ✅ PDF успешно объединен!
              </h2>

              <div className="">
                {/* Информация о результате */}
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <div className="text-5xl mb-4 text-center">📄</div>
                  <h3 className="font-bold text-green-800 text-lg mb-2 text-center">
                    {mergedFileName}
                  </h3>
                  <div className="text-sm text-green-600 text-center">
                    {files.length} файлов объединено • {getTotalPages()}{" "}
                    {getPageDeclension(getTotalPages())}
                  </div>

                  <div className="mt-4 space-y-2">
                    <button
                      onClick={downloadMergedPdf}
                      className="w-full py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center space-x-2"
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
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                      <span>Скачать PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Информация об инструменте */}
          <div className="bg-linear-to-r from-blue-100 to-cyan-100 p-5 rounded-xl border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-3">
              ℹ️ Об инструменте объединения PDF
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-blue-700 mb-2">
                  Как это работает?
                </h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Загрузите 2 или более PDF файлов</li>
                  <li>• Расположите файлы в нужном порядке</li>
                  <li>• Нажмите "Объединить PDF файлы"</li>
                  <li>• Скачайте готовый объединенный документ</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-blue-700 mb-2">
                  Преимущества
                </h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Все данные обрабатываются локально в браузере</li>
                  <li>• Файлы не загружаются на сервер</li>
                  <li>• Полная конфиденциальность документов</li>
                  <li>• Неограниченное количество операций</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Description_component>
          <p className="font-bold mt-6 text-center">
            📄 Объединить PDF Онлайн | Склеить Несколько PDF в Один Файл
            Бесплатно
          </p>
          <p className="mt-6">
            <strong>Объединить PDF онлайн</strong> — это быстрый и безопасный
            инструмент для склеивания нескольких PDF файлов в один документ. Вам
            больше не нужно устанавливать сложные программы или загружать файлы
            на сомнительные серверы. Наш{" "}
            <strong>бесплатный PDF-конвертер для объединения</strong> работает
            полностью в браузере, обеспечивая максимальную конфиденциальность
            ваших документов.
          </p>
          <p className="mt-6 font-bold">
            Основные возможности инструмента для объединения PDF:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Объединить PDF в один файл</strong> — быстрое склеивание
                документов с сохранением качества
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Изменить порядок страниц</strong> — настройка
                последовательности файлов перед объединением
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Предпросмотр результата</strong> — проверка
                объединенного документа перед скачиванием
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Конфиденциальность данных</strong> — все операции
                выполняются локально на устройстве
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Drag & Drop загрузка</strong> — просто перетащите файлы
                в окно браузера
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Множественная загрузка</strong> — объединяйте десятки
                PDF за один раз
              </span>
            </li>
          </ul>
          <p className="mt-6 font-bold">Когда пригодится объединение PDF:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Документооборот</strong> — объедините сканы договора в
                один файл для отправки
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Отчетность</strong> — соберите несколько отчетов в
                единый документ
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Учеба</strong> — склейте конспекты лекций для удобной
                печати
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Портфолио</strong> — создайте единый файл из нескольких
                работ
              </span>
            </li>
          </ul>
        </Description_component>
      </div>
    </div>
  );
};

export default PdfMerger;
