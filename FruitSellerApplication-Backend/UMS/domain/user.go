package domain

import (
	"FruitSellerApplicationUMS/model"
	"database/sql"
	"errors"
	"log"
	"time"

	"github.com/lib/pq"
)

const (
	postgresUniqueConstraintViolationCode = "23505"
)

// defining custom errors
var (
	// when user already exists...
	ErrUserAlreadyExists = errors.New("user already exists")
	// when no user with the provided data is found
	ErrUserNotFound = errors.New("requested user not found")
	// error while creating the user
	ErrUserCreation = errors.New("failed to create the user")
	// error while getting the user
	ErrUserGet = errors.New("failed to get the user")
	// error while updating the user
	ErrUserUpdation = errors.New("failed to update the user")
	// error while deleting the user
	ErrUserDeletion = errors.New("failed to delete the user")
	// password doesn't match error
	ErrIncorrectPassword = errors.New("wrong username or password")
	// no change is made to the table
	ErrNoChangesMade = errors.New("no changes made")
	// event creation error
	ErrEventCreation = errors.New("failed to create the event")
	// when event already exists...
	ErrEventAlreadyExists = errors.New("event already exists")
	// error while getting the event
	ErrEventGet = errors.New("failed to get the event")
	// error while deleting the event
	ErrEventDeletion = errors.New("failed to delete the event")
)

func (ts *UserService) GetUser(userID string) (*model.UserGetResponse, error) {
	// initializing the user model
	user := model.UserGetResponse{}
	sqlStatement := `SELECT "userID",
							"name", 
							"dateOfBirth",
							"role",
							"email",
							"phoneNumber",
							"preferredLanguage",
							"address",
							"country",
							"createdAtUTC",
							"updatedAtUTC",
							"cartID" 
					    FROM "users" WHERE "userID"=$1`
	if err := ts.db.QueryRow(sqlStatement, userID).Scan(&user.UserID, &user.Name, &user.DateOfBirth, &user.Role, &user.Email, &user.PhoneNumber, &user.PreferredLanguage, &user.Address, &user.Country, &user.CreatedAtUTC, &user.UpdatedAtUTC, &user.CartID); err != nil {
		if errors.Is(sql.ErrNoRows, err) {
			return nil, ErrUserNotFound
		}
		log.Println("[Error:GetUser]:", err.Error())
		return nil, ErrUserGet
	}
	// successfull fetching
	return &user, nil
}

func (ts *UserService) LoginUser(user *model.UserLoginRequest) (*string, *string, error) {
	// fetching and verifying user wth email and password
	sqlStatement := `SELECT "userID", "password" FROM "users" WHERE "email" = $1`
	var userID string
	var storedPassword string
	err := ts.db.QueryRow(sqlStatement, user.Email).Scan(&userID, &storedPassword)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			log.Println("[Error:LoginUser]:", err.Error())
			return nil, nil, ErrUserNotFound
		}
		log.Println("[Error:LoginUser]:", err.Error())
		return nil, nil, ErrUserGet
	}
	// successfull verification
	return &userID, &storedPassword, nil
}

func (ts *UserService) CreateUser(user *model.UserCreateRequest) (*model.RegisterUser, error) {
	registerUser := model.RegisterUser{}
	// executing the create query and error handling
	sqlStatement := `INSERT INTO "users"("name", "dateOfBirth", "role", "email", "phoneNumber", "preferredLanguage", "address", "country", "password" ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING "cartID", "userID";`
	if err := ts.db.QueryRow(sqlStatement, user.Name, user.DateOfBirth, user.Role, user.Email, user.PhoneNumber, user.PreferredLanguage, user.Address, user.Country, user.Password).Scan(&registerUser.CartID, &registerUser.UserID); err != nil {
		pqErr, ok := err.(*pq.Error)
		if ok {
			if pqErr.Code == postgresUniqueConstraintViolationCode {
				switch pqErr.Constraint {
				case "users_email_key":
					log.Println("[Error:CreateUser]:", pqErr.Message)
					return nil, ErrUserAlreadyExists
				default:
					log.Println("[Error:CreateUser]:", pqErr.Message)
					return nil, ErrUserCreation
				}
			}
			log.Println("[Error:CreateUser]:", pqErr.Message)
			return nil, ErrUserCreation
		}
		log.Println("[Error:CreateUser]:", err.Error())
		return nil, ErrUserCreation
	}

	return &registerUser, nil
}

func (ts *UserService) PutUser(user *model.UserPutRequest, userID string) error {
	// parsing date object
	dateOfBirth, err := time.Parse("2006-01-02", user.DateOfBirth)
	if err != nil {
		log.Println("[Error:PutUser]: Failed to parse date of birth")
		return ErrUserUpdation
	}
	dateOfBirthFormatted := dateOfBirth.Format(time.RFC3339)

	// executing the query and error handling
	sqlStatement := `UPDATE "users" SET "name" = $1, "dateOfBirth" = $2, "role" = $3, 
	"email" = $4, "phoneNumber" = $5, "preferredLanguage" = $6 , "address" = $7 , "country" = $8 ,
	 "updatedAtUTC" = NOW() WHERE "userID" = $9`

	result, err := ts.db.Exec(sqlStatement, user.Name, dateOfBirthFormatted, user.Role,
		user.Email, user.PhoneNumber, user.PreferredLanguage, user.Address, user.Country, userID)

	if err != nil {
		log.Println("[Error:PutUser]:", err.Error())
		return ErrUserUpdation
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Println("[Error:PutUser]:", err.Error())
		return ErrUserUpdation
	}

	if rowsAffected == 0 {
		log.Println("[Error:PutUser]: No changes made")
		return ErrUserNotFound
	}

	return nil
}

func (ts *UserService) DeleteUser(userID string) (*string, error) {
	// deleting the user from table if it exists
	var cartID string
	sqlStatement := `SELECT "cartID" FROM "users" WHERE "userID" = $1`
	if err := ts.db.QueryRow(sqlStatement, userID).Scan(&cartID); err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrUserNotFound
		}
		log.Println("[Error:DeleteUser]:", err.Error())
		return nil, ErrUserDeletion
	}

	sqlStatement = `DELETE FROM "users" WHERE "userID" = $1`
	_, err := ts.db.Exec(sqlStatement, userID)

	if err != nil {
		log.Println("[Error:DeleteUser]:", err.Error())
		return nil, ErrUserDeletion
	}

	return &cartID, nil
}

func (ts *UserService) StoreEvent(event *model.EventRequest) error {
	// executing the create query and error handling
	sqlStatement := `INSERT INTO "event_table"("topic", "payload", "appID") VALUES($1, $2, $3);`
	if _, err := ts.db.Exec(sqlStatement, event.Topic, event.Payload, event.AppID); err != nil {
		pqErr, ok := err.(*pq.Error)
		if ok {
			if pqErr.Code == postgresUniqueConstraintViolationCode {
				switch pqErr.Constraint {
				case "event_table_data":
					log.Println("[Error:StoreEvent]:", pqErr.Message)
					return ErrEventAlreadyExists
				default:
					log.Println("[Error:StoreEvent]:", pqErr.Message)
					return ErrEventCreation
				}
			}
			log.Println("[Error:StoreEvent]:", pqErr.Message)
			return ErrEventCreation
		}
		log.Println("[Error:StoreEvent]:", err.Error())
		return ErrEventCreation
	}
	return nil
}

func (s *UserService) GetEvents() ([]model.EventResponse, error) {
	sqlStatement := `SELECT "eventID","topic", "payload", "appID","createdAtUTC","updatedAtUTC" FROM "event_table"`
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

func (s *UserService) RemoveEvents() error {
	sqlStatement := `DELETE FROM "event_table"`
	_, err := s.db.Exec(sqlStatement)

	if err != nil {
		log.Println("[Error:RemoveEvents]:", err.Error())
		return ErrEventDeletion
	}

	return nil
}

func (s *UserService) UpdateCartID(userID, cartID string) error {
	sqlStatement := `UPDATE "users" SET "cartID"=$1 WHERE "userID"=$2`
	_, err := s.db.Exec(sqlStatement, cartID, userID)

	if err != nil {
		log.Println("[Error:UpdateCartID]:", err.Error())
		return ErrUserUpdation
	}

	return nil
}
