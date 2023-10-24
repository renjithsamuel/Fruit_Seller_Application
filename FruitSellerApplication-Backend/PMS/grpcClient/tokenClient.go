package grpcClient

import (
	"context"
	"fmt"
	"log"
	tokenProto "FruitSellerApplicationPMS/Proto/userTokenProto"
	"time"

	"github.com/cenkalti/backoff"
	"google.golang.org/grpc"
)

type TokenServiceGrpcClient interface {
	ValidateToken(token string) (string, string, error)
	Close()
}

type TokenServiceClient struct {
	TokenConn   *grpc.ClientConn
	TokenClient tokenProto.TokenGrpcServiceClient
}

func NewTokenServiceClient() (*TokenServiceClient, error) {
	var tokenClient tokenProto.TokenGrpcServiceClient
	var tokenConn *grpc.ClientConn
	var err error

	bo := backoff.NewExponentialBackOff()
	bo.MaxElapsedTime = 1 * time.Minute

	err = backoff.Retry(func() error {
		tokenClient, tokenConn, err = createTokenClient()
		if err != nil {
			log.Printf("Failed to create gRPC clients: %v", err)
			return err
		}
		return nil
	}, bo)

	if err != nil {
		return nil, fmt.Errorf("failed to connect to EMS: %v", err)
	}

	return &TokenServiceClient{
		TokenConn:   tokenConn,
		TokenClient: tokenClient,
	}, nil
}

func createTokenClient() (tokenProto.TokenGrpcServiceClient, *grpc.ClientConn, error) {
	tokenConn, err := grpc.Dial("fruitseller-go-tms.onrender.com:50021", grpc.WithInsecure())
	if err != nil {
		return nil, nil, fmt.Errorf("failed to connect to TMS: %v", err)
	}
	return tokenProto.NewTokenGrpcServiceClient(tokenConn), tokenConn, nil
}

func (c *TokenServiceClient) Close() {
	c.TokenConn.Close()
}

func (c *TokenServiceClient) ValidateToken(token string) (string, string, error) {
	resp, err := c.TokenClient.VerifyToken(context.Background(), &tokenProto.VerifyTokenRequest{Token: token})
	if err != nil {
		log.Printf("TMS Token Verification error: %v", err)
		return "", "", err
	}
	return resp.UserID, resp.Message, nil
}
