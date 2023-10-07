package model

import "time"

type EventRequest struct {
	Topic   string `json:"topic" binding:"required"`
	Payload []byte `json:"payload" binding:"required"`
	AppID   string `json:"appID" binding:"required"`
}

type EventResponse struct {
	EventID      string    `json:"eventID" binding:"required,uuid"`
	Topic        string    `json:"topic" binding:"required"`
	Payload      []byte    `json:"payload" binding:"required"`
	AppID        string    `json:"appID" binding:"required"`
	CreatedAtUTC time.Time `json:"createdAtUTC"`
	UpdatedAtUTC time.Time `json:"updatedAtUTC"`
}
