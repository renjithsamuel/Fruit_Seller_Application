package domain

import (
	"FruitSellerApplicationCMS/model"
	"errors"
	"log"

	"github.com/lib/pq"
)

const (
	postgresUniqueConstraintViolationCode = "23505"
)

// defining custom errors
var (
	// Cart already exists...
	ErrCartAlreadyExists = errors.New("Cart already exists")
	// no Cart with the provided data is found
	ErrCartNotFound = errors.New("requested Cart not found")
	// error while creating the Cart
	ErrCartCreation = errors.New("failed to create the Cart")
	// error while getting the Cart
	ErrCartGet = errors.New("failed to get the Cart")
	// error while updating the Cart
	ErrCartUpdation = errors.New("failed to update the Cart")
	// error while deleting the Cart
	ErrCartDeletion = errors.New("failed to delete the Cart")
	// password doesn't match error
	ErrIncorrectPassword = errors.New("incorrect password")
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

func (s *CartService) AddToCart(request *model.AddToCartRequest) error {
	// update the total cost of the application is pending
	sqlStatement := `SELECT COUNT(*) FROM "cart_items" WHERE "cartID" = $1 AND "productID" = $2`
	var count int
	err := s.db.QueryRow(sqlStatement, request.CartID, request.ProductID).Scan(&count)
	if err != nil {
		log.Println("[Error:AddToCart]:", err.Error())
		return ErrCartCreation
	}

	if count > 0 {
		// Update the quantity
		sqlStatement = `UPDATE "cart_items" SET quantity = quantity + $1 WHERE "cartID" = $2 AND "productID" = $3`
		_, err := s.db.Exec(sqlStatement, request.Quantity, request.CartID, request.ProductID)
		if err != nil {
			log.Println("[Error:AddToCart]:", err.Error())
			return ErrCartCreation
		}
	} else {
		// Insert a new cart item
		sqlStatement = `INSERT INTO "cart_items" ("cartID", "productID", "quantity") VALUES ($1, $2, $3)`
		_, err := s.db.Exec(sqlStatement, request.CartID, request.ProductID, request.Quantity)
		if err != nil {
			log.Println("[Error:AddToCart]:", err.Error())
			return ErrCartCreation
		}
	}

	return nil
}

func (s *CartService) RemoveFromCart(cartID string, productID string) error {
	sqlStatement := `DELETE FROM "cart_items" WHERE "cartID" = $1 AND "productID" = $2`
	result, err := s.db.Exec(sqlStatement, cartID, productID)

	if err != nil {
		log.Println("[Error:RemoveFromCart]:", err.Error())
		return ErrCartDeletion
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Println("[Error:RemoveFromCart]:", err.Error())
		return ErrCartDeletion
	}

	if rowsAffected == 0 {
		log.Println("[Error:RemoveFromCart]: cart not found")
		return ErrCartNotFound
	}

	return nil
}

func (s *CartService) GetCart(cartID string) (*model.GetCartResponse, error) {
	// total cost pending
	sqlStatement := `SELECT "productID", "quantity" FROM "cart_items" WHERE "cartID" = $1`
	rows, err := s.db.Query(sqlStatement, cartID)
	if err != nil {
		log.Println("[Error:GetCart]:", err.Error())
		return nil, ErrCartGet
	}
	defer rows.Close()
	cart := &model.GetCartResponse{CartID: cartID, Items: []model.CartItem{}}
	for rows.Next() {
		var item model.CartItem
		err := rows.Scan(&item.ProductID, &item.Quantity)
		if err != nil {
			log.Println("[Error:GetCart]:", err.Error())
			return nil, ErrCartGet
		}
		cart.Items = append(cart.Items, item)
	}
	return cart, nil
}

func (s *CartService) ClearCart(cartID string) error {
	sqlStatement := `DELETE FROM "cart_items" WHERE "cartID" = $1`
	_, err := s.db.Exec(sqlStatement, cartID)
	if err != nil {
		log.Println("[Error:ClearCart]:", err.Error())
		return ErrCartDeletion
	}
	return nil
}

func (s *CartService) UpdateCartItem(request *model.AddToCartRequest) error {
	// executing the query and error handling
	sqlStatement := `UPDATE "cart_items" SET "quantity" = $1 WHERE "cartID" = $2 AND "productID" = $3`
	result, err := s.db.Exec(sqlStatement, request.Quantity, request.CartID, request.ProductID)

	if err != nil {
		log.Println("[Error:UpdateCartItem]:", err.Error())
		return ErrCartUpdation
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Println("[Error:UpdateCartItem]:", err.Error())
		return ErrCartUpdation
	}

	if rowsAffected == 0 {
		log.Println("[Error:UpdateCartItem]: No changes made")
		return ErrCartNotFound
	}

	return nil
}

func (s *CartService) CreateCart(cartID, userID string) error {
	// executing the create query and error handling
	sqlStatement := `INSERT INTO "carts"("cartID","userID") VALUES($1, $2);`
	if _, err := s.db.Exec(sqlStatement, cartID, userID); err != nil {
		pqErr, ok := err.(*pq.Error)
		if ok {
			if pqErr.Code == postgresUniqueConstraintViolationCode {
				switch pqErr.Constraint {
				case "carts_userID":
					log.Println("[Error:StoreEvent]:", pqErr.Message)
					return ErrCartAlreadyExists
				default:
					log.Println("[Error:StoreEvent]:", pqErr.Message)
					return ErrCartCreation
				}
			}
			log.Println("[Error:StoreEvent]:", pqErr.Message)
			return ErrCartCreation
		}
		log.Println("[Error:StoreEvent]:", err.Error())
		return ErrCartCreation
	}
	return nil
}

func (s *CartService) StoreEvent(event *model.EventRequest) error {
	// executing the create query and error handling
	sqlStatement := `INSERT INTO "event_table"("topic", "data", "appID") VALUES($1, $2, $3, $4);`
	if _, err := s.db.Exec(sqlStatement, event.Topic, event.Payload, event.AppID); err != nil {
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

func (s *CartService) GetEvents() ([]model.EventResponse, error) {
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

func (s *CartService) RemoveEvents() error {
	sqlStatement := `DELETE FROM "event_table"`
	_, err := s.db.Exec(sqlStatement)

	if err != nil {
		log.Println("[Error:RemoveEvents]:", err.Error())
		return ErrEventDeletion
	}

	return nil
}

func (s *CartService) DeleteUserAction(cartID string) error {
	sqlStatement := `DELETE FROM "cart_items" WHERE "cartID" = $1`
	_, err := s.db.Exec(sqlStatement, cartID)

	if err != nil {
		log.Println("[Error:DeleteUserAction]:", err.Error())
		return ErrEventDeletion
	}

	sqlStatement = `DELETE FROM "carts" WHERE "cartID" = $1`
	_, err = s.db.Exec(sqlStatement, cartID)

	if err != nil {
		log.Println("[Error:DeleteUserAction]:", err.Error())
		return ErrEventDeletion
	}

	return nil
}
