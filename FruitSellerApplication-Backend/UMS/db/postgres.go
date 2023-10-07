package db

import (
	"database/sql"
	_ "github.com/lib/pq"
	"log"
	"time"
)

var (
	quitRetry = make(chan bool)
)

func Connect2DB(connStr string, retryFrequency time.Duration) *sql.DB {
	for {
		select {
		case <-time.After(retryFrequency):
			DB, err := sql.Open("postgres", connStr)
			if err != nil {
				log.Println("error connecting to database: ", err)
			} else {
				return DB
			}
			log.Printf("reconnecting after : %v milliseconds\n", retryFrequency)
		case <-quitRetry:
			return nil
		}
	}
}
