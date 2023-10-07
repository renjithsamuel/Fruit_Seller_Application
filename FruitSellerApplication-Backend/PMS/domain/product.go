package domain

import (
	"FruitSellerApplicationPMS/model"
	"database/sql"
	"errors"
	"fmt"
	"log"

	"github.com/lib/pq"
)

const (
	postgresUniqueConstraintViolationCode = "23505"
)

var (
	ErrProductAlreadyExists = errors.New("product already exists")

	ErrProductNotFound = errors.New("product not found")

	ErrProductCreation = errors.New("failed to create the product")

	ErrProductGet = errors.New("failed to get the product")

	ErrProductUpdate = errors.New("failed to update the product")

	ErrProductDelete = errors.New("failed to delete the product")

	ErrSellerIDIncorrect = errors.New("sellerID doesn't match")
)

func (s *ProductService) GetProducts() (*model.GetProductsResponse, error) {
	sqlStatement := `SELECT "productID", "productName", "description", "price", "sellerID", "stockQuantity", "category" , "imageUrl" ,"createdAtUTC", "updatedAtUTC" FROM "products"`
	rows, err := s.db.Query(sqlStatement)
	if err != nil {
		log.Println("[Error:GetProducts]:", err)
		return nil, ErrProductGet
	}
	defer rows.Close()

	products := model.GetProductsResponse{Products: []model.Product{}, Count: 0}
	for rows.Next() {
		var product model.Product
		err := rows.Scan(&product.ProductID, &product.ProductName, &product.Description, &product.Price, &product.SellerID, &product.StockQuantity, &product.Category, &product.ImageUrl, &product.CreatedAtUTC, &product.UpdatedAtUTC)
		if err != nil {
			log.Println("[Error:GetProducts]:", err)
			return nil, ErrProductGet
		}
		products.Products = append(products.Products, product)
	}
	// updating count of products
	products.Count = len(products.Products)

	return &products, nil
}

func (s *ProductService) GetProductById(productID string) (*model.Product, error) {
	product := model.Product{}
	sqlStatement := `SELECT "productID", "productName", "description", "price", "sellerID", "stockQuantity","category" , "imageUrl", "createdAtUTC", "updatedAtUTC" FROM "products" WHERE "productID"=$1`
	if err := s.db.QueryRow(sqlStatement, productID).Scan(&product.ProductID, &product.ProductName, &product.Description, &product.Price, &product.SellerID, &product.StockQuantity, &product.Category, &product.ImageUrl, &product.CreatedAtUTC, &product.UpdatedAtUTC); err != nil {
		if errors.Is(sql.ErrNoRows, err) {
			return nil, ErrProductNotFound
		}
		log.Println("[Error:GetProductById]:", err)
		return nil, ErrProductGet
	}
	return &product, nil
}

func (s *ProductService) AddProduct(product *model.AddProductRequest) (*string, error) {
	var productID string
	sqlStatement := `INSERT INTO "products"("productName", "description", "price", "sellerID", "stockQuantity","category" , "imageUrl") VALUES($1, $2, $3, $4, $5,$6,$7) RETURNING "productID"`
	if err := s.db.QueryRow(sqlStatement, product.ProductName, product.Description, product.Price, product.SellerID, product.StockQuantity, product.Category, product.ImageUrl).Scan(&productID); err != nil {
		pqErr, ok := err.(*pq.Error)
		if ok {
			if pqErr.Code == postgresUniqueConstraintViolationCode {
				fmt.Println(pqErr.Constraint)
				switch pqErr.Constraint {
				case "products_productName":
					log.Println("[Error:AddProduct]:", pqErr.Message)
					return nil, ErrProductAlreadyExists
				default:
					log.Println("[Error:AddProduct]:", pqErr.Message)
					return nil, ErrProductCreation
				}
			}
			log.Println("[Error:AddProduct]:", pqErr.Message)
			return nil, ErrProductCreation
		}
		log.Println("[Error:AddProduct]:", err.Error())
		return nil, ErrProductCreation
	}
	return &productID, nil
}

func (s *ProductService) RemoveProduct(request *model.RemoveProductRequest) error {
	// confirm the productID's SellerIS is same as request's SellerID
	sqlStatement := `SELECT "sellerID" FROM "products" WHERE "productID" = $1`
	var sellerID string
	err := s.db.QueryRow(sqlStatement, request.ProductID).Scan(&sellerID)
	if err != nil {
		log.Println("[Error:RemoveProduct]:", err.Error())
		return ErrProductUpdate
	}

	if sellerID != request.SellerID {
		log.Println("[Error:RemoveProduct]:", ErrSellerIDIncorrect)
		return ErrSellerIDIncorrect
	}
	// delete the product
	sqlStatement = `DELETE FROM "products" WHERE "productID" = $1`

	_, err = s.db.Exec(sqlStatement, request.ProductID)

	if err != nil {
		log.Println("[Error:RemoveProduct]:", err.Error())
		return ErrProductUpdate
	}

	return nil
}

func (s *ProductService) UpdateProduct(product *model.UpdateProductRequest) error {
	// confirm the productID's SellerIS is same as request's SellerID also
	// Get the existing product details
	var sellerID string
	sqlStatement := `SELECT "productName", "description", "price", "stockQuantity", "sellerID", "category", "imageUrl" FROM "products" WHERE "productID" = $1`
	var existingProduct model.Product
	err := s.db.QueryRow(sqlStatement, product.ProductID).Scan(
		&existingProduct.ProductName,
		&existingProduct.Description,
		&existingProduct.Price,
		&existingProduct.StockQuantity,
		&sellerID,
		&existingProduct.Category,
		&existingProduct.ImageUrl,
	)
	if err != nil {
		log.Println("[Error:UpdateProduct]:", err.Error())
		return ErrProductUpdate
	}

	if sellerID != product.SellerID {
		log.Println("[Error:UpdateProduct]:", ErrSellerIDIncorrect)
		return ErrSellerIDIncorrect
	}

	// keeping the old data
	if product.ProductName == "" {
		product.ProductName = existingProduct.ProductName
	}
	if product.Description == "" {
		product.Description = existingProduct.Description
	}
	if product.Price == 0 {
		product.Price = existingProduct.Price
	}
	if product.StockQuantity == 0 {
		product.StockQuantity = existingProduct.StockQuantity
	}

	// update the product
	sqlStatement = `UPDATE "products" SET "productName" = $1, "description" = $2, "price" = $3,	"stockQuantity" = $4, "category" = $5 , "imageUrl" = $6 ,"updatedAtUTC" = NOW() WHERE "productID" = $7`
	result, err := s.db.Exec(
		sqlStatement,
		product.ProductName,
		product.Description,
		product.Price,
		product.StockQuantity,
		product.Category,
		product.ImageUrl,
		product.ProductID,
	)

	if err != nil {
		log.Println("[Error:UpdateProduct]:", err.Error())
		return ErrProductUpdate
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Println("[Error:UpdateProduct]:", err.Error())
		return ErrProductUpdate
	}

	if rowsAffected == 0 {
		log.Println("[Error:UpdateProduct]: No changes made")
		return ErrProductNotFound
	}

	return nil
}
