package model

import "time"

type UserCreateRequest struct {
	Name              string `json:"name" binding:"required,min=2,max=50,alpha"` // alpha
	DateOfBirth       string `json:"dateOfBirth" binding:"required"`             // date check
	Role              string `json:"role" binding:"required,oneof=buyer seller"`
	Email             string `json:"email" binding:"required,email,min=3,max=64"`
	PhoneNumber       string `json:"phoneNumber" binding:"omitempty"`
	PreferredLanguage string `json:"preferredLanguage" binding:"required"`
	Address           string `json:"address" binding:"required,min=10,max=50"`
	Country           string `json:"country" binding:"required"`
	Password          string `json:"password" binding:"required,min=8,max=20,validatepassword"`
}

type UserLoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8,max=20"`
}

type UserGetResponse struct {
	Name              string    `json:"name"`
	DateOfBirth       time.Time `json:"dateOfBirth"`
	Role              string    `json:"role"`
	Email             string    `json:"email"`
	PhoneNumber       string    `json:"phoneNumber"`
	PreferredLanguage string    `json:"preferredLanguage"`
	Address           string    `json:"address"`
	Country           string    `json:"country"`
	CartID            string    `json:"cartID"`
	CreatedAtUTC      time.Time `json:"createdAtUTC"`
	UpdatedAtUTC      time.Time `json:"updatedAtUTC"`
}

type UserPutRequest struct {
	Name              string `json:"name" binding:"required,min=2,max=50"`
	DateOfBirth       string `json:"dateOfBirth" binding:"required"`
	Role              string `json:"role" binding:"required,oneof=buyer seller"`
	Email             string `json:"email" binding:"required,email"`
	PreferredLanguage string `json:"preferredLanguage" binding:"required"`
	Address           string `json:"address" binding:"required,min=10,max=50"`
	Country           string `json:"country" binding:"required"`
	PhoneNumber       string `json:"phoneNumber" binding:"omitempty"`
}

type RequestParams struct {
	ID string `uri:"userID" json:"userID" binding:"required,uuid"`
}

// event models
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

type RegisterUser struct {
	CartID string `json:"cartID" binding:"required,uuid"`
	UserID string `json:"userID" binding:"required,uuid"`
}
