// src/database/index.ts
import db from './connection.js'
import { initializeSchema } from './schema.js'

initializeSchema()

export default db