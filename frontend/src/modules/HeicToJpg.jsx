import React, { useState, useRef, useCallback, useEffect } from "react";
import heic2any from "heic2any";
import Description_component from "../components/Description_component";

const HeicToJpg = () => {
  const [files, setFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(-1);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [quality, setQuality] = useState(0.92);
  const [downloadAllReady, setDownloadAllReady] = useState(false);
  const [showPreview, setShowPreview] = useState(null);
  const [totalOriginalSize, setTotalOriginalSize] = useState(0);
  const [totalConvertedSize, setTotalConvertedSize] = useState(0);
  const fileInputRef = useRef(null);

  // Обработка выбора файлов
  const handleFileSelect = async (selectedFiles) => {
    setError("");
    const fileList = Array.from(selectedFiles);
    
    // Фильтруем только HEIC/HEIF файлы
    const heicFiles = fileList.filter(file => {
      const ext = file.name.toLowerCase().split('.').pop();
      return (
        file.type === "image/heic" ||
        file.type === "image/heif" ||
        file.type === "image/heic-sequence" ||
        file.type === "image/heif-sequence" ||
        ext === "heic" ||
        ext === "heif" ||
        ext === "hif"
      );
    });

    if (heicFiles.length === 0) {
      // Проверяем, есть ли вообще файлы
      if (fileList.length > 0) {
        setError("Выбранные файлы не являются HEIC/HEIF. Пожалуйста, выберите файлы с расширением .heic или .heif");
      }
      return;
    }

    if (heicFiles.length < fileList.length) {
      const nonHeic = fileList.filter(f => !heicFiles.includes(f));
      setError(`Пропущены файлы не HEIC формата: ${nonHeic.map(f => f.name).join(", ")}`);
    }

    // Проверка размера файлов (макс 50 МБ каждый)
    const oversizedFiles = heicFiles.filter(file => file.size > 50 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`Файлы превышают 50 МБ: ${oversizedFiles.map(f => f.name).join(", ")}`);
      return;
    }

    const newFiles = heicFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      originalSize: file.size,
      previewUrl: null,
      status: "pending", // pending, converting, done, error
    }));

    setFiles(prev => [...prev, ...newFiles]);
    setTotalOriginalSize(prev => prev + heicFiles.reduce((sum, f) => sum + f.size, 0));
    setConvertedFiles([]);
    setDownloadAllReady(false);
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
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove) {
      setTotalOriginalSize(prev => prev - fileToRemove.originalSize);
    }
    setFiles(prev => prev.filter(f => f.id !== id));
    setConvertedFiles(prev => prev.filter(f => f.id !== id));
  };

  // Очистка всего
  const clearAll = () => {
    // Очищаем URL объекты
    convertedFiles.forEach(f => {
      if (f.blobUrl) URL.revokeObjectURL(f.blobUrl);
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    files.forEach(f => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    });
    
    setFiles([]);
    setConvertedFiles([]);
    setDownloadAllReady(false);
    setTotalOriginalSize(0);
    setTotalConvertedSize(0);
    setError("");
    setConversionProgress(0);
    setCurrentFileIndex(-1);
  };

  // Конвертация одного файла
  const convertSingleFile = async (fileObj, index, total) => {
    try {
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, status: "converting" } : f
      ));

      const result = await heic2any({
        blob: fileObj.file,
        toType: "image/jpeg",
        quality: quality,
      });

      // heic2any может вернуть Blob или Blob[]
      const jpgBlob = Array.isArray(result) ? result[0] : result;
      
      const url = URL.createObjectURL(jpgBlob);
      const newName = fileObj.name.replace(/\.(heic|heif|hif)$/i, ".jpg");
      
      const convertedFile = {
        id: fileObj.id,
        name: newName,
        originalName: fileObj.name,
        originalSize: fileObj.originalSize,
        convertedSize: jpgBlob.size,
        blob: jpgBlob,
        blobUrl: url,
        status: "done",
        compressionRatio: ((1 - jpgBlob.size / fileObj.originalSize) * 100).toFixed(1),
      };

      setConvertedFiles(prev => [...prev, convertedFile]);
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, status: "done", previewUrl: url } : f
      ));
      setTotalConvertedSize(prev => prev + jpgBlob.size);
      
      return true;
    } catch (err) {
      console.error(`Ошибка конвертации ${fileObj.name}:`, err);
      setFiles(prev => prev.map(f => 
        f.id === fileObj.id ? { ...f, status: "error", errorMessage: err.message } : f
      ));
      return false;
    }
  };

  // Запуск конвертации всех файлов
  const startConversion = async () => {
    if (files.length === 0) {
      setError("Нет файлов для конвертации");
      return;
    }

    const pendingFiles = files.filter(f => f.status === "pending");
    if (pendingFiles.length === 0) {
      setError("Все файлы уже конвертированы");
      return;
    }

    setIsConverting(true);
    setError("");
    setConversionProgress(0);
    setConvertedFiles([]);
    setTotalConvertedSize(0);
    setDownloadAllReady(false);

    const total = pendingFiles.length;
    let successCount = 0;

    for (let i = 0; i < pendingFiles.length; i++) {
      setCurrentFileIndex(i);
      setConversionProgress(Math.round((i / total) * 100));
      
      const success = await convertSingleFile(pendingFiles[i], i, total);
      if (success) successCount++;
    }

    setConversionProgress(100);
    setCurrentFileIndex(-1);
    setIsConverting(false);
    setDownloadAllReady(successCount > 0);

    if (successCount === 0) {
      setError("Не удалось конвертировать ни один файл");
    }
  };

  // Скачивание одного файла
  const downloadFile = (convertedFile) => {
    const link = document.createElement("a");
    link.href = convertedFile.blobUrl;
    link.download = convertedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Скачивание всех файлов
  const downloadAll = () => {
    convertedFiles.forEach((file, index) => {
      setTimeout(() => {
        downloadFile(file);
      }, index * 200);
    });
  };

  // Форматирование размера файла
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Б";
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} МБ`;
  };

  // Получение превью для файла
  const getPreviewUrl = (fileObj) => {
    if (fileObj.previewUrl) return fileObj.previewUrl;
    // Для непревьюнутых файлов создаём URL
    const url = URL.createObjectURL(fileObj.file);
    setFiles(prev => prev.map(f => 
      f.id === fileObj.id ? { ...f, previewUrl: url } : f
    ));
    return url;
  };

  // Очистка URL при размонтировании
  useEffect(() => {
    return () => {
      files.forEach(f => {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      });
      convertedFiles.forEach(f => {
        if (f.blobUrl) URL.revokeObjectURL(f.blobUrl);
      });
    };
  }, []);

  return (
    <div className="min-h-screen">
      <title>HEIC в JPG конвертер - Полезные инструменты - use-tools.ru</title>
      <meta
        name="description"
        content="Бесплатный онлайн конвертер HEIC в JPG. Конвертируйте изображения HEIC с iPhone в формат JPG быстро и безопасно."
      />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-8">
          {/* Зона загрузки */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100">
              Загрузка HEIC файлов
            </h2>

            {/* Drag & Drop зона */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all duration-300
                ${dragOver 
                  ? "border-blue-500 bg-blue-50 scale-102 shadow-lg" 
                  : "border-blue-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".heic,.heif,.hif,image/heic,image/heif,image/heic-sequence,image/heif-sequence"
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
              
              <div className="text-6xl mb-4">🖼️</div>
              <p className="text-lg font-semibold text-blue-800 mb-2">
                Перетащите HEIC файлы сюда
              </p>
              <p className="text-blue-600 mb-4">
                или нажмите для выбора файлов
              </p>
              <p className="text-sm text-blue-400">
                Поддерживаются файлы HEIC/HEIF до 50 МБ каждый
              </p>
            </div>

            {/* Настройка качества */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-blue-700">
                  Качество JPG: {Math.round(quality * 100)}%
                </label>
                <span className="text-xs text-blue-500">
                  {quality >= 0.9 ? "Высокое" : quality >= 0.7 ? "Среднее" : "Низкое"}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.01"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-blue-400 mt-1">
                <span>10% (малый размер)</span>
                <span>100% (лучшее качество)</span>
              </div>
            </div>

            {/* Сообщение об ошибке */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              </div>
            )}
          </div>

          {/* Список файлов */}
          {files.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-blue-100">
                <h2 className="text-2xl font-bold text-blue-700">
                  Файлы ({files.length})
                </h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={clearAll}
                    className="text-sm text-red-500 hover:text-red-700 underline cursor-pointer"
                  >
                    Очистить всё
                  </button>
                </div>
              </div>

              {/* Сетка файлов */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {files.map((fileObj) => {
                  const convertedFile = convertedFiles.find(cf => cf.id === fileObj.id);
                  
                  return (
                    <div
                      key={fileObj.id}
                      className={`
                        relative rounded-xl border-2 overflow-hidden transition-all
                        ${fileObj.status === "done" ? "border-green-300 bg-green-50" :
                          fileObj.status === "error" ? "border-red-300 bg-red-50" :
                          fileObj.status === "converting" ? "border-blue-300 bg-blue-50" :
                          "border-gray-200 bg-white"}
                      `}
                    >
                      {/* Превью */}
                      <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                        {fileObj.status === "done" && convertedFile ? (
                          <img
                            src={convertedFile.blobUrl}
                            alt={fileObj.name}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => setShowPreview(showPreview === fileObj.id ? null : fileObj.id)}
                          />
                        ) : (
                          <>
                            <div className="text-6xl opacity-30">📷</div>
                            {fileObj.status === "converting" && (
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                              </div>
                            )}
                            {fileObj.status === "error" && (
                              <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center">
                                <div className="text-center p-4">
                                  <span className="text-3xl">❌</span>
                                  <p className="text-xs text-red-600 mt-1">Ошибка конвертации</p>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Информация о файле */}
                      <div className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-blue-800 text-sm truncate" title={fileObj.name}>
                              {fileObj.name}
                            </p>
                            <p className="text-xs text-blue-500 mt-1">
                              {formatFileSize(fileObj.originalSize)}
                            </p>
                            
                            {convertedFile && fileObj.status === "done" && (
                              <div className="mt-2 space-y-1">
                                <p className="text-xs text-green-600">
                                  → {formatFileSize(convertedFile.convertedSize)}
                                </p>
                                {parseFloat(convertedFile.compressionRatio) > 0 && (
                                  <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                    -{convertedFile.compressionRatio}%
                                  </span>
                                )}
                                {parseFloat(convertedFile.compressionRatio) < 0 && (
                                  <span className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                    +{Math.abs(convertedFile.compressionRatio)}%
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => removeFile(fileObj.id)}
                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ml-2 cursor-pointer"
                            title="Удалить"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Превью в модальном окне */}
                      {showPreview === fileObj.id && convertedFile && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setShowPreview(null)}>
                          <div className="max-w-4xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
                            <img
                              src={convertedFile.blobUrl}
                              alt={convertedFile.name}
                              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
                            />
                            <div className="absolute top-4 right-4 flex space-x-2">
                              <button
                                onClick={() => downloadFile(convertedFile)}
                                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all cursor-pointer"
                                title="Скачать"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                              </button>
                              <button
                                onClick={() => setShowPreview(null)}
                                className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                                title="Закрыть"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Кнопка конвертации */}
              {files.some(f => f.status === "pending") && (
                <div className="mt-4">
                  <button
                    onClick={startConversion}
                    disabled={isConverting}
                    className="w-full py-4 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-2"
                  >
                    {isConverting ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        <span>Конвертация... {conversionProgress}%</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                        </svg>
                        <span>Конвертировать в JPG</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Прогресс бар */}
              {isConverting && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${conversionProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-sm text-blue-600 mt-2">
                    Конвертация файла {currentFileIndex + 1} из {files.filter(f => f.status === "pending").length + currentFileIndex + 1}...
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Результаты конвертации */}
          {downloadAllReady && convertedFiles.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-200">
              <h2 className="text-2xl font-bold text-green-700 mb-6 pb-3 border-b border-green-100">
                ✅ Конвертация завершена!
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-center">
                  <div className="text-sm text-green-600 mb-1">Конвертировано файлов</div>
                  <div className="text-2xl font-bold text-green-800">{convertedFiles.length}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-center">
                  <div className="text-sm text-blue-600 mb-1">Исходный размер</div>
                  <div className="text-2xl font-bold text-blue-800">{formatFileSize(totalOriginalSize)}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 text-center">
                  <div className="text-sm text-purple-600 mb-1">Итоговый размер</div>
                  <div className="text-2xl font-bold text-purple-800">{formatFileSize(totalConvertedSize)}</div>
                </div>
              </div>

              <button
                onClick={downloadAll}
                className="w-full py-4 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 transition-all shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center space-x-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span>Скачать все JPG</span>
              </button>
            </div>
          )}

          {/* Информация */}
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-5 rounded-xl border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-3">
              ℹ️ О конвертере HEIC в JPG
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-blue-700 mb-2">
                  Что такое HEIC?
                </h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Современный формат изображений Apple</li>
                  <li>• Используется на iPhone и iPad с iOS 11</li>
                  <li>• Обеспечивает лучшее сжатие, чем JPEG</li>
                  <li>• Не всегда поддерживается на других устройствах</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-blue-700 mb-2">
                  Особенности конвертера
                </h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Полностью локальная конвертация в браузере</li>
                  <li>• Файлы не загружаются на сервер</li>
                  <li>• Пакетная обработка нескольких файлов</li>
                  <li>• Настройка качества выходного JPG</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Description_component>
          <p className="font-bold mt-6 text-center">
            📸 Конвертировать HEIC в JPG Онлайн | Бесплатный Конвертер Фото с iPhone
          </p>
          <p className="mt-6">
            <strong>Конвертер HEIC в JPG онлайн</strong> — это удобный и безопасный 
            инструмент для преобразования фотографий формата HEIC в универсальный JPG. 
            Если вы перенесли фото с iPhone на компьютер, но не можете их открыть, 
            наш <strong>бесплатный конвертер HEIC</strong> решит эту проблему за секунды. 
            Вся обработка происходит прямо в браузере — ваши файлы не покидают устройство.
          </p>
          <p className="mt-6 font-bold">
            Преимущества конвертера HEIC в JPG:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Пакетная конвертация</strong> — загружайте и конвертируйте сразу несколько HEIC файлов
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Настройка качества</strong> — выбирайте баланс между размером файла и качеством JPG
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Предпросмотр результата</strong> — просматривайте конвертированные изображения
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Конфиденциальность</strong> — все операции выполняются локально на устройстве
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Drag & Drop</strong> — просто перетащите файлы для загрузки
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Скачивание всех файлов</strong> — загрузите все конвертированные JPG одним кликом
              </span>
            </li>
          </ul>
        </Description_component>
      </div>
    </div>
  );
};

export default HeicToJpg;