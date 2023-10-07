package domain

import (
	"context"
	"log"
	"time"
)

const (
	timeout time.Duration = 100
	AppID                 = "CMS"
)

func (s *CartService) DBStatus() (bool, error) {
	// calling db health check
	ctx, cancel := context.WithTimeout(context.Background(), timeout*time.Second)
	defer cancel()
	err := s.db.PingContext(ctx)
	if err != nil {
		log.Printf("[Error]: Ping Context error")
		return false, err
	}
	return true, nil
}
