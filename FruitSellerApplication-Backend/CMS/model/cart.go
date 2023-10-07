package model

import "time"

type GetCartResponse struct {
	CartID string     `json:"userID"`
	Items  []CartItem `json:"items"`
}

type CartItem struct {
	ProductID string `json:"productID"`
	Quantity  int    `json:"quantity"`
}

type AddToCartRequest struct {
	CartID    string `json:"cartID" binding:"required,uuid"`
	ProductID string `json:"productID" binding:"required,uuid"`
	Quantity  int    `json:"quantity" binding:"required"`
}

type RemoveFromCartRequest struct {
	CartID    string `uri:"cartID" json:"cartID" form:"id" binding:"required,uuid"`
	ProductID string `uri:"productID" json:"productID" form:"id" binding:"required,uuid"`
}

type RequestParams struct {
	CartID string `uri:"cartID" json:"cartID" binding:"required,uuid"`
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

type Payload struct {
	CartID string `json:"cartID" binding:"required,uuid"`
	UserID string `json:"userID" binding:"required,uuid"`
}
