package handler

import (
	"FruitSellerApplicationPMS/apperror"
	"FruitSellerApplicationPMS/domain"
	"FruitSellerApplicationPMS/model"
	"errors"
	"net/http"
	"reflect"
	"strings"

	"github.com/gin-gonic/gin"
	validator "github.com/go-playground/validator/v10"
)

var validate = validator.New()

func init() {
	validate.RegisterTagNameFunc(func(fld reflect.StructField) string {
		name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
		if name == "-" {
			return ""
		}
		return name
	})
}

func (h *ProductHandler) GetProducts(c *gin.Context) {
	products, err := h.domain.GetProducts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, products)
}

func (h *ProductHandler) GetProductById(c *gin.Context) {
	requestParams := model.GetProductByIdRequest{}

	if err := c.ShouldBindUri(&requestParams); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": apperror.CustomValidationErrors(&requestParams, err),
		})
		return
	}

	product, err := h.domain.GetProductById(requestParams.ProductID)
	if err != nil {
		if errors.Is(domain.ErrProductNotFound, err) {
			c.JSON(http.StatusNotFound, gin.H{
				"message": err.Error(),
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, product)
}

func (h *ProductHandler) AddProduct(c *gin.Context) {
	var requestParams model.AddProductRequest
	if err := c.ShouldBindJSON(&requestParams); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": apperror.CustomValidationErrors(&requestParams, err),
		})
		return
	}

	productID, err := h.domain.AddProduct(&requestParams)
	if err != nil {
		if errors.Is(domain.ErrProductAlreadyExists, err) {
			c.JSON(http.StatusConflict, gin.H{
				"message": err.Error(),
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":   "product created successfully",
		"productID": *productID,
	})
}

func (h *ProductHandler) UpdateProduct(c *gin.Context) {
	var requestParams model.UpdateProductRequest
	if err := c.ShouldBindJSON(&requestParams); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": apperror.CustomValidationErrors(&requestParams, err),
		})
		return
	}

	err := h.domain.UpdateProduct(&requestParams)
	if err != nil {
		if errors.Is(domain.ErrProductNotFound, err) {
			c.JSON(http.StatusNotFound, gin.H{
				"message": err.Error(),
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "product updated successfully!",
	})
}

func (h *ProductHandler) RemoveProduct(c *gin.Context) {
	var requestParams model.RemoveProductRequest
	if err := c.ShouldBindUri(&requestParams); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": apperror.CustomValidationErrors(&requestParams, err),
		})
		return
	}
	err := h.domain.RemoveProduct(&requestParams)
	if err != nil {
		if errors.Is(domain.ErrProductNotFound, err) {
			c.JSON(http.StatusNotFound, gin.H{
				"message": err.Error(),
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "product deleted successfully!",
	})
}
