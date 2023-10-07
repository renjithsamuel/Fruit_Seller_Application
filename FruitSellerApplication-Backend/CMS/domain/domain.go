package domain

import (
	"FruitSellerApplicationCMS/model"
	"database/sql"
)

type Service interface {
	// regular cart events
	GetCart(userID string) (*model.GetCartResponse, error)
	AddToCart(request *model.AddToCartRequest) error
	UpdateCartItem(request *model.AddToCartRequest) error
	RemoveFromCart(userID, itemID string) error
	ClearCart(userID string) error
	CreateCart(cartID, userID string) error
	DBStatus() (bool, error)
	// for storing failed events in event table
	StoreEvent(event *model.EventRequest) error
	GetEvents() ([]model.EventResponse, error)
	RemoveEvents() error
	DeleteUserAction(cartID string) error
}

type CartService struct {
	db *sql.DB
}

func NewCartService(db *sql.DB) *CartService {
	return &CartService{
		db: db,
	}
}
