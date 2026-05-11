import React, { useState, useRef, useEffect } from "react";
import { removeBackground } from "@imgly/background-removal";
import Description_component from "../components/Description_component";

const BackgroundRemover = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [imageInfo, setImageInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [useAlternativeModel, setUseAlternativeModel] = useState(false);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const processingRef = useRef(false);

  // Загрузка истории
  useEffect(() => {
    const savedHistory = localStorage.getItem("bgRemoverHistory");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {}
    }
  }, []);

  // Обработка выбора файла
  const handleFileSelect = async (selectedFile) => {
    setError("");
    setProcessedImage(null);
    setShowComparison(false);

    const file = selectedFile;

    if (!file || !file.type.startsWith("image/")) {
      setError("Пожалуйста, выберите изображение (JPG, PNG, WEBP)");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError("Размер файла не должен превышать 25 МБ");
      return;
    }

    // Создаём превью
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImageInfo({
          name: file.name,
          size: file.size,
          width: img.width,
          height: img.height,
        });

        setOriginalImage({
          file,
          dataUrl: e.target.result,
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop
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

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Удаление фона с использованием первого метода
  const removeBackgroundMethod1 = async (imageBlob) => {
    setProgressMessage("Загрузка модели (метод 1)...");

    const config = {
      publicPath:
        "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/",
      model: "isnet",
      output: {
        format: "image/png",
        quality: 1,
      },
      progress: (key, current, total) => {
        const percent = Math.round((current / total) * 100);
        setProgress(percent);
        setProgressMessage(`Загрузка модели... ${percent}%`);
      },
    };

    return await removeBackground(imageBlob, config);
  };

  // Удаление фона с использованием второго метода
  const removeBackgroundMethod2 = async (imageBlob) => {
    setProgressMessage("Загрузка модели (метод 2)...");

    const config = {
      publicPath: "https://unpkg.com/@imgly/background-removal@1.4.5/dist/",
      model: "isnet",
      output: {
        format: "image/png",
        quality: 1,
      },
      progress: (key, current, total) => {
        const percent = Math.round((current / total) * 100);
        setProgress(percent);
        setProgressMessage(`Загрузка модели... ${percent}%`);
      },
    };

    return await removeBackground(imageBlob, config);
  };

  // Удаление фона с использованием маленькой модели
  const removeBackgroundMethod3 = async (imageBlob) => {
    setProgressMessage("Загрузка облегчённой модели...");

    const config = {
      model: "small",
      output: {
        format: "image/png",
        quality: 1,
      },
      progress: (key, current, total) => {
        const percent = Math.round((current / total) * 100);
        setProgress(percent);
        setProgressMessage(`Загрузка модели... ${percent}%`);
      },
    };

    return await removeBackground(imageBlob, config);
  };

  // Основная функция удаления фона
  const removeImageBackground = async () => {
    if (!originalImage || processingRef.current) return;

    processingRef.current = true;
    setIsProcessing(true);
    setProgress(0);
    setError("");
    setProcessedImage(null);

    // Конвертируем dataUrl в Blob если нужно
    let imageBlob = originalImage.file;
    if (!imageBlob) {
      try {
        const response = await fetch(originalImage.dataUrl);
        imageBlob = await response.blob();
      } catch (e) {
        setError("Ошибка подготовки изображения");
        setIsProcessing(false);
        processingRef.current = false;
        return;
      }
    }

    // Пробуем разные методы загрузки
    const methods = [
      removeBackgroundMethod1,
      removeBackgroundMethod2,
      removeBackgroundMethod3,
    ];

    let lastError = null;

    for (let i = 0; i < methods.length; i++) {
      try {
        setProgress(0);
        setProgressMessage(`Попытка ${i + 1} из ${methods.length}...`);

        const resultBlob = await Promise.race([
          methods[i](imageBlob),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Таймаут загрузки модели")),
              30000,
            ),
          ),
        ]);

        // Успешно!
        const resultUrl = URL.createObjectURL(resultBlob);

        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = resultUrl;
        });

        setProcessedImage({
          blob: resultBlob,
          url: resultUrl,
          width: img.width,
          height: img.height,
        });

        // Сохраняем в историю
        const historyItem = {
          id: Date.now(),
          originalName: originalImage.file?.name || "image",
          processedUrl: resultUrl,
          thumbnailUrl: originalImage.dataUrl,
          date: new Date().toLocaleDateString("ru-RU"),
          time: new Date().toLocaleTimeString("ru-RU"),
        };

        setHistory((prev) => {
          const newHistory = [historyItem, ...prev].slice(0, 10);
          localStorage.setItem("bgRemoverHistory", JSON.stringify(newHistory));
          return newHistory;
        });

        setIsProcessing(false);
        processingRef.current = false;
        setProgress(100);
        setProgressMessage("Готово!");
        setShowComparison(true);
        return;
      } catch (err) {
        console.warn(`Метод ${i + 1} не сработал:`, err.message);
        lastError = err;

        // Небольшая пауза перед следующей попыткой
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Все методы не сработали
    setError(
      "Не удалось загрузить модель. Возможные причины:\n" +
        "• Проблемы с интернет-соединением\n" +
        "• Блокировка CDN (попробуйте отключить VPN/антивирус)\n" +
        "• Попробуйте обновить страницу и повторить",
    );
    setIsProcessing(false);
    processingRef.current = false;
  };

  // Скачивание результата
  const downloadResult = () => {
    if (!processedImage) return;

    const link = document.createElement("a");
    link.href = processedImage.url;
    const originalName = originalImage?.file?.name || "image";
    const newName =
      originalName.replace(/\.(jpg|jpeg|png|webp|heic|heif)$/i, "") +
      "_без_фона.png";
    link.download = newName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Очистка
  const clearAll = () => {
    if (processedImage?.url) URL.revokeObjectURL(processedImage.url);
    setOriginalImage(null);
    setProcessedImage(null);
    setShowComparison(false);
    setImageInfo(null);
    setError("");
    setProgress(0);
    setProgressMessage("");
  };

  // Очистка истории
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("bgRemoverHistory");
  };

  // Форматирование размера
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Б";
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} МБ`;
  };

  // Рисование сравнения
  useEffect(() => {
    if (
      showComparison &&
      originalImage &&
      processedImage &&
      canvasRef.current
    ) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const originalImg = new Image();
      originalImg.crossOrigin = "anonymous";
      originalImg.src = originalImage.dataUrl;

      const processedImg = new Image();
      processedImg.crossOrigin = "anonymous";
      processedImg.src = processedImage.url;

      let loadedCount = 0;

      const drawComparison = () => {
        loadedCount++;
        if (loadedCount < 2) return;

        const maxWidth = 600;
        const maxHeight = 400;
        let width = Math.min(originalImg.width, maxWidth);
        let height = (width / originalImg.width) * originalImg.height;

        if (height > maxHeight) {
          height = maxHeight;
          width = (height / originalImg.height) * originalImg.width;
        }

        canvas.width = width;
        canvas.height = height;

        // Шахматный фон
        const patternSize = 10;
        for (let y = 0; y < height; y += patternSize) {
          for (let x = 0; x < width; x += patternSize) {
            ctx.fillStyle =
              (Math.floor(x / patternSize) + Math.floor(y / patternSize)) %
                2 ===
              0
                ? "#e5e5e5"
                : "#ffffff";
            ctx.fillRect(x, y, patternSize, patternSize);
          }
        }

        // Оригинал слева
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, width * (sliderPosition / 100), height);
        ctx.clip();
        ctx.drawImage(originalImg, 0, 0, width, height);
        ctx.restore();

        // Обработанное справа
        ctx.save();
        ctx.beginPath();
        ctx.rect(
          width * (sliderPosition / 100),
          0,
          width * (1 - sliderPosition / 100),
          height,
        );
        ctx.clip();
        ctx.drawImage(processedImg, 0, 0, width, height);
        ctx.restore();

        // Линия разделения
        const lineX = width * (sliderPosition / 100);
        ctx.beginPath();
        ctx.moveTo(lineX, 0);
        ctx.lineTo(lineX, height);
        ctx.strokeStyle = "#3B82F6";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Метки
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(10, height - 30, 80, 22);
        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.fillText("Оригинал", 16, height - 14);

        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(width - 90, height - 30, 80, 22);
        ctx.fillStyle = "white";
        ctx.fillText("Без фона", width - 84, height - 14);
      };

      originalImg.onload = drawComparison;
      processedImg.onload = drawComparison;
    }
  }, [showComparison, sliderPosition, originalImage, processedImage]);

  return (
    <div className="min-h-screen">
      <title>Удалить фон с фото - use-tools.ru</title>
      <meta
        name="description"
        content="Бесплатное удаление фона с изображения онлайн. Нейросеть вырежет фон и сохранит PNG с прозрачностью."
      />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-8">
          {/* Загрузка */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100 text-center">
              ✂️ Удаление фона с изображения
            </h2>

            {!originalImage ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all duration-300
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
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files[0] && handleFileSelect(e.target.files[0])
                  }
                  className="hidden"
                />

                <div className="text-7xl mb-4">🖼️</div>
                <p className="text-lg font-semibold text-blue-800 mb-2">
                  Перетащите изображение сюда
                </p>
                <p className="text-blue-600 mb-4">
                  или нажмите для выбора файла
                </p>
                <p className="text-sm text-blue-400">JPG, PNG, WEBP до 25 МБ</p>
              </div>
            ) : (
              <div>
                {/* Сравнение */}
                {showComparison && processedImage && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-blue-700">
                        Сравнение результата
                      </h3>
                      <span className="text-sm text-blue-500">
                        Передвиньте ползунок
                      </span>
                    </div>

                    <div className="relative rounded-xl overflow-hidden border border-blue-200 max-w-2xl mx-auto bg-gray-100">
                      <canvas ref={canvasRef} className="w-full" />
                    </div>

                    <div className="max-w-2xl mx-auto mt-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderPosition}
                        onChange={(e) =>
                          setSliderPosition(Number(e.target.value))
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* Прогресс */}
                {isProcessing && (
                  <div className="max-w-md mx-auto mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                      <div
                        className="bg-blue-500 h-4 rounded-full transition-all duration-300 relative overflow-hidden"
                        style={{ width: `${Math.max(progress, 5)}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                    <p className="text-center text-blue-600 text-sm">
                      {progressMessage}
                    </p>
                    <p className="text-center text-blue-400 text-xs mt-2">
                      Первая загрузка может занять до минуты
                    </p>
                  </div>
                )}

                {/* Кнопки */}
                <div className="flex flex-wrap justify-center gap-4">
                  {!isProcessing && !processedImage && (
                    <button
                      onClick={removeImageBackground}
                      className="px-10 py-4 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg cursor-pointer"
                    >
                      ✂️ Удалить фон
                    </button>
                  )}

                  {processedImage && (
                    <>
                      <button
                        onClick={downloadResult}
                        className="px-8 py-4 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 transition-all shadow-lg cursor-pointer flex items-center space-x-2"
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
                        <span>Скачать PNG</span>
                      </button>

                      <button
                        onClick={clearAll}
                        className="px-8 py-4 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg cursor-pointer"
                      >
                        📤 Новое фото
                      </button>
                    </>
                  )}

                  {!isProcessing && (
                    <button
                      onClick={clearAll}
                      className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all cursor-pointer"
                    >
                      🗑️ Очистить
                    </button>
                  )}
                </div>

                {/* Инфо */}
                {imageInfo && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200 max-w-md mx-auto">
                    <p className="text-sm text-blue-700">
                      <strong>Файл:</strong> {imageInfo.name}
                    </p>
                    <p className="text-sm text-blue-700">
                      <strong>Размер:</strong> {formatFileSize(imageInfo.size)}{" "}
                      | {imageInfo.width}×{imageInfo.height}px
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Ошибка */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start space-x-2">
                  <span className="text-red-500 text-lg flex-shrink-0">⚠️</span>
                  <p className="text-red-700 text-sm whitespace-pre-line">
                    {error}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* История */}
          {history.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-blue-100">
                <h2 className="text-2xl font-bold text-blue-700">
                  📁 История обработки
                </h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                  >
                    {showHistory ? "Скрыть" : "Показать"}
                  </button>
                  <button
                    onClick={clearHistory}
                    className="text-sm text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    Очистить историю
                  </button>
                </div>
              </div>

              {showHistory && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {history.map((item) => (
                    <div key={item.id} className="group relative">
                      <div
                        className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100"
                        style={{
                          backgroundImage: `
                            linear-gradient(45deg, #e5e5e5 25%, transparent 25%),
                            linear-gradient(-45deg, #e5e5e5 25%, transparent 25%),
                            linear-gradient(45deg, transparent 75%, #e5e5e5 75%),
                            linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)
                          `,
                          backgroundSize: "12px 12px",
                          backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0px",
                        }}
                      >
                        <img
                          src={item.processedUrl}
                          alt="Результат"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-xs text-blue-600 mt-1 truncate">
                        {item.originalName}
                      </p>
                      <p className="text-xs text-gray-400">{item.date}</p>
                      <a
                        href={item.processedUrl}
                        download={item.originalName.replace(
                          /\.\w+$/,
                          "_без_фона.png",
                        )}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                      >
                        <span className="bg-white text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold">
                          💾 Скачать
                        </span>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Информация */}
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-5 rounded-xl border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-3">ℹ️ Информация</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-blue-700 mb-2">
                  Как работает?
                </h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Нейросеть определяет объект и удаляет фон</li>
                  <li>• Используется модель ISNet (высокое качество)</li>
                  <li>• При проблемах — облегчённая модель small</li>
                  <li>• Результат: PNG с прозрачным фоном</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-blue-700 mb-2">
                  Возможные проблемы
                </h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Первая загрузка модели: 30-60 сек</li>
                  <li>• При ошибке попробуйте отключить VPN</li>
                  <li>• Некоторые антивирусы блокируют CDN</li>
                  <li>• Попробуйте другой браузер (Chrome/Firefox)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Description_component>
          <p className="font-bold mt-6 text-center">
            ✂️ Удалить Фон с Фото Онлайн | Нейросеть Бесплатно
          </p>
          <p className="mt-6">
            <strong>Удаление фона с изображения онлайн</strong> — инструмент на
            основе нейросети для автоматического вырезания фона. Бесплатно, без
            регистрации, с обработкой прямо в браузере.
          </p>
        </Description_component>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default BackgroundRemover;
