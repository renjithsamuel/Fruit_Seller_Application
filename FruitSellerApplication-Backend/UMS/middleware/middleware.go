package middleware

import (
	"FruitSellerApplicationUMS/grpcClient"

	"github.com/gin-gonic/gin"
)

type Middleware interface {
	DoAuthenticate(c *gin.Context)
}

type UserMiddleware struct {
	authClient grpcClient.TokenServiceGrpcClient
}

func NewAuthMiddleware(authClient grpcClient.TokenServiceGrpcClient) *UserMiddleware {
	return &UserMiddleware{
		authClient: authClient,
	}
}
