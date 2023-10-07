package domain

import (
	"FruitSellerApplicationPMS/model"
	"database/sql"
)

type Service interface {
	GetProducts() (*model.GetProductsResponse, error)
	GetProductById(productID string) (*model.Product, error)
	AddProduct(product *model.AddProductRequest) (*string, error)
	UpdateProduct(product *model.UpdateProductRequest) error
	RemoveProduct(request *model.RemoveProductRequest) error
	DBStatus() (bool, error)
}

type ProductService struct {
	db *sql.DB
}

func NewProductService(db *sql.DB) *ProductService {
	return &ProductService{
		db: db,
	}
}
