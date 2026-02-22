import React, { useState } from "react";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import Description_component from "../components/Description_component";

const CarSaleContractGenerator = () => {
  // Начальные значения
  const [formData, setFormData] = useState({
    // Общие данные
    date_signing: new Date().toISOString().split("T")[0],
    place_signing: "г. Москва",

    // Данные продавца
    seller_fullname: "",
    seller_livingAdress: "",
    seller_registrationAdress: "",
    seller_passport_seria: "",
    seller_passport_number: "",
    seller_passport_whenIssued: "",
    seller_passport_issuedBy: "",
    seller_phoneNumber: "",

    // Данные покупателя
    buyer_fullname: "",
    buyer_livingAdress: "",
    buyer_registrationAdress: "",
    buyer_passport_seria: "",
    buyer_passport_number: "",
    buyer_passport_whenIssued: "",
    buyer_passport_issuedBy: "",
    buyer_phoneNumber: "",

    // Данные автомобиля
    car_brandAndModel: "",
    car_vin: "",
    car_yearOfIssue: "",
    car_numberEngine: "",
    car_numberFrame: "",
    car_numberBody: "",
    car_color: "",
    car_mileage: "",
    car_govregMark: "",
    car_regCertificate: "",
    car_regCertificateIssuedBy: "",

    // Данные ПТС
    pts_seria: "",
    pts_number: "",
    pts_issuedBy: "",
    pts_whenIssued: "",

    // Цена
    price: "",
  });

  // Функция для преобразования суммы в пропись
  const numberToWords = (num) => {
    const units = [
      "",
      "один",
      "два",
      "три",
      "четыре",
      "пять",
      "шесть",
      "семь",
      "восемь",
      "девять",
      "десять",
      "одиннадцать",
      "двенадцать",
      "тринадцать",
      "четырнадцать",
      "пятнадцать",
      "шестнадцать",
      "семнадцать",
      "восемнадцать",
      "девятнадцать",
    ];
    const tens = [
      "",
      "",
      "двадцать",
      "тридцать",
      "сорок",
      "пятьдесят",
      "шестьдесят",
      "семьдесят",
      "восемьдесят",
      "девяносто",
    ];
    const hundreds = [
      "",
      "сто",
      "двести",
      "триста",
      "четыреста",
      "пятьсот",
      "шестьсот",
      "семьсот",
      "восемьсот",
      "девятьсот",
    ];
    const thousands = ["", "тысяча", "тысячи", "тысяч"];
    const millions = ["", "миллион", "миллиона", "миллионов"];
    const billions = ["", "миллиард", "миллиарда", "миллиардов"];

    // Функция для склонения тысяч
    const getThousandWord = (number) => {
      const lastTwo = number % 100;
      const lastDigit = number % 10;

      if (lastTwo >= 11 && lastTwo <= 19) {
        return "тысяч";
      }

      switch (lastDigit) {
        case 1:
          return "тысяча";
        case 2:
        case 3:
        case 4:
          return "тысячи";
        default:
          return "тысяч";
      }
    };

    const getRubles = (n) => {
      if (n === 0) return "ноль";

      let result = "";
      const billionsNum = Math.floor(n / 1000000000);
      const millionsNum = Math.floor((n % 1000000000) / 1000000);
      const thousandsNum = Math.floor((n % 1000000) / 1000);
      const remainder = n % 1000;

      if (billionsNum > 0) {
        result +=
          getHundreds(billionsNum) +
          " " +
          getPlural(billionsNum, billions) +
          " ";
      }

      if (millionsNum > 0) {
        result +=
          getHundreds(millionsNum) +
          " " +
          getPlural(millionsNum, millions) +
          " ";
      }

      if (thousandsNum > 0) {
        result +=
          getHundreds(thousandsNum) +
          " " +
          getPlural(thousandsNum, thousands) +
          " ";
      }

      if (remainder > 0) {
        result += getHundreds(remainder);
      }

      return result.trim();
    };

    const getHundreds = (n) => {
      if (n === 0) return "";

      const hundred = Math.floor(n / 100);
      const ten = Math.floor((n % 100) / 10);
      const unit = n % 10;

      let result = "";

      if (hundred > 0) {
        result += hundreds[hundred] + " ";
      }

      if (ten >= 2) {
        result += tens[ten] + " ";
        if (unit > 0) {
          result += units[unit] + " ";
        }
      } else if (ten === 1) {
        result += units[10 + unit] + " ";
      } else if (unit > 0) {
        result += units[unit] + " ";
      }

      return result.trim();
    };

    const getPlural = (n, titles) => {
      const cases = [2, 0, 1, 1, 1, 2];
      return titles[
        n % 100 > 4 && n % 100 < 20 ? 2 : cases[Math.min(n % 10, 5)]
      ];
    };
    // Функция для правильного написания чисел от 1 до 999 в контексте тысяч
    const getThousandNumberWord = (number) => {
      if (number === 0) return "";

      const hundred = Math.floor(number / 100);
      const ten = Math.floor((number % 100) / 10);
      const unit = number % 10;

      let result = "";

      if (hundred > 0) {
        result += hundreds[hundred] + " ";
      }

      if (ten >= 2) {
        // Для тысяч нужно особое склонение единиц
        if (unit === 1) {
          result += tens[ten] + " одна ";
        } else if (unit === 2) {
          result += tens[ten] + " две ";
        } else {
          result += tens[ten] + " " + units[unit] + " ";
        }
      } else if (ten === 1) {
        result += units[10 + unit] + " ";
      } else if (unit > 0) {
        // Для тысяч нужно особое склонение единиц
        if (unit === 1) {
          result += "одна ";
        } else if (unit === 2) {
          result += "две ";
        } else {
          result += units[unit] + " ";
        }
      }

      return result.trim();
    };
    // Функция для обычных чисел (не тысячи)
    const getRegularNumberWord = (number) => {
      if (number === 0) return "";

      const hundred = Math.floor(number / 100);
      const ten = Math.floor((number % 100) / 10);
      const unit = number % 10;

      let result = "";

      if (hundred > 0) {
        result += hundreds[hundred] + " ";
      }

      if (ten >= 2) {
        result += tens[ten] + " ";
        if (unit > 0) {
          result += units[unit] + " ";
        }
      } else if (ten === 1) {
        result += units[10 + unit] + " ";
      } else if (unit > 0) {
        result += units[unit] + " ";
      }

      return result.trim();
    };

    const rubles = parseInt(num);
    if (isNaN(rubles)) return "ноль";

    return getRubles(rubles);
  };

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Генерация документа Word
  const generateDocument = async () => {
    // Форматируем дату
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      const day = date.getDate();
      const month = date.toLocaleString("ru-RU", { month: "long" });
      const year = date.getFullYear();
      return `${day} ${month} ${year} года`;
    };

    // Подготавливаем данные
    const dateSigningFormatted = formatDate(formData.date_signing);
    const sellerPassportDate = formatDate(formData.seller_passport_whenIssued);
    const buyerPassportDate = formatDate(formData.buyer_passport_whenIssued);
    const ptsDate = formatDate(formData.pts_whenIssued);
    const priceInWords = formData.price
      ? numberToWords(formData.price)
      : "ноль";

    // Создаем содержимое документа
    const docContent = `
**Договор купли-продажи транспортного средства**

${dateSigningFormatted} года ${formData.place_signing}

(место заключения договора)

Мы, гр. ${formData.seller_fullname}, проживающий(ая) по адресу ${formData.seller_livingAdress},

зарегистрированный (ая) по адресу ${formData.seller_registrationAdress},

Удостоверение личности: паспорт серии ${formData.seller_passport_seria} № ${formData.seller_passport_number}, выдан ${sellerPassportDate},

${formData.seller_passport_issuedBy},

именуемый(ая) в дальнейшем "Продавец",

и гр. ${formData.buyer_fullname}, проживающий(ая) по адресу ${formData.buyer_livingAdress},

зарегистрированный (ая) по адресу ${formData.buyer_registrationAdress},

Удостоверение личности: паспорт серии ${formData.buyer_passport_seria} № ${formData.buyer_passport_number}, выдан ${buyerPassportDate}, ${formData.buyer_passport_issuedBy},

именуемый(ая) в дальнейшем "Покупатель", заключили настоящий договор о нижеследующем:

1. Продавец передает в собственность покупателя (продает), а Покупатель принимает (покупает) и оплачивает транспортное средство:

Марка, модель ТС: **${formData.car_brandAndModel}**

Идентификационный номер (VIN): **${formData.car_vin}**

Год выпуска: **${formData.car_yearOfIssue}**

№ двигателя: **${formData.car_numberEngine}**

№ шасси (рамы): **${formData.car_numberFrame}**

№ кузова: **${formData.car_numberBody}**

Цвет: **${formData.car_color}**

Пробег: **${formData.car_mileage}** км

Государственный регистрационный знак: **${formData.car_govregMark}**

Свидетельство о регистрации ТС: **${formData.car_regCertificate}**

Выдано: **${formData.car_regCertificateIssuedBy}**

2. Указанное в п. 1 транспортное средство, принадлежит Продавцу на праве собственности, что подтверждает паспорт транспортного средства, серии **${formData.pts_seria}** № **${formData.pts_number}**, выданный **${formData.pts_issuedBy}**, **${ptsDate}** г.

3. Со слов Продавца отчуждаемое транспортное средство никому не продано, не заложено, в споре и под запретом (арестом) не состоит, не имеет иных обременений.

4. Стоимость указанного в п. 1 транспортного средства согласована Покупателем и Продавцом и составляет: **${formData.price}** (${priceInWords} руб. 00 коп.)

5. Покупатель в оплату за приобретенное транспортное средство передал Продавцу, а Продавец получил денежные средства в размере **${formData.price}** (${priceInWords} руб. 00 коп.)

6. Право собственности на транспортное средство, указанное в п. 1 договора переходит к Покупателю с момента подписания настоящего договора.

7. Настоящий договор составлен в трех экземплярах (по одному каждой из сторон и один для оформления в ГИБДД).

**Продавец                                    Покупатель**

Деньги получил, транспортное средство передал.                    Деньги передал, транспортное средство получил.

___________________________                    ___________________________
(подпись и расшифровка)                                 (подпись и расшифровка)

Тел. ${formData.seller_phoneNumber}               Тел. ${formData.buyer_phoneNumber}
    `;

    // Создаем документ DOCX
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Договор купли-продажи транспортного средства",
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${dateSigningFormatted} года ${formData.place_signing}`,
                  size: 24,
                }),
              ],
            }),
            // ... добавьте остальные параграфы аналогично
          ],
        },
      ],
    });

    // Сохраняем как .docx
    Packer.toBlob(doc).then((blob) => {
      saveAs(
        blob,
        `Договор_купли-продажи_автомобиля_${
          new Date().toISOString().split("T")[0]
        }.docx`,
      );
    });
  };

  // Заменяем функцию downloadAsTextFile на generateAndDownloadDocx
  const generateAndDownloadDocx = async () => {
    const {
      Document,
      Packer,
      Paragraph,
      TextRun,
      AlignmentType,
      HeadingLevel,
    } = await import("docx");

    // Форматируем дату
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      const day = date.getDate();
      const month = date.toLocaleString("ru-RU", { month: "long" });
      const year = date.getFullYear();
      return `${day} ${month} ${year} года`;
    };

    // Подготавливаем данные
    const dateSigningFormatted = formatDate(formData.date_signing);
    const sellerPassportDate = formatDate(formData.seller_passport_whenIssued);
    const buyerPassportDate = formatDate(formData.buyer_passport_whenIssued);
    const ptsDate = formatDate(formData.pts_whenIssued);
    const priceInWords = formData.price
      ? numberToWords(formData.price)
      : "ноль";

    // Создаем документ
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1000,
                right: 1000,
                bottom: 1000,
                left: 1000,
              },
            },
          },
          children: [
            // Заголовок
            new Paragraph({
              text: "Договор купли-продажи транспортного средства",
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 400,
              },
            }),

            // Дата и место
            new Paragraph({
              children: [
                new TextRun({
                  text: `${dateSigningFormatted} года `,
                }),
                new TextRun({
                  text: formData.place_signing || "[место заключения договора]",
                  underline: {},
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 200,
              },
            }),

            // Примечание о месте
            new Paragraph({
              text: "(место заключения договора)",
              alignment: AlignmentType.CENTER,
              italics: true,
              spacing: {
                after: 400,
              },
            }),

            // Текст договора
            new Paragraph({
              children: [
                new TextRun({
                  text: "Мы, гр. ",
                }),
                new TextRun({
                  text: formData.seller_fullname || "[ФИО продавца]",
                  bold: true,
                }),
                new TextRun({
                  text: ", проживающий(ая) по адресу ",
                }),
                new TextRun({
                  text: formData.seller_livingAdress || "[адрес проживания]",
                  bold: true,
                }),
                new TextRun({
                  text: ",",
                  break: 1,
                }),
              ],
              spacing: {
                after: 100,
              },
            }),

            // Продолжение продавца
            new Paragraph({
              children: [
                new TextRun({
                  text: "зарегистрированный (ая) по адресу ",
                }),
                new TextRun({
                  text:
                    formData.seller_registrationAdress || "[адрес регистрации]",
                  bold: true,
                }),
                new TextRun({
                  text: ",",
                  break: 1,
                }),
              ],
              spacing: {
                after: 100,
              },
            }),

            // Паспорт продавца
            new Paragraph({
              children: [
                new TextRun({
                  text: "Удостоверение личности: паспорт серии ",
                }),
                new TextRun({
                  text: formData.seller_passport_seria || "[серия]",
                  bold: true,
                }),
                new TextRun({
                  text: " № ",
                }),
                new TextRun({
                  text: formData.seller_passport_number || "[номер]",
                  bold: true,
                }),
                new TextRun({
                  text: ", выдан ",
                }),
                new TextRun({
                  text: sellerPassportDate || "[дата выдачи]",
                  bold: true,
                }),
                new TextRun({
                  text: ",",
                  break: 1,
                }),
              ],
              spacing: {
                after: 100,
              },
            }),

            // Кем выдан продавцу
            new Paragraph({
              children: [
                new TextRun({
                  text: formData.seller_passport_issuedBy || "[кем выдан]",
                  bold: true,
                }),
                new TextRun({
                  text: ",",
                }),
              ],
              spacing: {
                after: 100,
              },
            }),

            // Продавец
            new Paragraph({
              children: [
                new TextRun({
                  text: 'именуемый(ая) в дальнейшем "Продавец",',
                  bold: true,
                }),
              ],
              spacing: {
                after: 100,
              },
            }),

            // Пустая строка
            new Paragraph({
              text: "",
              spacing: {
                after: 100,
              },
            }),

            // Покупатель начало
            new Paragraph({
              children: [
                new TextRun({
                  text: "и гр. ",
                }),
                new TextRun({
                  text: formData.buyer_fullname || "[ФИО покупателя]",
                  bold: true,
                }),
                new TextRun({
                  text: ", проживающий(ая) по адресу ",
                }),
                new TextRun({
                  text: formData.buyer_livingAdress || "[адрес проживания]",
                  bold: true,
                }),
                new TextRun({
                  text: ",",
                  break: 1,
                }),
              ],
              spacing: {
                after: 100,
              },
            }),

            // Продолжение покупателя (адрес регистрации)
            new Paragraph({
              children: [
                new TextRun({
                  text: "зарегистрированный (ая) по адресу ",
                }),
                new TextRun({
                  text:
                    formData.buyer_registrationAdress || "[адрес регистрации]",
                  bold: true,
                }),
                new TextRun({
                  text: ",",
                  break: 1,
                }),
              ],
              spacing: {
                after: 100,
              },
            }),

            // Паспорт покупателя
            new Paragraph({
              children: [
                new TextRun({
                  text: "Удостоверение личности: паспорт серии ",
                }),
                new TextRun({
                  text: formData.buyer_passport_seria || "[серия]",
                  bold: true,
                }),
                new TextRun({
                  text: " № ",
                }),
                new TextRun({
                  text: formData.buyer_passport_number || "[номер]",
                  bold: true,
                }),
                new TextRun({
                  text: ", выдан ",
                }),
                new TextRun({
                  text: buyerPassportDate || "[дата выдачи]",
                  bold: true,
                }),
                new TextRun({
                  text: ", ",
                }),
                new TextRun({
                  text: formData.buyer_passport_issuedBy || "[кем выдан]",
                  bold: true,
                }),
                new TextRun({
                  text: ",",
                  break: 1,
                }),
              ],
              spacing: {
                after: 100,
              },
            }),

            // Покупатель
            new Paragraph({
              children: [
                new TextRun({
                  text: 'именуемый(ая) в дальнейшем "Покупатель", заключили настоящий договор о нижеследующем:',
                  bold: true,
                }),
              ],
              spacing: {
                after: 200,
              },
            }),

            // Пункт 1
            new Paragraph({
              children: [
                new TextRun({
                  text: "1. ",
                  bold: true,
                }),
                new TextRun({
                  text: "Продавец передает в собственность покупателя (продает), а Покупатель принимает (покупает) и оплачивает транспортное средство:",
                }),
              ],
              spacing: {
                after: 100,
              },
            }),

            // Марка автомобиля
            new Paragraph({
              children: [
                new TextRun({
                  text: "Марка, модель ТС: ",
                }),
                new TextRun({
                  text: formData.car_brandAndModel || "[марка и модель]",
                  bold: true,
                }),
              ],
              spacing: {
                before: 100,
                after: 50,
              },
            }),

            // VIN
            new Paragraph({
              children: [
                new TextRun({
                  text: "Идентификационный номер (VIN): ",
                }),
                new TextRun({
                  text: formData.car_vin || "[VIN номер]",
                  bold: true,
                }),
              ],
              spacing: {
                after: 50,
              },
            }),

            // Год выпуска
            new Paragraph({
              children: [
                new TextRun({
                  text: "Год выпуска: ",
                }),
                new TextRun({
                  text: formData.car_yearOfIssue || "[год выпуска]",
                  bold: true,
                }),
              ],
              spacing: {
                after: 50,
              },
            }),

            // Номер двигателя
            new Paragraph({
              children: [
                new TextRun({
                  text: "№ двигателя: ",
                }),
                new TextRun({
                  text: formData.car_numberEngine || "[номер двигателя]",
                  bold: true,
                }),
              ],
              spacing: {
                after: 50,
              },
            }),

            // Номер шасси
            new Paragraph({
              children: [
                new TextRun({
                  text: "№ шасси (рамы): ",
                }),
                new TextRun({
                  text: formData.car_numberFrame || "[номер шасси]",
                  bold: true,
                }),
              ],
              spacing: {
                after: 50,
              },
            }),

            // Номер кузова
            new Paragraph({
              children: [
                new TextRun({
                  text: "№ кузова: ",
                }),
                new TextRun({
                  text: formData.car_numberBody || "[номер кузова]",
                  bold: true,
                }),
              ],
              spacing: {
                after: 50,
              },
            }),

            // Цвет
            new Paragraph({
              children: [
                new TextRun({
                  text: "Цвет: ",
                }),
                new TextRun({
                  text: formData.car_color || "[цвет]",
                  bold: true,
                }),
              ],
              spacing: {
                after: 50,
              },
            }),

            // Пробег
            new Paragraph({
              children: [
                new TextRun({
                  text: "Пробег: ",
                }),
                new TextRun({
                  text: formData.car_mileage || "[пробег]",
                  bold: true,
                }),
                new TextRun({
                  text: " км",
                }),
              ],
              spacing: {
                after: 50,
              },
            }),

            // Гос номер
            new Paragraph({
              children: [
                new TextRun({
                  text: "Государственный регистрационный знак: ",
                }),
                new TextRun({
                  text: formData.car_govregMark || "[гос. номер]",
                  bold: true,
                }),
              ],
              spacing: {
                after: 50,
              },
            }),

            // Свидетельство о регистрации
            new Paragraph({
              children: [
                new TextRun({
                  text: "Свидетельство о регистрации ТС: ",
                }),
                new TextRun({
                  text: formData.car_regCertificate || "[номер свидетельства]",
                  bold: true,
                }),
              ],
              spacing: {
                after: 50,
              },
            }),

            // Выдано свидетельство
            new Paragraph({
              children: [
                new TextRun({
                  text: "Выдано: ",
                }),
                new TextRun({
                  text:
                    formData.car_regCertificateIssuedBy ||
                    "[кем и когда выдано]",
                  bold: true,
                }),
              ],
              spacing: {
                after: 200,
              },
            }),

            // Пункт 2
            new Paragraph({
              children: [
                new TextRun({
                  text: "2. ",
                  bold: true,
                }),
                new TextRun({
                  text: "Указанное в п. 1 транспортное средство, принадлежит Продавцу на праве собственности, что подтверждает паспорт транспортного средства, серии ",
                }),
                new TextRun({
                  text: formData.pts_seria || "[серия ПТС]",
                  bold: true,
                }),
                new TextRun({
                  text: " № ",
                }),
                new TextRun({
                  text: formData.pts_number || "[номер ПТС]",
                  bold: true,
                }),
                new TextRun({
                  text: ", выданный ",
                }),
                new TextRun({
                  text: formData.pts_issuedBy || "[кем выдан]",
                  bold: true,
                }),
                new TextRun({
                  text: ", ",
                }),
                new TextRun({
                  text: ptsDate || "[дата выдачи]",
                  bold: true,
                }),
                new TextRun({
                  text: " г.",
                }),
              ],
              spacing: {
                after: 200,
              },
            }),

            // Пункт 3
            new Paragraph({
              children: [
                new TextRun({
                  text: "3. ",
                  bold: true,
                }),
                new TextRun({
                  text: "Со слов Продавца отчуждаемое транспортное средство никому не продано, не заложено, в споре и под запретом (арестом) не состоит, не имеет иных обременений.",
                }),
              ],
              spacing: {
                after: 200,
              },
            }),

            // Пункт 4
            new Paragraph({
              children: [
                new TextRun({
                  text: "4. ",
                  bold: true,
                }),
                new TextRun({
                  text: "Стоимость указанного в п. 1 транспортного средства согласована Покупателем и Продавцом и составляет: ",
                }),
                new TextRun({
                  text: formData.price || "[сумма]",
                  bold: true,
                }),
                new TextRun({
                  text: " (" + priceInWords + " руб. 00 коп.)",
                }),
              ],
              spacing: {
                after: 200,
              },
            }),

            // Пункт 5
            new Paragraph({
              children: [
                new TextRun({
                  text: "5. ",
                  bold: true,
                }),
                new TextRun({
                  text: "Покупатель в оплату за приобретенное транспортное средство передал Продавцу, а Продавец получил денежные средства в размере ",
                }),
                new TextRun({
                  text: formData.price || "[сумма]",
                  bold: true,
                }),
                new TextRun({
                  text: " (" + priceInWords + " руб. 00 коп.)",
                }),
              ],
              spacing: {
                after: 200,
              },
            }),

            // Пункт 6
            new Paragraph({
              children: [
                new TextRun({
                  text: "6. ",
                  bold: true,
                }),
                new TextRun({
                  text: "Право собственности на транспортное средство, указанное в п. 1 договора переходит к Покупателю с момента подписания настоящего договора.",
                }),
              ],
              spacing: {
                after: 200,
              },
            }),

            // Пункт 7
            new Paragraph({
              children: [
                new TextRun({
                  text: "7. ",
                  bold: true,
                }),
                new TextRun({
                  text: "Настоящий договор составлен в трех экземплярах (по одному каждой из сторон и один для оформления в ГИБДД).",
                }),
              ],
              spacing: {
                after: 400,
              },
            }),

            // Подписи заголовок
            new Paragraph({
              children: [
                new TextRun({
                  text: "Продавец",
                  bold: true,
                }),
                new TextRun({
                  text: "                                    ",
                }),
                new TextRun({
                  text: "Покупатель",
                  bold: true,
                }),
              ],
              spacing: {
                after: 100,
              },
            }),

            // Подпись текст
            new Paragraph({
              text: "Деньги получил, транспортное средство передал.                    Деньги передал, транспортное средство получил.",
              spacing: {
                after: 200,
              },
            }),

            // Подписи линии
            new Paragraph({
              text: "___________________________                    ___________________________",
              spacing: {
                after: 50,
              },
            }),

            // Подписи пояснение
            new Paragraph({
              text: "(подпись и расшифровка)                                 (подпись и расшифровка)",
              italics: true,
              spacing: {
                after: 200,
              },
            }),

            // Телефоны
            new Paragraph({
              children: [
                new TextRun({
                  text:
                    "Тел. " +
                    (formData.seller_phoneNumber || "[телефон продавца]"),
                }),
                new TextRun({
                  text:
                    "               Тел. " +
                    (formData.buyer_phoneNumber || "[телефон покупателя]"),
                }),
              ],
              spacing: {
                after: 200,
              },
            }),
          ],
        },
      ],
    });

    // Генерируем и скачиваем документ
    Packer.toBlob(doc).then((blob) => {
      saveAs(
        blob,
        `Договор_купли-продажи_автомобиля_${
          new Date().toISOString().split("T")[0]
        }.docx`,
      );
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-2">
            Генератор договора купли-продажи автомобиля
          </h1>
          <p className="text-blue-600 mb-6">
            Заполните форму ниже для создания договора купли-продажи автомобиля
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              generateAndDownloadDocx();
            }}
            className="space-y-8"
          >
            {/* Общие данные */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-700 pb-2 border-b border-blue-200">
                Общие данные договора
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Дата заключения договора
                  </label>
                  <input
                    type="date"
                    name="date_signing"
                    value={formData.date_signing}
                    onChange={handleChange}
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Место заключения договора
                  </label>
                  <input
                    type="text"
                    name="place_signing"
                    value={formData.place_signing}
                    onChange={handleChange}
                    placeholder="г. Москва"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Данные продавца */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-700 pb-2 border-b border-blue-200">
                Сведения о продавце
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    ФИО (полностью)
                  </label>
                  <input
                    type="text"
                    name="seller_fullname"
                    value={formData.seller_fullname}
                    onChange={handleChange}
                    placeholder="Иванов Иван Иванович"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Номер телефона
                  </label>
                  <input
                    type="text"
                    name="seller_phoneNumber"
                    value={formData.seller_phoneNumber}
                    onChange={handleChange}
                    placeholder="8 912 345 6789"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Адрес проживания
                  </label>
                  <input
                    type="text"
                    name="seller_livingAdress"
                    value={formData.seller_livingAdress}
                    onChange={handleChange}
                    placeholder="г. Москва, ул. Центральная, д. 1, кв. 1"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Адрес регистрации
                  </label>
                  <input
                    type="text"
                    name="seller_registrationAdress"
                    value={formData.seller_registrationAdress}
                    onChange={handleChange}
                    placeholder="г. Москва, ул. Центральная, д. 1, кв. 1"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Серия паспорта
                  </label>
                  <input
                    type="text"
                    name="seller_passport_seria"
                    value={formData.seller_passport_seria}
                    onChange={handleChange}
                    placeholder="1234"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Номер паспорта
                  </label>
                  <input
                    type="text"
                    name="seller_passport_number"
                    value={formData.seller_passport_number}
                    onChange={handleChange}
                    placeholder="123456"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Дата выдачи
                  </label>
                  <input
                    type="date"
                    name="seller_passport_whenIssued"
                    value={formData.seller_passport_whenIssued}
                    onChange={handleChange}
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Кем выдан
                  </label>
                  <input
                    type="text"
                    name="seller_passport_issuedBy"
                    value={formData.seller_passport_issuedBy}
                    onChange={handleChange}
                    placeholder="Отделением УФМС России"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Данные покупателя */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-700 pb-2 border-b border-blue-200">
                Сведения о покупателе
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    ФИО (полностью)
                  </label>
                  <input
                    type="text"
                    name="buyer_fullname"
                    value={formData.buyer_fullname}
                    onChange={handleChange}
                    placeholder="Петров Петр Петрович"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Номер телефона
                  </label>
                  <input
                    type="text"
                    name="buyer_phoneNumber"
                    value={formData.buyer_phoneNumber}
                    onChange={handleChange}
                    placeholder="8 912 345 6789"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Адрес проживания
                  </label>
                  <input
                    type="text"
                    name="buyer_livingAdress"
                    value={formData.buyer_livingAdress}
                    onChange={handleChange}
                    placeholder="г. Москва, ул. Ленина, д. 2, кв. 2"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Адрес регистрации
                  </label>
                  <input
                    type="text"
                    name="buyer_registrationAdress"
                    value={formData.buyer_registrationAdress}
                    onChange={handleChange}
                    placeholder="г. Москва, ул. Ленина, д. 2, кв. 2"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Серия паспорта
                  </label>
                  <input
                    type="text"
                    name="buyer_passport_seria"
                    value={formData.buyer_passport_seria}
                    onChange={handleChange}
                    placeholder="5678"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Номер паспорта
                  </label>
                  <input
                    type="text"
                    name="buyer_passport_number"
                    value={formData.buyer_passport_number}
                    onChange={handleChange}
                    placeholder="654321"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Дата выдачи
                  </label>
                  <input
                    type="date"
                    name="buyer_passport_whenIssued"
                    value={formData.buyer_passport_whenIssued}
                    onChange={handleChange}
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Кем выдан
                  </label>
                  <input
                    type="text"
                    name="buyer_passport_issuedBy"
                    value={formData.buyer_passport_issuedBy}
                    onChange={handleChange}
                    placeholder="Отделением УФМС России"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Данные автомобиля */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-700 pb-2 border-b border-blue-200">
                Сведения об автомобиле
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Марка и модель автомобиля
                  </label>
                  <input
                    type="text"
                    name="car_brandAndModel"
                    value={formData.car_brandAndModel}
                    onChange={handleChange}
                    placeholder="Toyota Corolla"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Идентификационный номер (VIN)
                  </label>
                  <input
                    type="text"
                    name="car_vin"
                    value={formData.car_vin}
                    onChange={handleChange}
                    placeholder="JT4RN56S2F0123456"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Год выпуска
                  </label>
                  <input
                    type="text"
                    name="car_yearOfIssue"
                    value={formData.car_yearOfIssue}
                    onChange={handleChange}
                    placeholder="2022"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    № двигателя
                  </label>
                  <input
                    type="text"
                    name="car_numberEngine"
                    value={formData.car_numberEngine}
                    onChange={handleChange}
                    placeholder="V50 123456"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    № шасси (рамы)
                  </label>
                  <input
                    type="text"
                    name="car_numberFrame"
                    value={formData.car_numberFrame}
                    onChange={handleChange}
                    placeholder="ОТСУТСТВУЕТ"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    № кузова
                  </label>
                  <input
                    type="text"
                    name="car_numberBody"
                    value={formData.car_numberBody}
                    onChange={handleChange}
                    placeholder="JT4RN56S2F0123456"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Цвет
                  </label>
                  <input
                    type="text"
                    name="car_color"
                    value={formData.car_color}
                    onChange={handleChange}
                    placeholder="БЕЛЫЙ"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Пробег (км)
                  </label>
                  <input
                    type="text"
                    name="car_mileage"
                    value={formData.car_mileage}
                    onChange={handleChange}
                    placeholder="10000"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Гос. номер
                  </label>
                  <input
                    type="text"
                    name="car_govregMark"
                    value={formData.car_govregMark}
                    onChange={handleChange}
                    placeholder="А123АА/77"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Свидетельство о регистрации
                  </label>
                  <input
                    type="text"
                    name="car_regCertificate"
                    value={formData.car_regCertificate}
                    onChange={handleChange}
                    placeholder="1234 567890"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-blue-700 font-medium mb-2">
                  Кем и когда выдано свидетельство
                </label>
                <input
                  type="text"
                  name="car_regCertificateIssuedBy"
                  value={formData.car_regCertificateIssuedBy}
                  onChange={handleChange}
                  placeholder="РЭГ ГИБДД №1 г. Москва 01.01.2022"
                  className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
            </div>

            {/* Данные ПТС */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-700 pb-2 border-b border-blue-200">
                Сведения о ПТС
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Серия ПТС
                  </label>
                  <input
                    type="text"
                    name="pts_seria"
                    value={formData.pts_seria}
                    onChange={handleChange}
                    placeholder="12 АБ"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Номер ПТС
                  </label>
                  <input
                    type="text"
                    name="pts_number"
                    value={formData.pts_number}
                    onChange={handleChange}
                    placeholder="123456"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Кем выдан ПТС
                  </label>
                  <input
                    type="text"
                    name="pts_issuedBy"
                    value={formData.pts_issuedBy}
                    onChange={handleChange}
                    placeholder="МРЭО г. Москва"
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-700 font-medium mb-2">
                    Дата выдачи ПТС
                  </label>
                  <input
                    type="date"
                    name="pts_whenIssued"
                    value={formData.pts_whenIssued}
                    onChange={handleChange}
                    className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Стоимость */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-700 pb-2 border-b border-blue-200">
                Стоимость автомобиля
              </h2>
              <div className="max-w-md">
                <label className="block text-blue-700 font-medium mb-2">
                  Стоимость (в рублях)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="1000000"
                  className="w-full p-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
                {formData.price && (
                  <div className="mt-2 text-sm text-blue-600">
                    <span className="font-medium">Прописью:</span>{" "}
                    {numberToWords(formData.price)} рублей
                  </div>
                )}
              </div>
            </div>

            {/* Кнопка скачивания */}
            <div className="pt-6 border-t border-blue-200">
              <button
                type="submit"
                className="bg-linear-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center shadow-md hover:shadow-lg text-lg font-medium cursor-pointer"
              >
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                Скачать договор
              </button>
              <p className="text-sm text-blue-600 mt-2">
                Договор будет скачан в формате Microsoft Word (.docx)
              </p>
            </div>
          </form>
        </div>

        {/* Информационный блок */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
          <h2 className="text-xl font-bold text-blue-700 mb-4">
            ℹ️ Важная информация
          </h2>
          <div className="space-y-3 text-blue-700">
            <p className="text-sm">
              • Этот инструмент поможет скачать договор купли-продажи автомобиля
              или заполнить его на сайте и скачать готовый вариант, который
              пригоден для печати.
            </p>
            <p className="text-sm">
              • Если вы не введете никакие данные, то загрузится обычный шаблон,
              который можно будет заполнить вручную.
            </p>
            <p className="text-sm">
              • Можно заполнить только часть данных, например сведения об
              автомобиле и сведения о продавце и скачать готовый шаблон с
              заполненными полями. А остальные данные можете написать от руки.
            </p>
            <p className="text-sm">
              • Чтобы распечатать договор, откройте скачанный файл в текстовом
              редакторе или Microsoft Word.
            </p>
            <p className="text-sm font-medium text-blue-800">
              • Данный сервис не хранит, не обрабатывает, не отправляет третьим
              лицам и никак не использует введенную информацию, кроме скачивания
              самого файла.
            </p>
          </div>
        </div>
        <Description_component>
          <p className="font-bold mt-6 text-center">
            🚗 Генератор Договора Купли-Продажи Автомобиля | Создать ДКП на Авто
            Онлайн Бесплатно
          </p>

          <p className="mt-6">
            <strong>Онлайн генератор договора купли-продажи автомобиля</strong>—
            это профессиональный инструмент для быстрого и безопасного
            оформления сделки по продаже или покупке транспортного средства. Наш{" "}
            <strong>бесплатный генератор ДКП</strong>
            создает юридически грамотный договор с учетом всех требований
            законодательства РФ.
          </p>

          <p className="mt-6 font-bold">
            Основные возможности генератора договора купли-продажи авто:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Генератор ДКП автомобиля</strong> — создание договора
                купли-продажи для легковых и грузовых автомобилей
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Юридически правильный договор</strong> — документ
                соответствует требованиям Гражданского кодекса РФ
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Генератор договора на машину</strong> — учет всех
                технических характеристик ТС из ПТС и СТС
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                Мгновенное создание договора без регистрации и перезагрузки
                страницы
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Договор купли-продажи авто онлайн бесплатно</strong>—
                полный функционал без скрытых платежей
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Генератор для покупателя и продавца</strong> — создание
                договора с обеих сторон сделки
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Генератор на компьютере</strong> — работает прямо в
                браузере без установки программ
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Договор с дополнительными условиями</strong> —
                возможность включения рассрочки, задатка и особых условий
              </span>
            </li>
          </ul>

          <p className="mt-6 font-bold">Почему выбирают наш генератор ДКП:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Юридическая надежность.</strong> Договор составляется по
                актуальным шаблонам с учетом судебной практики
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Простота использования.</strong> Пошаговый мастер
                заполнения с подсказками для каждого поля
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Актуальные требования.</strong> Учет последних изменений
                в законодательстве о регистрации ТС
              </span>
            </li>
          </ul>

          <p className="mt-6 font-bold">
            Что включает договор купли-продажи автомобиля:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Паспортные данные сторон</strong> — полная информация о
                продавце и покупателе
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Технические характеристики авто</strong> — марка,
                модель, VIN, год выпуска, номер двигателя
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Реквизиты ПТС и СТС</strong> — серии и номера документов
                на транспортное средство
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Стоимость сделки</strong> — прописью и цифрами, условия
                расчета
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Состояние автомобиля</strong> — описание технического
                состояния на момент продажи
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Дата и место составления</strong> — обязательные
                реквизиты для юридической силы документа
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Подписи сторон</strong> — места для подписей продавца и
                покупателя
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Гарантии и ответственность</strong> — раздел о
                гарантийных обязательствах продавца
              </span>
            </li>
          </ul>

          <p className="mt-6 font-bold">
            Практическое применение генератора ДКП:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>
                <strong>Частные продажи.</strong> Оформление сделки между
                физическими лицами
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Автодилеры и салоны.</strong> Быстрое оформление
                договоров при продаже б/у автомобилей
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Покупка авто с рук.</strong> Защита прав покупателя при
                приобретении подержанного автомобиля
              </span>
            </li>
            <li className="flex items-start">
              <span className=" mr-2">✓</span>
              <span>
                <strong>Продажа через перекупщиков.</strong> Официальное
                оформление сделки с участием третьих лиц
              </span>
            </li>
          </ul>

          <p className="mt-4">
            Наш{" "}
            <strong>
              генератор договора купли-продажи транспортного средства
            </strong>{" "}
            создает документ в формате PDF и Word, готовый к распечатке и
            подписанию. Вы можете указать <strong>способ расчета</strong>{" "}
            (наличный/безналичный), включить условие о <strong>задатке</strong>{" "}
            или <strong>рассрочке платежа</strong>, а также добавить{" "}
            <strong>дополнительные соглашения</strong>. Договор содержит все
            необходимые разделы для регистрации в ГИБДД.
          </p>

          <p className="mt-6">
            <strong>Бесплатный онлайн генератор ДКП автомобиля</strong> — это
            ваша юридическая защита при сделке с авто! Попробуйте наш{" "}
            <strong>инструмент для создания договора купли-продажи</strong>{" "}
            прямо сейчас — это лучший способ обезопасить сделку, избежать
            мошенничества и правильно оформить переход права собственности.{" "}
            <strong>Профессиональный генератор</strong> для безопасной покупки и
            продажи автомобилей!
          </p>

          <p className="mt-6">
            Популярные запросы: договор купли продажи автомобиля, ДКП авто,
            генератор ДКП, договор купли продажи авто, скачать договор купли
            продажи автомобиля, бланк ДКП, договор купли продажи машины, образец
            договора купли продажи автомобиля, договор купли продажи
            транспортного средства, оформить ДКП онлайн
          </p>
        </Description_component>
      </div>
    </div>
  );
};

export default CarSaleContractGenerator;
