package domain

import (
	proto "FruitSellerApplicationEMS/Proto/eventProto"
	"FruitSellerApplicationEMS/model"
	"errors"
	"log"

	"github.com/lib/pq"
)

const (
	AppID                                 = "EMS"
	postgresUniqueConstraintViolationCode = "23505"
)

// defining custom errors
var (
	// when event already exists...
	ErrEventAlreadyExists = errors.New("event already exists")
	// when no event with the provided data is found
	ErrEventNotFound = errors.New("requested event not found")
	// error while creating the event
	ErrEventCreation = errors.New("failed to create the event")
	// error while getting the event
	ErrEventGet = errors.New("failed to get the event")
	// error while updating the event
	ErrEventUpdation = errors.New("failed to update the event")
	// error while deleting the event
	ErrEventDeletion = errors.New("failed to delete the event")
	// no change is made to the table
	ErrNoChangesMade = errors.New("no changes made")
)

func (s *DomainService) GetEvents(AppID string) ([]model.EventResponse, error) {
	sqlStatement := `SELECT "eventID","topic", "payload", "appID","createdAtUTC","updatedAtUTC" FROM "event_table" WHERE "appID"=$1 ORDER BY "createdAtUTC" ASC`
	rows, err := s.db.Query(sqlStatement, AppID)
	if err != nil {
		log.Println("[Error:GetEvent]:", err.Error())
		return nil, ErrEventGet
	}
	defer rows.Close()
	Events := []model.EventResponse{}
	for rows.Next() {
		var event model.EventResponse
		err := rows.Scan(&event.EventID, &event.Topic, &event.Payload, &event.AppID, &event.CreatedAtUTC, &event.UpdatedAtUTC)
		if err != nil {
			log.Println("[Error:GetEvent]:", err.Error())
			return nil, ErrEventGet
		}
		Events = append(Events, event)
	}
	return Events, nil
}

func (s *DomainService) GetAllEvents() ([]model.EventResponse, error) {
	sqlStatement := `SELECT "eventID","topic", "payload", "appID","createdAtUTC","updatedAtUTC" FROM "event_table" ORDER BY "createdAtUTC" ASC`
	rows, err := s.db.Query(sqlStatement)
	if err != nil {
		log.Println("[Error:GetEvent]:", err.Error())
		return nil, ErrEventGet
	}
	defer rows.Close()
	Events := []model.EventResponse{}
	for rows.Next() {
		var event model.EventResponse
		err := rows.Scan(&event.EventID, &event.Topic, &event.Payload, &event.AppID, &event.CreatedAtUTC, &event.UpdatedAtUTC)
		if err != nil {
			log.Println("[Error:GetEvent]:", err.Error())
			return nil, ErrEventGet
		}
		Events = append(Events, event)
	}
	return Events, nil
}

func (s *DomainService) AddEvent(event *proto.PublishRequest) error {
	sqlStatement := `INSERT INTO "event_table"("topic", "payload", "appID") VALUES($1, $2, $3);`
	if _, err := s.db.Exec(sqlStatement, event.Topic, event.Payload, event.AppID); err != nil {
		pqErr, ok := err.(*pq.Error)
		if ok {
			if pqErr.Code == postgresUniqueConstraintViolationCode {
				switch pqErr.Constraint {
				case "events_tabel_eventID":
					log.Println("[Error:CreateEvent]:", pqErr.Message)
					return ErrEventAlreadyExists
				default:
					log.Println("[Error:CreateEvent]:", pqErr.Message)
					return ErrEventCreation
				}
			}
			log.Println("[Error:CreateEvent]:", pqErr.Message)
			return ErrEventCreation
		}
		log.Println("[Error:CreateEvent]:", err.Error())
		return ErrEventCreation
	}
	return nil
}

func (s *DomainService) RemoveEvents(appID string) error {
	sqlStatement := `DELETE FROM "event_table" WHERE "appID" = $1`
	_, err := s.db.Exec(sqlStatement, appID)

	if err != nil {
		log.Println("[Error:RemoveEvents]:", err.Error())
		return ErrEventDeletion
	}

	return nil
}

func (s *DomainService) RemoveEvent(eventID string) error {
	sqlStatement := `DELETE FROM "event_table" WHERE "eventID" = $1`
	_, err := s.db.Exec(sqlStatement, eventID)

	if err != nil {
		log.Println("[Error:RemoveEvent]:", err.Error())
		return ErrEventDeletion
	}

	return nil
}
