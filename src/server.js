import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import upload from './middleware/upload.js';
import { importXlsx } from './controller/productController.js';
import db from './db/connectSqlite.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Глобальні middleware
app.use(logger);
app.use(express.json());
app.use(cors());

// мої маршрути
app.post('/api/upload-xlsx', upload.single('file'), importXlsx);

app.use(notFoundHandler);
app.use(errorHandler);

await db;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
