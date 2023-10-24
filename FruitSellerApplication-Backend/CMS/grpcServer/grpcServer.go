package grpcServer

import (
	"FruitSellerApplicationCMS/domain"
	"github.com/go-playground/validator/v10"
	proto "FruitSellerApplicationCMS/Proto/cartProto"
)

var (
	validate = validator.New()
)

type CartGrpcServer struct {
	domain domain.Service
	proto.UnimplementedCartServiceServer
}

func NewCartGrpcServer(domain domain.Service) *CartGrpcServer {
	return &CartGrpcServer{
		domain: domain,
	}
}
