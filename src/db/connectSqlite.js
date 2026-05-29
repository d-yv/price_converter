import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.resolve(__dirname, 'products.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku TEXT UNIQUE NOT NULL,
    price REAL DEFAULT 0,
    quantity INTEGER DEFAULT 0
  )
`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_products_sku ON products (sku)`);

export default db;
