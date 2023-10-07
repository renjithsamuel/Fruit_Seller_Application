package handlers

import (
	"FruitSellerApplicationUMS/domain"
	"FruitSellerApplicationUMS/grpcClient"
	validator "github.com/go-playground/validator/v10"
	"reflect"
	"strings"
)

var (
	validate = validator.New()
)

func init() {
	validate.RegisterTagNameFunc(func(fld reflect.StructField) string {
		name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
		if name == "-" {
			return ""
		}
		return name
	})
}

type UserHandler struct {
	domain      domain.Service
	eventClient grpcClient.EventServiceGrpcClient
	cartClient  grpcClient.CartServiceGrpcClient
	authClient  grpcClient.TokenServiceGrpcClient
}

func NewUserHandler(domain domain.Service, eventClient grpcClient.EventServiceGrpcClient, cartClient grpcClient.CartServiceGrpcClient,
	authClient grpcClient.TokenServiceGrpcClient) *UserHandler {
	return &UserHandler{
		domain:      domain,
		eventClient: eventClient,
		cartClient:  cartClient,
		authClient:  authClient,
	}
}
