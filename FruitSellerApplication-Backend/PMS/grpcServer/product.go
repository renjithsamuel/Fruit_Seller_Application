package grpcServer

import (
	"FruitSellerApplicationPMS/apperror"
	"FruitSellerApplicationPMS/domain"
	"FruitSellerApplicationPMS/model"
	"context"
	"errors"
	proto "proto/productProto"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (h *ProductGrpcServer) GetProducts(c context.Context, req *proto.GetProductsRequest) (*proto.GetProductsResponse, error) {
	products, err := h.domain.GetProducts()
	if err != nil {
		return nil, status.Errorf(codes.Internal, "[Error] : %v", err.Error())
	}

	// Prepare the response
	response := &proto.GetProductsResponse{
		Count:    int32(products.Count),
		Products: make([]*proto.ProductResponse, 0, len(products.Products)),
	}

	for _, item := range products.Products {
		response.Products = append(response.Products, &proto.ProductResponse{
			ProductID:     item.ProductID,
			ProductName:   item.ProductName,
			Description:   item.Description,
			Price:         item.Price,
			SellerID:      item.SellerID,
			StockQuantity: int32(item.StockQuantity),
			Category:      item.Category,
			ImageUrl:      item.ImageUrl,
			CreatedAtUTC:  item.CreatedAtUTC.String(),
			UpdatedATUTC:  item.UpdatedAtUTC.String(),
		})
	}

	return response, err
}

func (h *ProductGrpcServer) GetProductById(c context.Context, req *proto.GetProductByIdRequest) (*proto.ProductResponse, error) {
	requestParams := model.GetProductByIdRequest{
		ProductID: req.ProductID,
	}

	if err := validate.Struct(requestParams); err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "[Invalid request] : ID not found, %v", apperror.CustomValidationErrors(&requestParams, err))
	}

	product, err := h.domain.GetProductById(requestParams.ProductID)
	if err != nil {
		if errors.Is(domain.ErrProductNotFound, err) {
			return nil, status.Errorf(codes.NotFound, "[Error] : product Not found, %v", err.Error())
		}

		return nil, status.Errorf(codes.Internal, "[Error] : Internal server error, %v", err.Error())
	}

	return &proto.ProductResponse{
		ProductID:     product.ProductID,
		ProductName:   product.ProductName,
		Description:   product.Description,
		Price:         product.Price,
		SellerID:      product.SellerID,
		StockQuantity: int32(product.StockQuantity),
		Category:      product.Category,
		ImageUrl:      product.ImageUrl,
		CreatedAtUTC:  product.CreatedAtUTC.String(),
		UpdatedATUTC:  product.UpdatedAtUTC.String(),
	}, nil
}

func (gh *ProductGrpcServer) AddProduct(c context.Context, req *proto.AddProductRequest) (*proto.MessageResponse, error) {
	requestParams := model.AddProductRequest{
		ProductName:   req.ProductName,
		Description:   req.Description,
		Price:         req.Price,
		SellerID:      req.SellerID,
		StockQuantity: int(req.StockQuantity),
	}
	if err := validate.Struct(requestParams); err != nil {
		return &proto.MessageResponse{
			Message: "Invalid Request",
			Success: false,
		}, status.Errorf(codes.InvalidArgument, "[Invalid request]: , %v", apperror.CustomValidationErrors(&requestParams, err))
	}

	_, err := gh.domain.AddProduct(&requestParams)
	if err != nil {
		if errors.Is(domain.ErrProductAlreadyExists, err) {
			return &proto.MessageResponse{
				Message: err.Error(),
				Success: false,
			}, status.Errorf(codes.NotFound, "[Error] : product Not found, %v", err.Error())
		}
		return &proto.MessageResponse{
			Message: "internal server error:" + err.Error(),
			Success: false,
		}, status.Errorf(codes.Internal, "[Error] : Internal server error, %v", err.Error())
	}

	return &proto.MessageResponse{
		Message: "product created successfully",
		Success: true,
	}, nil
}

func (h *ProductGrpcServer) UpdateProduct(c context.Context, req *proto.UpdateProductRequest) (*proto.MessageResponse, error) {
	requestParams := model.UpdateProductRequest{
		ProductID:     req.ProductID,
		ProductName:   req.ProductName,
		Description:   req.Description,
		Price:         req.Price,
		SellerID:      req.SellerID,
		Category:      req.Category,
		ImageUrl:      req.ImageUrl,
		StockQuantity: int(req.StockQuantity),
	}
	if err := validate.Struct(requestParams); err != nil {
		return &proto.MessageResponse{
			Message: "Invalid Request",
			Success: false,
		}, status.Errorf(codes.InvalidArgument, "[Invalid request]: , %v", apperror.CustomValidationErrors(&requestParams, err))
	}

	err := h.domain.UpdateProduct(&requestParams)
	if err != nil {
		if errors.Is(domain.ErrProductNotFound, err) {
			return &proto.MessageResponse{
				Message: err.Error(),
				Success: false,
			}, status.Errorf(codes.NotFound, "[Error] : product Not found, %v", err.Error())
		}

		return &proto.MessageResponse{
			Message: "internal server error:" + err.Error(),
			Success: false,
		}, status.Errorf(codes.Internal, "[Error] : Internal server error, %v", err.Error())
	}
	return &proto.MessageResponse{
		Message: "product updated successfully",
		Success: true,
	}, nil
}

func (h *ProductGrpcServer) RemoveProduct(c context.Context, req *proto.RemoveProductRequest) (*proto.MessageResponse, error) {
	requestParams := model.RemoveProductRequest{
		ProductID: req.ProductID,
		SellerID:  req.SellerID,
	}
	if err := validate.Struct(requestParams); err != nil {
		return &proto.MessageResponse{
			Message: "Invalid Request",
			Success: false,
		}, status.Errorf(codes.InvalidArgument, "[Invalid request]: , %v", apperror.CustomValidationErrors(&requestParams, err))
	}
	err := h.domain.RemoveProduct(&requestParams)
	if err != nil {
		if errors.Is(domain.ErrProductNotFound, err) {
			return &proto.MessageResponse{
				Message: err.Error(),
				Success: false,
			}, status.Errorf(codes.NotFound, "[Error] : product Not found, %v", err.Error())
		}

		return &proto.MessageResponse{
			Message: "internal server error:" + err.Error(),
			Success: false,
		}, status.Errorf(codes.Internal, "[Error] : Internal server error, %v", err.Error())
	}

	return &proto.MessageResponse{
		Message: "product removed successfully",
		Success: true,
	}, nil
}
