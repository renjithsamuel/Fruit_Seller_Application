package middleware

import (
	"FruitSellerApplicationCMS/grpcClient"
	"github.com/gin-gonic/gin"
)

type Middleware interface {
	VerifyProduct(c *gin.Context)
	DoAuthenticate(c *gin.Context)
}

type CartMiddleware struct {
	authClient    grpcClient.TokenServiceGrpcClient
	productClient grpcClient.ProductServiceGrpcClient
}

func NewMiddleware(authClient grpcClient.TokenServiceGrpcClient, productClient grpcClient.ProductServiceGrpcClient) *CartMiddleware {
	return &CartMiddleware{
		authClient:    authClient,
		productClient: productClient,
	}
}
