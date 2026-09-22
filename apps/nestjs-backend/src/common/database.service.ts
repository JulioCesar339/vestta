import { Injectable, OnModuleInit, Logger } from '@nestjs/common'
import { DatabaseSync } from 'node:sqlite'
import path from 'path'

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name)
  private db!: DatabaseSync

  onModuleInit() {
    const dbPath = process.env.DB_PATH ??
      path.resolve(__dirname, '..', '..', '..', 'backend', 'vestta.db')

    this.db = new DatabaseSync(dbPath)
    this.db.exec('PRAGMA journal_mode = WAL')
    this.db.exec('PRAGMA foreign_keys = ON')
    this.logger.log(`Base de datos conectada: ${dbPath}`)
  }

  getDb(): DatabaseSync {
    return this.db
  }
}
