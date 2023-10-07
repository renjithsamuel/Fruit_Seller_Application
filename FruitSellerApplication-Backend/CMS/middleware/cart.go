package middleware

import (
	"FruitSellerApplicationCMS/apperror"
	"FruitSellerApplicationCMS/model"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (m *CartMiddleware) VerifyProduct(c *gin.Context) {
	var requestParams model.AddToCartRequest
	if err := c.ShouldBindJSON(&requestParams); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": apperror.CustomValidationError(&requestParams, err)})
		c.Abort()
		return
	}

	product, err := m.productClient.VerifyProduct(requestParams.ProductID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "something went wrong",
		})
		c.Abort()
		return
	}

	if product != nil && int(product.StockQuantity) >= int(requestParams.Quantity) {
		c.Set("reqParams", requestParams)
		c.Next()
	} else {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "Product Invalid or Out Of Stock",
		})
		c.Abort()
		return
	}
}

func (m *CartMiddleware) DoAuthenticate(c *gin.Context) {
	token := c.GetHeader("Authorization")
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Unauthorized",
		})
		c.Abort()
		return
	}

	// Validate token using TMS service
	userID, message, err := m.authClient.ValidateToken(token)
	if err != nil {
		fmt.Printf("[Validation Failed] : %v\n", err)
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Unauthorized: " + message,
		})
		c.Abort()
		return
	}

	if userID == "" {
		fmt.Println("[Validation Failed] : UserID not Valid")
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Unauthorized: " + message,
		})
		c.Abort()
		return
	}

	c.Set("userID", userID)
	c.Next()
}
