package domain

import (
	"FruitSellerApplicationEMS/Proto/eventProto"
	"FruitSellerApplicationEMS/model"
	"database/sql"
)

type Service interface {
	AddEvent(event *eventProto.PublishRequest) error
	GetEvents(appID string) ([]model.EventResponse, error)
	GetAllEvents() ([]model.EventResponse, error)
	RemoveEvents(AppID string) error
	RemoveEvent(EventID string) error
}

type DomainService struct {
	db *sql.DB
}

func NewEventService(db *sql.DB) *DomainService {
	return &DomainService{
		db: db,
	}
}
