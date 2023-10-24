package grpcServer

import (
	"fmt"
	"google.golang.org/grpc"
	"log"
	"net"
	tokenGrpcService "FruitSellerApplicationTMS/Proto/userTokenProto"
)

type GrpcAuthServer struct {
	secretKey string
	tokenGrpcService.UnimplementedTokenGrpcServiceServer
}

func NewTokenHandler(secretKey string) *GrpcAuthServer {
	return &GrpcAuthServer{
		secretKey: secretKey,
	}
}

func RunGrpcServer(port string, SecretKey string) error {
	listen, err := net.Listen("tcp", port)
	if err != nil {
		return fmt.Errorf("Failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()

	tokenHandler := NewTokenHandler(SecretKey)

	tokenGrpcService.RegisterTokenGrpcServiceServer(grpcServer, tokenHandler)

	log.Println("TMS gRPC server is running on port", port, "...")

	if err := grpcServer.Serve(listen); err != nil {
		return fmt.Errorf("gRPC serve error: %v", err)
	}
	return nil
}
