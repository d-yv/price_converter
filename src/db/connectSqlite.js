import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

// Корректное определение путей для ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbInstance = null;

export async function connectDB() {
  // Паттерн Singleton: возвращаем существующее подключение, если оно уже создано
  if (dbInstance) return dbInstance;

  // База данных будет создана в корне папки 'src/db' под именем 'database.sqlite'
  dbInstance = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database,
  });

  // Инициализация таблиц
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL
    );
  `);

  console.log('--- SQLite база данных успешно подключена ---');
  return dbInstance;
}

// Экспортируем функцию для получения текущего инстанса в контроллерах
export const getDB = () => {
  if (!dbInstance) throw new Error('База данных еще не инициализирована!');
  return dbInstance;
};
