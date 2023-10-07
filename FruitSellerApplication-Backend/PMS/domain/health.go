package domain

import (
	"context"
	"log"
	"time"
)

const (
	timeout time.Duration = 100
)

func (s *ProductService) DBStatus() (bool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout*time.Second)
	defer cancel()
	err := s.db.PingContext(ctx)
	if err != nil {
		log.Printf("[Error:Ping Context Error]")
		return false, err
	}
	return true, nil
}
