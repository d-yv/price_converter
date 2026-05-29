import * as XLSX from 'xlsx';
import db from '../db/connectSqlite.js';

export const importXlsx = (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: 'Файл не загружен или имеет неверный формат' });
    }

    // Читаем XLSX из буфера
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Конвертируем в JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: null });

    if (rawData.length === 0) {
      return res.status(400).json({ error: 'Файл пуст' });
    }

    // Маппинг данных
    const productsToSave = rawData
      .map((row) => ({
        sku: String(row['Код'] || row['sku'] || '').trim(),
        price: Number(row['Медтехніка _ ОПТ'] || row['price']) || 0,
        quantity: Number(row['Наша цена+30%'] || row['quantity']) || 0,
      }))
      .filter((item) => item.sku);

    // Запись в SQLite через Upsert и Транзакцию
    const insertOrUpdate = db.prepare(`
      INSERT INTO products (sku, price, quantity) 
      VALUES (@sku, @price, @quantity)
      ON CONFLICT(sku) DO UPDATE SET
        price = excluded.price,
        quantity = excluded.quantity
    `);

    const runTransaction = db.transaction((items) => {
      for (const item of items) {
        insertOrUpdate.run(item);
      }
    });

    runTransaction(productsToSave);

    return res.status(200).json({
      success: true,
      message: `Данные успешно обновлены. Обработано товаров: ${productsToSave.length}`,
    });
  } catch (error) {
    console.error('Ошибка импорта:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};
