import { Database } from "bun:sqlite";

// Membuat atau membuka database SQLite
const db = new Database("dev.db");

// Membuat tabel jika belum ada
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT
  )
`);

export default db;