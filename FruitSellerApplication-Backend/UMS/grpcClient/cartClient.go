package grpcClient

import (
	"context"
	"fmt"
	"log"
	cartProto "proto/cartProto"
	"time"

	"github.com/cenkalti/backoff"
	"google.golang.org/grpc"
)

type CartServiceGrpcClient interface {
	DeleteUserEvent(cartID string) error
	CloseCartClient()
}

type CartServiceClient struct {
	CartConn   *grpc.ClientConn
	CartClient cartProto.CartServiceClient
}

func NewCartServiceClient() (*CartServiceClient, error) {
	var cartClient cartProto.CartServiceClient
	var cartConn *grpc.ClientConn
	var err error

	bo := backoff.NewExponentialBackOff()
	bo.MaxElapsedTime = 1 * time.Minute

	err = backoff.Retry(func() error {
		cartClient, cartConn, err = createCartClient()
		if err != nil {
			log.Printf("Failed to create gRPC clients: %v", err)
			return err
		}
		return nil
	}, bo)

	if err != nil {
		return nil, fmt.Errorf("failed to connect to Grpc Server: %v", err)
	}

	return &CartServiceClient{
		CartConn:   cartConn,
		CartClient: cartClient,
	}, nil
}

func createCartClient() (cartProto.CartServiceClient, *grpc.ClientConn, error) {
	cartConn, err := grpc.Dial("localhost:50031", grpc.WithInsecure())
	if err != nil {
		return nil, nil, fmt.Errorf("failed to connect to TMS: %v", err)
	}
	return cartProto.NewCartServiceClient(cartConn), cartConn, nil
}

func (c *CartServiceClient) CloseCartClient() {
	c.CartConn.Close()
}

func (c *CartServiceClient) DeleteUserEvent(cartID string) error {
	resp, err := c.CartClient.DeleteUserAction(context.Background(), &cartProto.DeleteUserActionRequest{CartID: cartID})
	if err != nil || resp.Success {
		log.Printf("Deleting carts error: %v", err)
		return err
	}
	return nil
}
