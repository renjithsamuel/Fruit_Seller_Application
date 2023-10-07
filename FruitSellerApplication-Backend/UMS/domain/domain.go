package domain

import (
	"FruitSellerApplicationUMS/model"
	"database/sql"
)

type Service interface {
	// user functions
	DBStatus() (bool, error)
	CreateUser(user *model.UserCreateRequest) (*model.RegisterUser, error)
	LoginUser(user *model.UserLoginRequest) (*string, *string, error)
	GetUser(userID string) (*model.UserGetResponse, error)
	PutUser(user *model.UserPutRequest, UserID string) error
	DeleteUser(userID string) (*string, error)
	// event functions
	StoreEvent(event *model.EventRequest) error
	GetEvents() ([]model.EventResponse, error)
	RemoveEvents() error
	// cart functions
	UpdateCartID(userID, cartID string) error
}

type UserService struct {
	db *sql.DB
}

func NewUserService(db *sql.DB) *UserService {
	return &UserService{
		db: db,
	}
}
