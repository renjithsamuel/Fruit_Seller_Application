package middleware

import (
	"FruitSellerApplicationPMS/grpcClient"

	"github.com/gin-gonic/gin"
)

type Middleware interface {
	DoAuthenticate(c *gin.Context)
}

type ProductMiddleware struct {
	authClient grpcClient.TokenServiceGrpcClient
}

func NewMiddleware(authClient grpcClient.TokenServiceGrpcClient) *ProductMiddleware {
	return &ProductMiddleware{
		authClient: authClient,
	}
}
