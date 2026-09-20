package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func Init() error {
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = filepath.Join("..", "backend", "vestta.db")
	}

	var err error
	DB, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		return fmt.Errorf("error abriendo base de datos: %w", err)
	}

	if err = DB.Ping(); err != nil {
		return fmt.Errorf("error conectando a la base de datos: %w", err)
	}

	log.Printf("Base de datos conectada: %s", dbPath)
	return nil
}
