package grpcServer

import (
	"FruitSellerApplicationPMS/domain"
	"fmt"
	"log"
	"net"
	proto "proto/productProto"

	validator "github.com/go-playground/validator/v10"
	"google.golang.org/grpc"
)

var validate = validator.New()

type ProductGrpcServer struct {
	domain domain.Service
	proto.UnimplementedProductServiceServer
}

func NewProductGrpcServer(domain domain.Service) *ProductGrpcServer {
	return &ProductGrpcServer{
		domain: domain,
	}
}

func RunGrpcServer(port string, domain domain.Service) error {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		return fmt.Errorf("[Failed to listen] : %v", err)
	}

	server := grpc.NewServer()

	ProductGrpcServer := NewProductGrpcServer(domain)
	proto.RegisterProductServiceServer(server, ProductGrpcServer)

	log.Println("PMS gRPC Server Running in port", port, "...")

	if err := server.Serve(lis); err != nil {
		return fmt.Errorf("[gRPC Serve error ]: %v", err)
	}
	return nil
}
