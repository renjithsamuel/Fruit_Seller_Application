package grpcServer

import (
	"FruitSellerApplicationCMS/apperror"
	"FruitSellerApplicationCMS/domain"
	"FruitSellerApplicationCMS/model"
	"context"
	"errors"
	"fmt"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"log"
	"net"
	proto "proto/cartProto"
)

func (s *CartGrpcServer) AddToCart(ctx context.Context, req *proto.AddToCartRequest) (*proto.Cart, error) {
	reqParams := model.AddToCartRequest{
		ProductID: req.ProductID,
		CartID:    req.CartID,
		Quantity:  int(req.Quantity),
	}
	if err := validate.Struct(reqParams); err != nil {
		return &proto.Cart{
			Message: "Invalid request",
			Success: false,
		}, status.Errorf(codes.InvalidArgument, "[Invalid request]: %v", apperror.CustomValidationError(&reqParams, err))
	}

	// calling domain layer and error handling
	err := s.domain.AddToCart(&reqParams)
	if err != nil {
		if errors.Is(err, domain.ErrCartAlreadyExists) {
			return &proto.Cart{
				Message: "cart already created",
				Success: false,
			}, status.Errorf(codes.AlreadyExists, "[Error] : already Exists, %v", err.Error())
		}

		return &proto.Cart{
			Message: "internal server error",
			Success: false,
		}, status.Errorf(codes.Internal, "[Internal server error]: %v", err)
	}

	return &proto.Cart{
		Message: "cart created",
		Success: true,
	}, nil
}

func (s *CartGrpcServer) RemoveFromCart(ctx context.Context, req *proto.RemoveFromCartRequest) (*proto.Cart, error) {

	reqParams := model.RemoveFromCartRequest{
		CartID:    req.CartID,
		ProductID: req.ProductID,
	}

	if err := validate.Struct(reqParams); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "[Invalid request]: %v", apperror.CustomValidationError(&reqParams, err))
	}

	// calling domain layer
	err := s.domain.RemoveFromCart(reqParams.CartID, reqParams.ProductID)
	if err != nil {
		if errors.Is(err, domain.ErrCartNotFound) {
			return &proto.Cart{
				Message: "cart not found",
				Success: false,
			}, status.Errorf(codes.NotFound, "[Error] : cart Not found, %v", err.Error())
		}

		return &proto.Cart{
			Message: "internal server error",
			Success: false,
		}, status.Errorf(codes.Internal, "[Internal server error]: %v", err)
	}

	return &proto.Cart{
		Message: "cart deleted",
		Success: true,
	}, nil
}

func (s *CartGrpcServer) GetCart(ctx context.Context, req *proto.GetCartRequest) (*proto.GetCartResponse, error) {
	reqParams := model.RequestParams{
		CartID: req.CartID,
	}

	if err := validate.Struct(reqParams); err != nil {
		return nil,
			status.Errorf(codes.InvalidArgument, "[Invalid request]: %v", apperror.CustomValidationError(&reqParams, err))
	}

	cartItems, err := s.domain.GetCart(reqParams.CartID)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "[Internal server error]: %v", err.Error())
	}

	// Prepare the response
	response := &proto.GetCartResponse{
		CartID:  reqParams.CartID,
		Message: "Cart items fetched successfully",
		Success: true,
		Items:   make([]*proto.CartItem, 0, len(cartItems.Items)),
	}

	for _, item := range cartItems.Items {
		response.Items = append(response.Items, &proto.CartItem{
			ProductID: item.ProductID,
			Quantity:  int32(item.Quantity),
		})
	}

	return response, nil
}

func (s *CartGrpcServer) ClearCart(ctx context.Context, req *proto.ClearCartRequest) (*proto.Cart, error) {
	reqParams := model.RequestParams{
		CartID: req.CartID,
	}

	if err := validate.Struct(reqParams); err != nil {
		return nil,
			status.Errorf(codes.InvalidArgument, "[Invalid request]: %v", apperror.CustomValidationError(&reqParams, err))
	}

	// calling domain layer
	err := s.domain.ClearCart(reqParams.CartID)
	if err != nil {
		if errors.Is(err, domain.ErrCartNotFound) {
			return &proto.Cart{
				Message: "cart not found",
				Success: false,
			}, status.Errorf(codes.NotFound, "[Error] : cart Not found, %v", err.Error())
		}

		return &proto.Cart{
			Message: "internal server error",
			Success: false,
		}, status.Errorf(codes.Internal, "[Error] : Internal server error, %v", err.Error())
	}

	return &proto.Cart{
		Message: "carts cleared",
		Success: true,
	}, nil
}

func (s *CartGrpcServer) UpdateCartItem(ctx context.Context, req *proto.UpdateCartItemRequest) (*proto.Cart, error) {
	reqParams := model.AddToCartRequest{
		CartID:    req.CartID,
		ProductID: req.ProductID,
		Quantity:  int(req.Quantity),
	}

	if err := validate.Struct(reqParams); err != nil {
		return &proto.Cart{
			Message: "Invalid request",
			Success: false,
		}, status.Errorf(codes.InvalidArgument, "[Invalid request]: %v", apperror.CustomValidationError(&reqParams, err))
	}

	// calling domain layer and error handling
	err := s.domain.UpdateCartItem(&reqParams)
	if err != nil {
		if errors.Is(err, domain.ErrCartNotFound) {
			return &proto.Cart{
				Message: "cart not found",
				Success: false,
			}, status.Errorf(codes.NotFound, "[Error] : cart Not found, %v", err.Error())
		}

		return &proto.Cart{
			Message: "internal server error",
			Success: false,
		}, status.Errorf(codes.Internal, "[Internal server error]: %v", err.Error())
	}

	return &proto.Cart{
		Message: "cart updated",
		Success: true,
	}, nil
}

func (s *CartGrpcServer) DeleteUserAction(ctx context.Context, req *proto.DeleteUserActionRequest) (*proto.Cart, error) {
	reqParams := model.RequestParams{
		CartID: req.CartID,
	}

	if err := validate.Struct(reqParams); err != nil {
		return nil,
			status.Errorf(codes.InvalidArgument, "[Invalid request]: %v", apperror.CustomValidationError(&reqParams, err))
	}

	// calling domain layer
	err := s.domain.DeleteUserAction(reqParams.CartID)
	if err != nil {
		return &proto.Cart{
			Message: "internal server error",
			Success: false,
		}, status.Errorf(codes.Internal, "[Error] : Internal server error, %v", err.Error())
	}

	return &proto.Cart{
		Message: "user's Carts deleted",
		Success: true,
	}, nil
}

func RunServer(port string, cartService domain.Service) error {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		return fmt.Errorf("Failed to listen: %v", err.Error())
	}

	server := grpc.NewServer()

	cartGrpcHandler := NewCartGrpcServer(cartService)
	proto.RegisterCartServiceServer(server, cartGrpcHandler)

	log.Println("CMS gRPC server is running on port", port, "...")

	if err := server.Serve(lis); err != nil {
		return fmt.Errorf("gRPC serve error: %v", err)
	}
	return nil
}
