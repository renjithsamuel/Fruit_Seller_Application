package grpcClient

import (
	"FruitSellerApplicationUMS/domain"
	"FruitSellerApplicationUMS/model"
	eventProto "FruitSellerApplicationUMS/Proto/eventProto"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"google.golang.org/grpc"
)

type EventServiceGrpcClient interface {
	PublishUserCreated(registerUser *model.RegisterUser)
	SubscribeToCartCreated() error
	ResendFailedEvents()
	CloseEventClient()
}

type EventServiceClient struct {
	domain      domain.Service
	EventConn   *grpc.ClientConn
	EventClient eventProto.EventServiceClient
}

func NewEventServiceClient(domain domain.Service) (*EventServiceClient, error) {
	var eventClient eventProto.EventServiceClient
	var eventConn *grpc.ClientConn
	var err error

	for {
		eventClient, eventConn, err = createEventClient()
		if err != nil {
			log.Printf("Failed to create gRPC clients: %v", err)
			log.Println("Retrying in 5 seconds...")
			time.Sleep(5 * time.Second)
			continue
		}
		break
	}

	return &EventServiceClient{
		domain:      domain,
		EventConn:   eventConn,
		EventClient: eventClient,
	}, nil
}

func createEventClient() (eventProto.EventServiceClient, *grpc.ClientConn, error) {
	eventConn, err := grpc.Dial("fruitseller-go-ems.onrender.com:50051", grpc.WithInsecure())
	if err != nil {
		return nil, nil, fmt.Errorf("failed to connect to EMS: %v", err)
	}
	return eventProto.NewEventServiceClient(eventConn), eventConn, nil
}

func (c *EventServiceClient) CloseEventClient() {
	c.EventConn.Close()
}

func (c *EventServiceClient) PublishUserCreated(registerUser *model.RegisterUser) {
	fmt.Println("publishing user created event", registerUser.UserID, registerUser.CartID)
	payload := make(map[string]interface{})
	payload["userID"] = registerUser.UserID
	payload["cartID"] = registerUser.CartID
	payloadJSON, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Error marshaling payload: %v", err)
		return // Handle the error appropriately
	}
	request := eventProto.PublishRequest{
		Topic:   "user_created",
		Payload: []byte(payloadJSON),
		AppID:   domain.AppID,
	}
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if c.EventClient == nil {
		log.Println("EventClient is nil. Cannot publish event.")
		return
	}
	resp, err := c.EventClient.Publish(ctx, &request)
	if err != nil || resp.Success {
		// store in event table
		fmt.Println("[EMSerr] : Storing user_created event in event_table!")
		storeEvent := model.EventRequest{
			Topic:   "user_created",
			Payload: []byte(payloadJSON),
			AppID:   domain.AppID,
		}
		if err := c.domain.StoreEvent(&storeEvent); err != nil {
			fmt.Println("Error While storing Event : ", err.Error())
		}

	}
	fmt.Println("user created event published!", registerUser)
}

func (c *EventServiceClient) SubscribeToCartCreated() error {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	request := &eventProto.SubscribeRequest{
		Topic: "cart_created",
		AppID: "UMS",
	}

	stream, err := c.EventClient.Subscribe(ctx, request)
	if err != nil {
		log.Printf("[Error subscribing to user_created] events: %v \n", err)
		return err
	}

	go func() {
		c.ResendFailedEvents()
	}()

	for {
		response, err := stream.Recv()
		fmt.Println("recieved cart_created stream in CMS")
		if err != nil {
			log.Printf("[Error receiving event]: %v", err)
			return err
		}

		registerUser := extractID(response.Payload)

		log.Printf("[Received cart_created] event with cartID:  %s and UserID : %s with topic  : %s ", registerUser.CartID, registerUser.UserID, response.Topic)
	}
}

func extractID(payload []byte) *model.RegisterUser {
	var user model.RegisterUser
	err := json.Unmarshal(payload, &user)
	if err != nil {
		log.Printf("[Error unmarshaling] payload: %v", err)
		return nil // Handle the error appropriately - very bad
	}
	return &user
}

func (c *EventServiceClient) ResendFailedEvents() {
	log.Println("resending failed events to EMS")
	Events, err := c.domain.GetEvents()
	if err != nil {
		log.Printf("[Something went wrong] while resending failed events : %s \n", err)
		return
	}
	if len(Events) > 0 {
		for _, Event := range Events {
			user := extractID(Event.Payload)
			c.PublishUserCreated(user)
			log.Println("removing events from the event store with app ID")
			err = c.domain.RemoveEvents()
			if err != nil {
				log.Printf("[Something went wrong ]while removing events from event Store : %s \n", err)
			}
		}
	}
}
