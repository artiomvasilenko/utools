import React, { useState, useCallback, useEffect, useRef } from "react";
import Description_component from "../components/Description_component";

const NicknameGenerator = () => {
  const [generatedNicknames, setGeneratedNicknames] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [count, setCount] = useState(10);
  const [maxLength, setMaxLength] = useState(15);
  const [minLength, setMinLength] = useState(4);
  const [style, setStyle] = useState("mixed"); // mixed, cool, funny, fantasy, russian, english
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [startWith, setStartWith] = useState("");
  const [endWith, setEndWith] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [history, setHistory] = useState([]);
  const resultsRef = useRef(null);

  // Базы слов для генерации
  const wordBases = {
    cool: {
      prefixes: [
        // Оригинальные
        "Neo",
        "Cyber",
        "Shadow",
        "Blade",
        "Storm",
        "Frost",
        "Dark",
        "Night",
        "Star",
        "Ghost",
        "Zero",
        "Omega",
        "Ultra",
        "Mega",
        "Hyper",
        "Turbo",
        "Quantum",
        "Atomic",
        "Cosmic",
        "Void",
        // Новые (футуристичные, агрессивные, технологичные)
        "Razor",
        "Cipher",
        "Onyx",
        "Vector",
        "Prism",
        "Hex",
        "Nova",
        "Pulse",
        "Zenith",
        "Apex",
        "Rune",
        "Rebel",
        "Havoc",
        "Psycho",
        "Venom",
        "Crisis",
        "Titan",
        "Rogue",
        "Raptor",
        "Dynamo",
        "Cryo",
        "Nitro",
        "Photon",
        "Warp",
        "Cortex",
        "Vapor",
        "Fang",
        "Claw",
        "Wraith",
        "Specter",
        "Echo",
        "Grim",
        "Thorn",
        "Abyss",
        "Vyper",
        "Knight",
        "Reign",
        "Haze",
        "Savage",
        "Xenon",
      ],
      suffixes: [
        // Оригинальные
        "X",
        "ster",
        "oid",
        "ex",
        "us",
        "or",
        "ax",
        "ix",
        "on",
        "um",
        "er",
        "onix",
        "azor",
        "enix",
        "oid",
        "ex",
        "us",
        "or",
        "ax",
        "ix",
        // Новые (резкие, технологичные окончания)
        "er",
        "zor",
        "tron",
        "noid",
        "tek",
        "wave",
        "byte",
        "ark",
        "eon",
        "ent",
        "ash",
        "yx",
        "ar",
        "axx",
        "okk",
        "ulk",
        "isk",
        "antz",
        "org",
        "exx",
        "uzz",
        "azz",
        "ixx",
        "oxx",
        "tix",
        "vax",
        "rex",
        "dex",
        "nox",
        "lux",
        "kre",
        "dox",
        "syn",
        "ian",
        "oidz",
        "yxx",
        "aak",
        "isk",
        "orn",
        "usk",
      ],
      middles: [
        // Оригинальные
        "killer",
        "hunter",
        "master",
        "slayer",
        "warrior",
        "dragon",
        "phoenix",
        "wolf",
        "raven",
        "tiger",
        // Новые (связанные с силой, скоростью, опасностью)
        "storm",
        "blade",
        "reaper",
        "ghost",
        "demon",
        "angel",
        "cyborg",
        "assassin",
        "bandit",
        "ronin",
        "viper",
        "cobra",
        "panther",
        "hawk",
        "shark",
        "spider",
        "scorpion",
        "hornet",
        "reaver",
        "warlock",
        "ninja",
        "samurai",
        "pirate",
        "raider",
        "vandal",
        "mutant",
        "goblin",
        "troll",
        "wizard",
        "sorcerer",
      ],
    },
    fantasy: {
      prefixes: [
        // Оригинальные
        "Aer",
        "Eld",
        "Fael",
        "Glyn",
        "Illy",
        "Kael",
        "Lor",
        "Myr",
        "Nym",
        "Ori",
        "Pyr",
        "Quel",
        "Rhy",
        "Syl",
        "Thal",
        "Vaer",
        "Wyn",
        "Xyl",
        "Yll",
        "Zeph",
        // Новые (эльфийские, магические, древние)
        "Anar",
        "Cele",
        "Dae",
        "Eär",
        "Fëa",
        "Gala",
        "Hith",
        "Ithil",
        "Lómi",
        "Mith",
        "Naur",
        "Osto",
        "Ring",
        "Súl",
        "Taur",
        "Uial",
        "Vilya",
        "Wing",
        "Yáv",
        "Alqua",
        "Brith",
        "Cael",
        "Duin",
        "Elen",
        "Fuin",
        "Gil",
        "Hyar",
        "Laeg",
        "Mall",
        "Nim",
        "Orn",
        "Parth",
        "Roch",
        "Sir",
        "Tol",
        "Uilos",
        "Varn",
        "Wilw",
        "Yul",
        "Aran",
      ],
      suffixes: [
        // Оригинальные
        "ion",
        "wyn",
        "dor",
        "mir",
        "ras",
        "thir",
        "viel",
        "wynn",
        "drel",
        "fir",
        "lor",
        "nor",
        "rin",
        "sil",
        "thor",
        "var",
        "wen",
        "xis",
        "yr",
        "zar",
        // Новые (певучие, древние окончания)
        "ael",
        "iel",
        "uial",
        "rien",
        "dil",
        "los",
        "moth",
        "rond",
        "wing",
        "lass",
        "born",
        "ion",
        "ond",
        "il",
        "uine",
        "alph",
        "adan",
        "eg",
        "rim",
        "hoth",
        "dae",
        "loth",
        "gorn",
        "bain",
        "chil",
        "duin",
        "fain",
        "had",
        "iant",
        "lain",
        "glin",
        "anor",
        "dúr",
        "dol",
        "ost",
        "lond",
        "rant",
        "sar",
        "thang",
        "rost",
      ],
      middles: [
        // Оригинальные
        "star",
        "moon",
        "wind",
        "fire",
        "water",
        "earth",
        "shadow",
        "light",
        "storm",
        "dream",
        // Новые (природные и мистические явления)
        "sun",
        "sky",
        "mist",
        "frost",
        "thunder",
        "forest",
        "river",
        "ocean",
        "mountain",
        "crystal",
        "spirit",
        "soul",
        "rune",
        "spell",
        "magic",
        "fate",
        "hope",
        "doom",
        "song",
        "whisper",
        "dawn",
        "dusk",
        "leaf",
        "thorn",
        "rose",
        "lily",
        "ivy",
        "oak",
        "ash",
        "elm",
      ],
    },
    russian: {
      prefixes: [
        // Оригинальные
        "Бес",
        "Бур",
        "Вих",
        "Гро",
        "Дро",
        "Жар",
        "Зве",
        "Кре",
        "Лед",
        "Мол",
        "Ноч",
        "Огн",
        "Пла",
        "Рок",
        "Сме",
        "Тен",
        "Ура",
        "Хра",
        "Што",
        "Яро",
        // Новые (суровые, звучные, славянские корни)
        "Бро",
        "Вет",
        "Глу",
        "Гро",
        "Дик",
        "Дух",
        "Жег",
        "Зло",
        "Иск",
        "Кру",
        "Лют",
        "Мра",
        "Неб",
        "Пыл",
        "Рев",
        "Рья",
        "Сви",
        "Сту",
        "Тре",
        "Тьма",
        "Хла",
        "Чер",
        "Шал",
        "Щед",
        "Яри",
        "Лом",
        "Руб",
        "Жат",
        "Пра",
        "Сла",
        "Гра",
        "Зла",
        "Кро",
        "Све",
        "Тих",
        "Хме",
        "Чуд",
        "Бла",
        "Мог",
        "Дре",
      ],
      suffixes: [
        // Оригинальные
        "ник",
        "щик",
        "ец",
        "ак",
        "яр",
        "арь",
        "ун",
        "ист",
        "ер",
        "ор",
        "ан",
        "ин",
        "ов",
        "ев",
        "ский",
        "ной",
        "кий",
        "лый",
        "щий",
        "вой",
        // Новые (разнообразные русские суффиксы)
        "ич",
        "ыч",
        "як",
        "юк",
        "ух",
        "ах",
        "юг",
        "аг",
        "иг",
        "ыг",
        "ель",
        "аль",
        "оль",
        "уль",
        "ыль",
        "ень",
        "онь",
        "унь",
        "инь",
        "ынь",
        "аст",
        "ист",
        "ест",
        "ост",
        "уст",
        "ат",
        "ит",
        "ет",
        "от",
        "ут",
        "ав",
        "ив",
        "ев",
        "ов",
        "ув",
        "аш",
        "иш",
        "еш",
        "ош",
        "уш",
      ],
      middles: [
        // Оригинальные
        "слав",
        "мир",
        "волк",
        "град",
        "дар",
        "свет",
        "полк",
        "бор",
        "мысл",
        "гор",
        // Новые (значимые славянские корни)
        "люб",
        "рад",
        "бог",
        "воин",
        "меч",
        "стан",
        "влад",
        "яр",
        "люд",
        "твор",
        "зор",
        "вед",
        "вер",
        "дел",
        "жир",
        "лав",
        "мол",
        "ряд",
        "сад",
        "суд",
        "хвал",
        "цвет",
        "чар",
        "чуд",
        "шед",
        "яр",
        "буж",
        "гон",
        "жиг",
        "клад",
      ],
    },
    english: {
      prefixes: [
        // Оригинальные
        "Brain",
        "Cloud",
        "Dream",
        "Fire",
        "Gold",
        "Ice",
        "King",
        "Light",
        "Mind",
        "Night",
        "Ocean",
        "Power",
        "Quick",
        "Rain",
        "Snow",
        "Thun",
        "Wind",
        "Star",
        "Moon",
        "Sun",
        // Новые (эпичные, природные, яркие)
        "Storm",
        "Stone",
        "Iron",
        "Steel",
        "Crystal",
        "Silver",
        "Shadow",
        "Spirit",
        "Frost",
        "Thorn",
        "Hawk",
        "Wolf",
        "Bear",
        "Lion",
        "Fox",
        "Falcon",
        "Raven",
        "Eagle",
        "Tiger",
        "Panther",
        "Wild",
        "Brave",
        "Dark",
        "Bright",
        "Swift",
        "Silent",
        "Mystic",
        "Noble",
        "Rogue",
        "Rebel",
        "Deep",
        "High",
        "Ancient",
        "Lost",
        "Lone",
        "Fallen",
        "Rising",
        "Frozen",
        "Broken",
        "Sacred",
      ],
      suffixes: [
        // Оригинальные
        "storm",
        "wing",
        "heart",
        "soul",
        "mind",
        "fire",
        "ice",
        "wave",
        "dust",
        "blade",
        "stone",
        "wood",
        "field",
        "ford",
        "shire",
        "worth",
        "berg",
        "ville",
        "ton",
        "ham",
        // Новые (характерные английские окончания)
        "light",
        "shadow",
        "guard",
        "bane",
        "born",
        "forge",
        "song",
        "spear",
        "shield",
        "helm",
        "mark",
        "fall",
        "rise",
        "deep",
        "hollow",
        "dale",
        "glen",
        "moor",
        "wick",
        "stead",
        "thorn",
        "mere",
        "gate",
        "bridge",
        "wood",
        "croft",
        "cliff",
        "haven",
        "watch",
        "keep",
        "vale",
        "brook",
        "crest",
        "cairn",
        "point",
        "shore",
        "port",
        "mount",
        "peak",
        "lane",
      ],
      middles: [
        // Оригинальные
        "storm",
        "fire",
        "wolf",
        "hawk",
        "bear",
        "lion",
        "eagle",
        "fox",
        "owl",
        "deer",
        // Новые (звери, сила, явления)
        "thunder",
        "lightning",
        "shadow",
        "warrior",
        "dragon",
        "raven",
        "falcon",
        "serpent",
        "titan",
        "giant",
        "spirit",
        "heart",
        "sword",
        "shield",
        "crown",
        "flame",
        "frost",
        "wind",
        "river",
        "moon",
        "tiger",
        "panther",
        "badger",
        "otter",
        "boar",
        "elk",
        "heron",
        "wren",
        "lark",
        "dove",
      ],
    },
    funny: {
      prefixes: [
        // Оригинальные
        "Пушистый",
        "Весёлый",
        "Сонный",
        "Голодный",
        "Ленивый",
        "Чудной",
        "Добрый",
        "Злой",
        "Хитрый",
        "Быстрый",
        "Квадратный",
        "Круглый",
        "Мокрый",
        "Сухой",
        "Колючий",
        "Скользкий",
        "Ушастый",
        "Хвостатый",
        "Зубастый",
        "Рогатый",
        // Новые (абсурдные, милые, смешные прилагательные)
        "Ворчливый",
        "Плюшевый",
        "Резиновый",
        "Блестящий",
        "Вкусный",
        "Кислый",
        "Сладкий",
        "Солёный",
        "Жареный",
        "Варёный",
        "Летающий",
        "Прыгучий",
        "Ползучий",
        "Моргающий",
        "Чихающий",
        "Икающий",
        "Сопящий",
        "Храпящий",
        "Зевающий",
        "Бормочущий",
        "Космический",
        "Подводный",
        "Подземный",
        "Чердачный",
        "Диванный",
        "Балконный",
        "Кухонный",
        "Офисный",
        "Гаражный",
        "Домашний",
        "Лохматый",
        "Лысый",
        "Кудрявый",
        "Пятнистый",
        "Полосатый",
        "Клетчатый",
        "Цветастый",
        "Кирпичный",
        "Бетонный",
        "Надувной",
      ],
      suffixes: [
        // Оригинальные
        "Кот",
        "Пёс",
        "Енот",
        "Хомяк",
        "Лис",
        "Волк",
        "Медведь",
        "Заяц",
        "Бегемот",
        "Жираф",
        "Пингвин",
        "Слон",
        "Крот",
        "Бобёр",
        "Суслик",
        "Барсук",
        "Ёж",
        "Уж",
        "Чиж",
        "Стриж",
        // Новые (нелепые животные и существа)
        "Капибара",
        "Ленивец",
        "Утконос",
        "Опоссум",
        "Манул",
        "Квокка",
        "Аксолотль",
        "Панда",
        "Коала",
        "Вомбат",
        "Динозавр",
        "Дракон",
        "Гоблин",
        "Тролль",
        "Смурф",
        "Чебурашка",
        "Покемон",
        "Киберкот",
        "Робопёс",
        "Интернет",
        "Чайник",
        "Тортик",
        "Пельмень",
        "Огурец",
        "Арбуз",
        "Банан",
        "Кактус",
        "Веник",
        "Тапок",
        "Носок",
        "Магнит",
        "Фонарик",
        "Шнурок",
        "Будильник",
        "Пылесос",
        "Компот",
        "Кекс",
        "Пончик",
        "Блинчик",
        "Сырник",
      ],
      middles: ["и", "а", "о", "е", "у", "ю", "я", "э", "ы", "ё"], // Оставил как есть, так как это связки и их бесконечно не расширишь
    },
    mixed: {
      prefixes: [
        // Из cool (добавлены новые)
        "Neo",
        "Cyber",
        "Shadow",
        "Blade",
        "Storm",
        "Dark",
        "Star",
        "Ghost",
        "Nova",
        "Cipher",
        // Из fantasy (добавлены новые)
        "Aer",
        "Eld",
        "Fael",
        "Myr",
        "Syl",
        "Zeph",
        "Anar",
        "Cele",
        "Mith",
        "Ithil",
        // Из russian (транслит, добавлены новые)
        "Bes",
        "Bur",
        "Vih",
        "Gro",
        "Led",
        "Mol",
        "Noch",
        "Ura",
        "Mra",
        "Rev",
        // Из english (добавлены новые)
        "Brain",
        "Cloud",
        "Dream",
        "Fire",
        "Ice",
        "Light",
        "Night",
        "Star",
        "Storm",
        "Steel",
        // Экзотическое миксы
        "Zen",
        "Ronin",
        "Yakuza",
        "Ninja",
        "Kaiju",
        "Senshi",
        "Okami",
        "Kaze",
        "Mizu",
        "Rai",
      ],
      suffixes: [
        // Из cool (добавлены новые)
        "X",
        "ster",
        "oid",
        "ex",
        "us",
        "or",
        "onix",
        "tron",
        "tek",
        "zor",
        // Из fantasy (добавлены новые)
        "ion",
        "wyn",
        "dor",
        "mir",
        "ras",
        "thir",
        "ael",
        "iel",
        "loth",
        "rien",
        // Из russian (транслит, добавлены новые)
        "nik",
        "er",
        "an",
        "in",
        "ov",
        "sky",
        "ich",
        "ak",
        "onok",
        "ushka",
        // Из english (добавлены новые)
        "storm",
        "wing",
        "heart",
        "fire",
        "wave",
        "blade",
        "stone",
        "bane",
        "mark",
        "guard",
        // Смешанные окончания
        "berg",
        "stein",
        "opol",
        "grad",
        "burg",
        "land",
        "stan",
        "polis",
        "heim",
        "gard",
      ],
      middles: [
        // Из cool (добавлены новые)
        "killer",
        "hunter",
        "master",
        "dragon",
        "phoenix",
        "wolf",
        "raven",
        "reaper",
        "assassin",
        "ronin",
        // Из fantasy (добавлены новые)
        "star",
        "moon",
        "wind",
        "fire",
        "shadow",
        "light",
        "storm",
        "dawn",
        "spirit",
        "rune",
        // Из russian (транслит, добавлены новые)
        "slav",
        "mir",
        "volk",
        "dar",
        "svet",
        "bor",
        "lyub",
        "rad",
        "voin",
        "mech",
        // Из english (добавлены новые)
        "storm",
        "fire",
        "wolf",
        "hawk",
        "bear",
        "lion",
        "eagle",
        "thunder",
        "warrior",
        "giant",
        // Межкультурные мидлы
        "samurai",
        "sushi",
        "ramen",
        "manga",
        "anime",
        "vodka",
        "balalaika",
        "borshch",
        "tsar",
        "kremlin",
      ],
    },
  };
  // Дополнительные элементы
  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const symbols = ["_", "-", ".", "~"];

  // Генерация случайного элемента из массива
  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Генерация случайного числа
  const randomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // Очистка никнейма
  const cleanNickname = (nick) => {
    return nick
      .replace(/_+/g, "_")
      .replace(/-+/g, "-")
      .replace(/\.+/g, ".")
      .replace(/_{2,}/g, "_")
      .replace(/-{2,}/g, "-")
      .replace(/\.{2,}/g, ".")
      .replace(/^[_.-]+|[_.-]+$/g, "");
  };

  // Генерация одного никнейма
  const generateOne = useCallback(() => {
    const bases = wordBases[style] || wordBases.mixed;

    let nickname = "";
    const pattern = randomNumber(0, 4);

    switch (pattern) {
      case 0: // Префикс + суффикс
        nickname = randomItem(bases.prefixes) + randomItem(bases.suffixes);
        break;
      case 1: // Префикс + середина + суффикс
        nickname =
          randomItem(bases.prefixes) +
          randomItem(bases.middles) +
          randomItem(bases.suffixes);
        break;
      case 2: // Середина + суффикс
        nickname = randomItem(bases.middles) + randomItem(bases.suffixes);
        break;
      case 3: // Префикс + середина
        nickname = randomItem(bases.prefixes) + randomItem(bases.middles);
        break;
      case 4: // Два префикса
        nickname =
          randomItem(bases.prefixes) + randomItem(bases.prefixes).toLowerCase();
        break;
      default:
        nickname = randomItem(bases.prefixes) + randomItem(bases.suffixes);
    }

    // Добавление чисел
    if (includeNumbers && Math.random() < 0.7) {
      const numCount = Math.random() < 0.3 ? 2 : 1;
      let nums = "";
      for (let i = 0; i < numCount; i++) {
        nums += randomItem(numbers);
      }

      const numPos = Math.random();
      if (numPos < 0.4) {
        nickname = nickname + nums;
      } else if (numPos < 0.8) {
        nickname = nickname + "_" + nums;
      } else {
        nickname = nums + "_" + nickname;
      }
    }

    // Добавление символов
    if (includeSymbols && Math.random() < 0.4) {
      const symbol = randomItem(symbols);
      if (Math.random() < 0.5) {
        nickname = nickname + symbol + randomItem(bases.prefixes).toLowerCase();
      } else {
        nickname = randomItem(bases.prefixes).toLowerCase() + symbol + nickname;
      }
    }

    // Добавление пользовательского начала
    if (startWith && Math.random() < 0.8) {
      nickname = startWith + nickname.toLowerCase();
    }

    // Добавление пользовательского конца
    if (endWith && Math.random() < 0.8) {
      nickname = nickname + endWith.toLowerCase();
    }

    // Ограничение длины
    if (nickname.length > maxLength) {
      nickname = nickname.substring(0, maxLength);
    }

    // Очистка
    nickname = cleanNickname(nickname);

    // Если слишком короткий, добавляем ещё
    if (nickname.length < minLength) {
      const additional =
        randomItem(bases.prefixes) + randomItem(bases.suffixes);
      nickname = (nickname + additional).substring(0, maxLength);
      nickname = cleanNickname(nickname);
    }

    // Делаем первую букву заглавной (для стилей с латиницей)
    if (["cool", "fantasy", "english"].includes(style)) {
      nickname =
        nickname.charAt(0).toUpperCase() + nickname.slice(1).toLowerCase();
    }

    return nickname;
  }, [
    style,
    includeNumbers,
    includeSymbols,
    startWith,
    endWith,
    maxLength,
    minLength,
  ]);

  // Генерация списка никнеймов
  const generateNicknames = useCallback(() => {
    if (minLength > maxLength) {
      setError("Минимальная длина не может быть больше максимальной");
      return;
    }

    if (count < 1 || count > 50) {
      setError("Количество никнеймов должно быть от 1 до 50");
      return;
    }

    setError("");
    setIsGenerating(true);
    setCopiedIndex(null);

    // Имитация задержки для анимации
    setTimeout(() => {
      const nicknames = new Set();
      let attempts = 0;
      const maxAttempts = count * 10;

      while (nicknames.size < count && attempts < maxAttempts) {
        const nick = generateOne();
        if (nick.length >= minLength && nick.length <= maxLength) {
          nicknames.add(nick);
        }
        attempts++;
      }

      const result = Array.from(nicknames).slice(0, count);
      setGeneratedNicknames(result);
      setHistory((prev) =>
        [
          {
            id: Date.now(),
            nicknames: result,
            style,
            time: new Date().toLocaleTimeString(),
          },
          ...prev,
        ].slice(0, 10),
      );
      setIsGenerating(false);
    }, 300);
  }, [count, minLength, maxLength, generateOne, style]);

  // Генерация при изменении параметров (только когда включен расширенный режим)
  useEffect(() => {
    if (showAdvanced) {
      const timer = setTimeout(() => {
        generateNicknames();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [style, includeNumbers, includeSymbols, showAdvanced, generateNicknames]);

  // Копирование в буфер обмена
  const copyToClipboard = async (nickname, index) => {
    try {
      await navigator.clipboard.writeText(nickname);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = nickname;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  // Копировать все никнеймы
  const copyAll = async () => {
    const text = generatedNicknames.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex("all");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedIndex("all");
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  // Добавление в избранное
  const toggleFavorite = (nickname) => {
    setFavorites((prev) => {
      if (prev.includes(nickname)) {
        return prev.filter((n) => n !== nickname);
      }
      return [...prev, nickname];
    });
  };

  // Проверка, в избранном ли никнейм
  const isFavorite = (nickname) => favorites.includes(nickname);

  // Экспорт избранного
  const exportFavorites = () => {
    if (favorites.length === 0) return;
    const text = favorites.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "favorite_nicknames.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Оценка крутости никнейма (для визуального отображения)
  const getNicknameRating = (nickname) => {
    let score = 0;
    if (nickname.length >= 8 && nickname.length <= 12) score += 2;
    if (/[A-Z]/.test(nickname) && /[a-z]/.test(nickname)) score += 2;
    if (/\d/.test(nickname)) score += 1;
    if (/[._\-~]/.test(nickname)) score += 1;
    if (/^[A-Z]/.test(nickname)) score += 1;

    const uniqueChars = new Set(nickname.toLowerCase().split(""));
    if (uniqueChars.size >= 6) score += 1;

    if (score >= 6) return { stars: 5, color: "text-yellow-500" };
    if (score >= 4) return { stars: 4, color: "text-purple-500" };
    if (score >= 3) return { stars: 3, color: "text-blue-500" };
    return { stars: 2, color: "text-gray-400" };
  };

  // Стили никнеймов
  const styles = [
    { id: "cool", name: "🔥 Крутые", icon: "😎", desc: "Для геймеров и профи" },
    {
      id: "fantasy",
      name: "🧝 Фэнтези",
      icon: "🐉",
      desc: "Эльфийские и магические",
    },
    {
      id: "russian",
      name: "🇷🇺 Русские",
      icon: "💪",
      desc: "Богатырские и славянские",
    },
    {
      id: "english",
      name: "🇬🇧 Английские",
      icon: "🎩",
      desc: "Как у иностранцев",
    },
    { id: "funny", name: "😂 Смешные", icon: "🤪", desc: "Весёлые и забавные" },
    { id: "mixed", name: "🎲 Смешанные", icon: "🎯", desc: "Всего понемногу" },
  ];

  return (
    <div className="min-h-screen">
      <title>Генератор никнеймов - Полезные инструменты - use-tools.ru</title>
      <meta
        name="description"
        content="Бесплатный онлайн генератор никнеймов. Создайте крутой, смешной или фэнтезийный никнейм для игр и соцсетей."
      />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-8">
          {/* Выбор стиля */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100">
              Выберите стиль никнейма
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`
                    p-4 rounded-xl border-2 transition-all text-center cursor-pointer
                    ${
                      style === s.id
                        ? "border-blue-500 bg-blue-50 shadow-md scale-105"
                        : "border-blue-100 bg-white hover:border-blue-300 hover:bg-blue-50"
                    }
                  `}
                >
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="font-semibold text-blue-800 text-sm">
                    {s.name}
                  </div>
                  <div className="text-xs text-blue-500 mt-1">{s.desc}</div>
                </button>
              ))}
            </div>

            {/* Расширенные настройки */}
            <div className="mt-6">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                <svg
                  className={`w-5 h-5 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
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
                <span>Расширенные настройки</span>
              </button>

              {showAdvanced && (
                <div className="mt-4 p-5 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Количество */}
                    <div>
                      <label className="block text-sm font-semibold text-blue-700 mb-2">
                        Количество никнеймов
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={count}
                        onChange={(e) =>
                          setCount(
                            Math.min(
                              50,
                              Math.max(1, parseInt(e.target.value) || 1),
                            ),
                          )
                        }
                        className="w-full p-2 border-2 border-blue-200 rounded-lg text-center font-bold text-blue-800 focus:border-blue-500 outline-none"
                      />
                    </div>

                    {/* Мин. длина */}
                    <div>
                      <label className="block text-sm font-semibold text-blue-700 mb-2">
                        Мин. длина
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={maxLength}
                        value={minLength}
                        onChange={(e) => {
                          const val = Math.max(
                            1,
                            parseInt(e.target.value) || 1,
                          );
                          setMinLength(Math.min(val, maxLength));
                        }}
                        className="w-full p-2 border-2 border-blue-200 rounded-lg text-center font-bold text-blue-800 focus:border-blue-500 outline-none"
                      />
                    </div>

                    {/* Макс. длина */}
                    <div>
                      <label className="block text-sm font-semibold text-blue-700 mb-2">
                        Макс. длина
                      </label>
                      <input
                        type="number"
                        min={minLength}
                        max="30"
                        value={maxLength}
                        onChange={(e) => {
                          const val = Math.min(
                            30,
                            Math.max(
                              minLength,
                              parseInt(e.target.value) || minLength,
                            ),
                          );
                          setMaxLength(val);
                        }}
                        className="w-full p-2 border-2 border-blue-200 rounded-lg text-center font-bold text-blue-800 focus:border-blue-500 outline-none"
                      />
                    </div>

                    {/* Начинается с */}
                    <div>
                      <label className="block text-sm font-semibold text-blue-700 mb-2">
                        Начинается с
                      </label>
                      <input
                        type="text"
                        value={startWith}
                        onChange={(e) => setStartWith(e.target.value)}
                        placeholder="Например: Pro"
                        maxLength={10}
                        className="w-full p-2 border-2 border-blue-200 rounded-lg text-center font-bold text-blue-800 focus:border-blue-500 outline-none"
                      />
                    </div>

                    {/* Заканчивается на */}
                    <div>
                      <label className="block text-sm font-semibold text-blue-700 mb-2">
                        Заканчивается на
                      </label>
                      <input
                        type="text"
                        value={endWith}
                        onChange={(e) => setEndWith(e.target.value)}
                        placeholder="Например: er"
                        maxLength={10}
                        className="w-full p-2 border-2 border-blue-200 rounded-lg text-center font-bold text-blue-800 focus:border-blue-500 outline-none"
                      />
                    </div>

                    {/* Чекбоксы */}
                    <div className="flex items-center space-x-6">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeNumbers}
                          onChange={(e) => setIncludeNumbers(e.target.checked)}
                          className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-blue-700">Цифры</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeSymbols}
                          onChange={(e) => setIncludeSymbols(e.target.checked)}
                          className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-blue-700">Символы</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Сообщение об ошибке */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Кнопка генерации */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={generateNicknames}
                disabled={isGenerating}
                className="px-8 py-4 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-2"
              >
                {isGenerating ? (
                  <>
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    <span>Генерируем...</span>
                  </>
                ) : (
                  <>
                    <span>🎲</span>
                    <span>Сгенерировать никнеймы</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Результаты */}
          {generatedNicknames.length > 0 && (
            <div
              className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100"
              ref={resultsRef}
            >
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-blue-100">
                <h2 className="text-2xl font-bold text-blue-700">
                  Сгенерированные никнеймы
                </h2>
                <button
                  onClick={copyAll}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-semibold cursor-pointer"
                >
                  {copiedIndex === "all"
                    ? "✅ Скопировано!"
                    : "📋 Копировать все"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {generatedNicknames.map((nickname, index) => {
                  const rating = getNicknameRating(nickname);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-lg text-blue-800 truncate">
                          {nickname}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className={`flex ${rating.color}`}>
                            {Array.from({ length: rating.stars }).map(
                              (_, i) => (
                                <span key={i}>★</span>
                              ),
                            )}
                          </div>
                          <span className="text-xs text-blue-400">
                            {nickname.length} симв.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => copyToClipboard(nickname, index)}
                          className={`p-2 rounded-lg transition-all cursor-pointer ${
                            copiedIndex === index
                              ? "bg-green-100 text-green-600"
                              : "text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                          }`}
                          title="Копировать"
                        >
                          {copiedIndex === index ? (
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
                                d="M5 13l4 4L19 7"
                              ></path>
                            </svg>
                          ) : (
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
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              ></path>
                            </svg>
                          )}
                        </button>

                        <button
                          onClick={() => toggleFavorite(nickname)}
                          className={`p-2 rounded-lg transition-all cursor-pointer ${
                            isFavorite(nickname)
                              ? "text-red-500 bg-red-50"
                              : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                          }`}
                          title={
                            isFavorite(nickname)
                              ? "Убрать из избранного"
                              : "В избранное"
                          }
                        >
                          <svg
                            className="w-5 h-5"
                            fill={
                              isFavorite(nickname) ? "currentColor" : "none"
                            }
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Избранное */}
          {favorites.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-red-100">
                <h2 className="text-2xl font-bold text-red-600 flex items-center space-x-2">
                  <span>❤️</span>
                  <span>Избранное</span>
                  <span className="text-sm font-normal text-red-400">
                    ({favorites.length})
                  </span>
                </h2>
                <button
                  onClick={exportFavorites}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all text-sm font-semibold cursor-pointer"
                >
                  💾 Экспорт
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {favorites.map((nick, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 px-3 py-2 bg-red-50 rounded-lg border border-red-200"
                  >
                    <span className="font-semibold text-red-700">{nick}</span>
                    <button
                      onClick={() => toggleFavorite(nick)}
                      className="text-red-400 hover:text-red-600 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* История генераций */}
          {history.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
              <h2 className="text-xl font-bold text-blue-700 mb-6 pb-3 border-b border-blue-100">
                🕐 История генераций
              </h2>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {history.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">{item.time}</span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {styles.find((s) => s.id === item.style)?.name ||
                          item.style}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.nicknames.slice(0, 5).map((nick, i) => (
                        <span key={i} className="text-sm text-blue-700">
                          {nick}
                          {i < Math.min(item.nicknames.length, 5) - 1
                            ? ","
                            : ""}
                        </span>
                      ))}
                      {item.nicknames.length > 5 && (
                        <span className="text-sm text-blue-400">
                          + ещё {item.nicknames.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Пустое состояние */}
          {generatedNicknames.length === 0 && !isGenerating && (
            <div className="bg-white rounded-2xl shadow-xl p-12 border border-blue-100 text-center">
              <div className="text-6xl mb-4">🎭</div>
              <p className="text-xl text-blue-600 mb-2">
                Генератор никнеймов ждёт вас!
              </p>
              <p className="text-blue-400">
                Выберите стиль и нажмите "Сгенерировать"
              </p>
            </div>
          )}

          {/* Информация */}
          <div className="bg-linear-to-r from-blue-100 to-cyan-100 p-5 rounded-xl border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-3">
              ℹ️ О генераторе никнеймов
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-blue-700 mb-2">
                  Как это работает?
                </h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Комбинируются префиксы, суффиксы и корни слов</li>
                  <li>• Добавляются цифры и спецсимволы по желанию</li>
                  <li>• Все никнеймы уникальны в рамках одной генерации</li>
                  <li>• Можно задать длину, начало и конец ника</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-blue-700 mb-2">
                  Где использовать?
                </h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Игры и игровые платформы (Steam, PSN, Xbox)</li>
                  <li>• Социальные сети и мессенджеры</li>
                  <li>• Форумы и онлайн-сообщества</li>
                  <li>• Творческие псевдонимы и бренды</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Description_component>
          <p className="font-bold mt-6 text-center">
            🎭 Генератор Никнеймов Онлайн | Создать Крутой Ник Бесплатно
          </p>
          <p className="mt-6">
            <strong>Генератор никнеймов онлайн</strong> — это мощный инструмент
            для создания уникальных, запоминающихся и крутых никнеймов. Наш{" "}
            <strong>бесплатный генератор ников</strong> поможет подобрать
            идеальное имя для игры, социальной сети или форума. Шесть стилей,
            гибкие настройки и умный алгоритм комбинаторики создадут никнейм,
            который точно никто не занял.
          </p>
          <p className="mt-6 font-bold">Возможности генератора никнеймов:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>6 стилей генерации</strong> — крутые, фэнтези, русские,
                английские, смешные и смешанные
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Гибкие настройки</strong> — длина ника, цифры,
                спецсимволы, префиксы и суффиксы
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Рейтинг никнеймов</strong> — система звёзд оценивает
                крутость каждого ника
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Копирование в один клик</strong> — быстрое копирование в
                буфер обмена
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Избранное</strong> — сохраняйте понравившиеся никнеймы и
                экспортируйте списком
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>История генераций</strong> — просмотр предыдущих
                результатов
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Генерация до 50 ников</strong> — множество вариантов за
                одно нажатие
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Умная комбинаторика</strong> — тысячи возможных
                сочетаний для уникальности
              </span>
            </li>
          </ul>
        </Description_component>
      </div>
    </div>
  );
};

export default NicknameGenerator;
