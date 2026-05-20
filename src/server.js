import express from 'express';
import { connectDB } from './db/connectSqlite.js';

const app = express();
const PORT = 3000;

// Мидлвары для работы с JSON и URL-encoded данными
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Функция для запуска приложения
async function startServer() {
  try {
    // 1. Сначала подключаем БД
    await connectDB();

    // 2. Подключаем ваши роуты (после создания папки controllers)
    // app.use('/api', myRoutes);

    // Временный тестовый эндпоинт прямо здесь для проверки работы БД
    app.get('/test-db', async (req, res) => {
      try {
        const { getDB } = await import('./db/connectSqlite.js');
        const db = getDB();

        // Тестовая вставка
        await db.run('INSERT INTO items (name, price) VALUES (?, ?)', [
          'Тестовый товар',
          99.9,
        ]);

        // Тестовая выборка
        const items = await db.all('SELECT * FROM items');
        res.json({ success: true, data: items });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    });

    app.listen(PORT, () => {
      console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Критическая ошибка при старте сервера:', error);
    process.exit(1);
  }
}

startServer();
