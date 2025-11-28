import * as Sqlite from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const Database: any = (Sqlite as any).default || (Sqlite as any);

const dbPath = path.resolve(__dirname, "../../database.sqlite");
const db: any = new Database(dbPath);

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    createdAt TEXT NOT NULL
  )
`;

db.exec(createTableQuery);

export default db;
