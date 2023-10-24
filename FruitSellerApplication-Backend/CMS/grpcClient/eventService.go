package grpcClient

import (
	eventProto "FruitSellerApplicationCMS/Proto/eventProto"
	"FruitSellerApplicationCMS/domain"
	"FruitSellerApplicationCMS/model"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"google.golang.org/grpc"
)

type EventServiceGrpcClient interface {
	SubscribeToUserCreated() error
	PublishCartCreated(cartID string, userID string)
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
			time.Sleep(5 * time.Second) // Wait for 5 seconds before retrying.
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

func (c *EventServiceClient) PublishCartCreated(cartID string, userID string) {
	fmt.Println("publishing cart created event", cartID)
	payload := make(map[string]interface{})
	payload["cartID"] = cartID
	payload["userID"] = userID
	payloadJSON, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Error marshaling payload: %v", err)
		return // Handle the error appropriately
	}
	request := eventProto.PublishRequest{
		Topic:   "cart_created",
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

	if err != nil || resp.Success != true {
		storeEvent := model.EventRequest{
			Topic:   "cart_created",
			Payload: []byte(payloadJSON),
			AppID:   domain.AppID,
		}
		c.domain.StoreEvent(&storeEvent)
	}
	fmt.Println("cart created event published!", cartID)
	return
}

func (c *EventServiceClient) SubscribeToUserCreated() error {
	request := &eventProto.SubscribeRequest{
		Topic: "user_created",
		AppID: "CMS",
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	stream, err := c.EventClient.Subscribe(ctx, request)
	if err != nil {
		log.Printf("Error subscribing to user_created events: %v \n", err)
		return err
	}

	go func() {
		c.ResendFailedEvents()
	}()

	for {
		response, err := stream.Recv()
		fmt.Println("recieved user_created stream in CMS", response)
		if err != nil {
			log.Printf("Error receiving event: %v \n", err)
			return err
		}
		cartID, userID := extractID(response.Payload)
		fmt.Println("creating new cart")
		err = c.domain.CreateCart(cartID, userID)
		if err != nil {
			log.Printf("Error creating cart : %v \n", err)
			return err
		}
		fmt.Println("new cart created")
		c.PublishCartCreated(cartID, userID)
		log.Printf("Received user_created event data: %s %s", response.Topic, userID)
	}
}

func extractID(payload []byte) (string, string) {
	var p model.Payload
	err := json.Unmarshal(payload, &p)
	if err != nil {
		log.Printf("Error unmarshaling payload: %v", err)
		return "", "" // Handle the error appropriately
	}
	return p.CartID, p.UserID
}

func (c *EventServiceClient) ResendFailedEvents() {
	log.Println("resending failed events to EMS")
	Events, err := c.domain.GetEvents()
	if err != nil {
		log.Printf("Something went wrong while resending failed events : %s \n", err)
		return
	}
	if len(Events) > 0 {
		for _, Event := range Events {
			CartID, UserID := extractID(Event.Payload)
			c.PublishCartCreated(CartID, UserID)
			log.Println("removing events from the event store with app ID")
			err = c.domain.RemoveEvents()
			if err != nil {
				log.Printf("Something went wrong while removing events from event Store : %s \n", err)
			}
		}
	}
}

func (c *EventServiceClient) CloseEventClient() {
	c.EventConn.Close()
}
