package grpcClient

import (
	"context"
	"fmt"
	"log"
	"time"

	productProto "FruitSellerApplicationCMS/Proto/productProto"

	"github.com/cenkalti/backoff"
	"google.golang.org/grpc"
)

type ProductServiceGrpcClient interface {
	VerifyProduct(productID string) (*productProto.ProductResponse, error)
	CloseProductClient()
}

type ProductServiceClient struct {
	ProductConn   *grpc.ClientConn
	ProductClient productProto.ProductServiceClient
}

func NewProductServiceClient() (*ProductServiceClient, error) {
	var productClient productProto.ProductServiceClient
	var productConn *grpc.ClientConn
	var err error
	bo := backoff.NewExponentialBackOff()
	bo.MaxElapsedTime = 1 * time.Minute
	err = backoff.Retry(func() error {
		productClient, productConn, err = createProductClient()
		if err != nil {
			log.Printf("Failed to create gRPC clients: %v", err)
			return err
		}
		return nil
	}, bo)

	if err != nil {
		return nil, fmt.Errorf("failed to connect to EMS: %v", err)
	}

	return &ProductServiceClient{
		ProductConn:   productConn,
		ProductClient: productClient,
	}, nil
}

func createProductClient() (productProto.ProductServiceClient, *grpc.ClientConn, error) {
	productConn, err := grpc.Dial("localhost:50041", grpc.WithInsecure())
	if err != nil {
		return nil, nil, fmt.Errorf("failed to connect to PMS: %v", err)
	}
	return productProto.NewProductServiceClient(productConn), productConn, nil
}

func (c *ProductServiceClient) VerifyProduct(productID string) (*productProto.ProductResponse, error) {
	product, err := c.ProductClient.GetProductById(context.Background(), &productProto.GetProductByIdRequest{ProductID: productID})
	if err != nil {
		log.Println("[VerifyProduct]:", err)
		return nil, err
	}
	return product, nil
}

func (c *ProductServiceClient) CloseProductClient() {
	c.ProductConn.Close()
}
