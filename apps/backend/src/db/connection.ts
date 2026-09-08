import { DatabaseSync } from 'node:sqlite'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'vestta.db')

const db = new DatabaseSync(DB_PATH)

db.exec('PRAGMA journal_mode = WAL')
db.exec('PRAGMA foreign_keys = ON')

export default db