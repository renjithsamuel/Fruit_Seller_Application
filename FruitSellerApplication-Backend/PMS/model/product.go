package model

import "time"

type AddProductRequest struct {
	ProductName   string  `json:"productName" binding:"required,min=3,max=100"`
	Description   string  `json:"description" binding:"required,min=3,max=255"`
	Price         float32 `json:"price" binding:"required"`
	SellerID      string  `json:"sellerID" form:"id" binding:"required,uuid"`
	StockQuantity int     `json:"stockQuantity" binding:"required"`
	Category      string  `json:"category" binding:"required"`
	ImageUrl      string  `json:"imageUrl" binding:"required"`
}

type Product struct {
	ProductID     string    `json:"productID" binding:"required,uuid"`
	ProductName   string    `json:"productName" binding:"required,min=3,max=100"`
	Description   string    `json:"description" binding:"required,min=3,max=255"`
	Price         float32   `json:"price" binding:"required"`
	SellerID      string    `json:"sellerID" binding:"required,uuid"`
	StockQuantity int       `json:"stockQuantity" binding:"required"`
	Category      string    `json:"category" binding:"required"`
	ImageUrl      string    `json:"imageUrl" binding:"required"`
	CreatedAtUTC  time.Time `json:"createdAtUTC"`
	UpdatedAtUTC  time.Time `json:"updatedAtUTC"`
}

type GetProductsResponse struct {
	Products []Product `json:"products"`
	Count    int       `json:"count"`
}

type GetProductByIdRequest struct {
	ProductID string `uri:"productID" json:"productID"  form:"id" binding:"required,uuid"`
}

type UpdateProductRequest struct {
	ProductID     string  `json:"productID" form:"id" binding:"required,uuid"`
	ProductName   string  `json:"productName"  binding:"omitempty,min=3,max=100"`
	Description   string  `json:"description" binding:"omitempty,min=3,max=255"`
	Price         float32 `json:"price" binding:"omitempty"`
	SellerID      string  `json:"sellerID" form:"id" binding:"required,uuid"`
	StockQuantity int     `json:"stockQuantity" binding:"required"`
	Category      string  `json:"category" binding:"required"`
	ImageUrl      string  `json:"imageUrl" binding:"required"`
}

type RemoveProductRequest struct {
	ProductID string `uri:"productID" json:"productID" form:"id" binding:"required,uuid"`
	SellerID  string `uri:"sellerID" json:"sellerID" form:"id" binding:"required,uuid"`
}
