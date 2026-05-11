import React, { useState, useEffect, useRef } from "react";
import Description_component from "../components/Description_component";

const Notepad = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaved, setIsSaved] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [notes, setNotes] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [showNotesList, setShowNotesList] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState("light");

  const textareaRef = useRef(null);
  const saveTimerRef = useRef(null);
  const notificationTimerRef = useRef(null);

  // Загрузка заметок при монтировании
  useEffect(() => {
    const savedNotes = localStorage.getItem("notepad_notes");
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes);
        setNotes(parsed);

        // Загружаем последнюю активную заметку
        const lastActiveId = localStorage.getItem("notepad_lastActive");
        if (lastActiveId && parsed.find((n) => n.id === lastActiveId)) {
          loadNote(lastActiveId, parsed);
        } else if (parsed.length > 0) {
          loadNote(parsed[0].id, parsed);
        }
      } catch (e) {
        console.error("Ошибка загрузки заметок:", e);
        createNewNote();
      }
    } else {
      createNewNote();
    }

    // Загружаем настройки
    const savedFontSize = localStorage.getItem("notepad_fontSize");
    if (savedFontSize) setFontSize(Number(savedFontSize));

    const savedTheme = localStorage.getItem("notepad_theme");
    if (savedTheme) setTheme(savedTheme);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (notificationTimerRef.current)
        clearTimeout(notificationTimerRef.current);
    };
  }, []);

  // Автосохранение при изменении контента
  useEffect(() => {
    if (!currentNoteId) return;

    setIsSaved(false);

    // Debounce сохранения (500мс после последнего изменения)
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      saveCurrentNote();
    }, 500);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [content, title]);

  // Обновление статистики
  useEffect(() => {
    setCharCount(content.length);
    const words = content.trim() ? content.trim().split(/\s+/) : [];
    setWordCount(words.length);
  }, [content]);

  // Создание новой заметки
  const createNewNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: "Новая заметка",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNotes((prev) => {
      const updated = [newNote, ...prev];
      localStorage.setItem("notepad_notes", JSON.stringify(updated));
      return updated;
    });

    setCurrentNoteId(newNote.id);
    setTitle(newNote.title);
    setContent(newNote.content);
    setIsSaved(true);
    localStorage.setItem("notepad_lastActive", newNote.id);

    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Загрузка заметки
  const loadNote = (noteId, notesList = null) => {
    const allNotes = notesList || notes;
    const note = allNotes.find((n) => n.id === noteId);
    if (!note) return;

    setCurrentNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setIsSaved(true);
    localStorage.setItem("notepad_lastActive", note.id);

    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Сохранение текущей заметки
  const saveCurrentNote = () => {
    if (!currentNoteId) return;

    setNotes((prev) => {
      const updated = prev.map((note) => {
        if (note.id === currentNoteId) {
          return {
            ...note,
            title: title || "Без названия",
            content,
            updatedAt: new Date().toISOString(),
          };
        }
        return note;
      });

      localStorage.setItem("notepad_notes", JSON.stringify(updated));
      return updated;
    });

    setIsSaved(true);
    setLastSaved(new Date());
  };

  // Удаление заметки
  const deleteNote = (noteId) => {
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== noteId);
      localStorage.setItem("notepad_notes", JSON.stringify(updated));

      if (noteId === currentNoteId) {
        if (updated.length > 0) {
          loadNote(updated[0].id, updated);
        } else {
          createNewNote();
        }
      }

      return updated;
    });
  };

  // Скачивание заметки
  const downloadNote = (format = "txt") => {
    if (!currentNoteId) return;

    const note = notes.find((n) => n.id === currentNoteId);
    if (!note) return;

    let text, fileName, mimeType;

    if (format === "txt") {
      text = `${note.title}\n${"=".repeat(note.title.length)}\n\n${note.content}`;
      fileName = `${note.title.replace(/[^a-zA-Zа-яА-Я0-9]/g, "_")}.txt`;
      mimeType = "text/plain;charset=utf-8";
    } else if (format === "md") {
      text = `# ${note.title}\n\n${note.content}`;
      fileName = `${note.title.replace(/[^a-zA-Zа-яА-Я0-9]/g, "_")}.md`;
      mimeType = "text/markdown;charset=utf-8";
    }

    const blob = new Blob([text], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Копирование всего текста
  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      textareaRef.current?.select();
      document.execCommand("copy");
    }
  };

  // Очистка содержимого
  const clearContent = () => {
    if (content && !window.confirm("Очистить содержимое заметки?")) return;
    setContent("");
    if (textareaRef.current) textareaRef.current.focus();
  };

  // Ручное сохранение (Ctrl+S)
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      saveCurrentNote();
    }
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return "Только что";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} мин. назад`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} ч. назад`;

    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Изменение размера шрифта
  const changeFontSize = (delta) => {
    setFontSize((prev) => {
      const newSize = Math.min(24, Math.max(12, prev + delta));
      localStorage.setItem("notepad_fontSize", newSize.toString());
      return newSize;
    });
  };

  // Переключение темы
  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      localStorage.setItem("notepad_theme", newTheme);
      return newTheme;
    });
  };

  // Общий размер всех заметок
  const getTotalSize = () => {
    const totalChars = notes.reduce(
      (sum, n) => sum + n.content.length + n.title.length,
      0,
    );
    if (totalChars < 1024) return `${totalChars} Б`;
    return `${(totalChars / 1024).toFixed(1)} КБ`;
  };

  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : ""}`}>
      <title>Онлайн блокнот - use-tools.ru</title>
      <meta
        name="description"
        content="Бесплатный онлайн блокнот с автосохранением. Заметки хранятся в браузере."
      />

      <div className="max-w-6xl m-auto px-4">
        <div className="grid grid-cols-1 gap-6">
          {/* Панель инструментов */}
          <div
            className={`rounded-2xl mt-4 shadow-xl p-4 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-blue-100"}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xl font-bold ${isDark ? "text-blue-400" : "text-blue-700"}`}
                >
                  📝 Онлайн блокнот
                </span>
                {!isSaved && (
                  <span className="text-yellow-500 text-sm animate-pulse">
                    ● Не сохранено
                  </span>
                )}
                {isSaved && lastSaved && (
                  <span
                    className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Сохранено {formatDate(lastSaved)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Размер шрифта */}
                <button
                  onClick={() => changeFontSize(-2)}
                  className={`p-2 rounded-lg transition-all ${isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} cursor-pointer`}
                  title="Уменьшить шрифт"
                >
                  A-
                </button>
                <span
                  className={`text-sm font-mono w-8 text-center ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  {fontSize}
                </span>
                <button
                  onClick={() => changeFontSize(2)}
                  className={`p-2 rounded-lg transition-all ${isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} cursor-pointer`}
                  title="Увеличить шрифт"
                >
                  A+
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Тема */}
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg transition-all ${isDark ? "bg-gray-700 text-yellow-400 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} cursor-pointer`}
                  title={isDark ? "Светлая тема" : "Тёмная тема"}
                >
                  {isDark ? "☀️" : "🌙"}
                </button>

                {/* Скачать */}
                <button
                  onClick={() => downloadNote("txt")}
                  className={`p-2 rounded-lg transition-all ${isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} cursor-pointer`}
                  title="Скачать TXT"
                >
                  💾
                </button>
                <button
                  onClick={() => downloadNote("md")}
                  className={`p-2 rounded-lg transition-all text-xs font-semibold ${isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} cursor-pointer`}
                  title="Скачать MD"
                >
                  .md
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Копировать */}
                <button
                  onClick={copyAll}
                  className={`p-2 rounded-lg transition-all ${isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} cursor-pointer`}
                  title="Копировать всё"
                >
                  📋
                </button>

                {/* Очистить */}
                <button
                  onClick={clearContent}
                  className={`p-2 rounded-lg transition-all ${isDark ? "bg-gray-700 text-red-400 hover:bg-gray-600" : "bg-gray-100 text-red-500 hover:bg-gray-200"} cursor-pointer`}
                  title="Очистить"
                >
                  🗑️
                </button>

                {/* Список заметок */}
                <button
                  onClick={() => setShowNotesList(!showNotesList)}
                  className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                    showNotesList
                      ? "bg-blue-500 text-white"
                      : isDark
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } cursor-pointer`}
                >
                  📄 Заметки ({notes.length})
                </button>
              </div>
            </div>
          </div>

          {/* Список заметок */}
          {showNotesList && (
            <div
              className={`rounded-2xl shadow-xl p-6 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-blue-100"}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`font-bold text-lg ${isDark ? "text-gray-200" : "text-blue-700"}`}
                >
                  Все заметки ({notes.length}) — {getTotalSize()}
                </h3>
                <button
                  onClick={createNewNote}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold text-sm hover:bg-blue-600 transition-all cursor-pointer"
                >
                  + Новая заметка
                </button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => {
                      loadNote(note.id);
                      setShowNotesList(false);
                    }}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      note.id === currentNoteId
                        ? isDark
                          ? "border-blue-500 bg-blue-900/30"
                          : "border-blue-400 bg-blue-50"
                        : isDark
                          ? "border-gray-700 hover:border-gray-600 bg-gray-750"
                          : "border-gray-100 hover:border-blue-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-semibold truncate ${isDark ? "text-gray-200" : "text-blue-800"}`}
                      >
                        {note.title || "Без названия"}
                      </p>
                      <p
                        className={`text-xs mt-1 truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {note.content?.substring(0, 100) || "Пустая заметка"}
                      </p>
                      <p
                        className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        {formatDate(note.updatedAt)} •{" "}
                        {note.content?.length || 0} симв.
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      className="ml-3 text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all shrink-0 cursor-pointer"
                      title="Удалить"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {notes.length === 0 && (
                  <p
                    className={`text-center py-8 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Нет заметок
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Редактор */}
          <div
            className={`rounded-2xl shadow-xl p-6 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-blue-100"}`}
          >
            {/* Заголовок заметки */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Название заметки..."
              className={`w-full text-2xl font-bold mb-4 pb-3 border-b outline-none ${
                isDark
                  ? "bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-500"
                  : "bg-white text-blue-800 border-blue-100 placeholder-blue-300"
              }`}
            />

            {/* Текст заметки */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Начните писать... (Ctrl+S для сохранения)"
              style={{ fontSize: `${fontSize}px`, lineHeight: "1.6" }}
              className={`w-full min-h-100 resize-y outline-none ${
                isDark
                  ? "bg-gray-800 text-gray-200 placeholder-gray-500"
                  : "bg-white text-gray-800 placeholder-blue-300"
              }`}
            />

            {/* Статистика */}
            <div
              className={`flex flex-wrap items-center justify-between mt-4 pt-3 border-t text-sm ${isDark ? "border-gray-700 text-gray-400" : "border-blue-100 text-blue-500"}`}
            >
              <div className="flex gap-4">
                <span>📝 {wordCount} слов</span>
                <span>🔤 {charCount} символов</span>
                <span>📄 {notes.length} заметок</span>
              </div>
              <span>{isSaved ? "✅ Сохранено" : "⏳ Не сохранено"}</span>
            </div>
          </div>

          {/* Информация */}
          <div
            className={`rounded-xl p-5 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-linear-to-r from-blue-100 to-cyan-100 border-blue-200"}`}
          >
            <h4
              className={`font-bold mb-3 ${isDark ? "text-gray-200" : "text-blue-800"}`}
            >
              ℹ️ О блокноте
            </h4>
            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ${isDark ? "text-gray-400" : "text-blue-700"}`}
            >
              <div>
                <p className="font-semibold mb-2">Возможности:</p>
                <ul className="space-y-1">
                  <li>• Автосохранение в браузере</li>
                  <li>• Работает офлайн</li>
                  <li>• Несколько заметок</li>
                  <li>• Скачивание в TXT и Markdown</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Горячие клавиши:</p>
                <ul className="space-y-1">
                  <li>• Ctrl+S — сохранить</li>
                  <li>• Данные хранятся в localStorage</li>
                  <li>• Не удаляются при перезагрузке</li>
                  <li>• Тёмная/светлая тема</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Description_component>
          <p className="font-bold mt-6 text-center">
            📝 Онлайн Блокнот | Заметки с Автосохранением Бесплатно
          </p>
          <p className="mt-6">
            <strong>Онлайн блокнот</strong> — простой и удобный текстовый
            редактор с автоматическим сохранением. Все заметки хранятся в памяти
            браузера и не пропадают после перезагрузки страницы. Создавайте,
            редактируйте и скачивайте заметки в один клик.
          </p>
        </Description_component>
      </div>
    </div>
  );
};

export default Notepad;
