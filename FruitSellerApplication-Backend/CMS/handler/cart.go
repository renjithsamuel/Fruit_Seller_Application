package handler

import (
	"FruitSellerApplicationCMS/apperror"
	"FruitSellerApplicationCMS/domain"
	"FruitSellerApplicationCMS/model"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *CartHandler) AddToCartHandler(c *gin.Context) {
	requestParams, ok := c.Get("reqParams")
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid Request!",
		})
		return
	}

	cartRequest, ok := requestParams.(model.AddToCartRequest)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid Request Type!",
		})
		return
	}

	if err := h.domain.AddToCart(&cartRequest); err != nil {
		if errors.Is(err, domain.ErrCartAlreadyExists) {
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

	c.JSON(http.StatusOK, gin.H{"message": "Item added to cart"})
}

func (h *CartHandler) RemoveFromCartHandler(c *gin.Context) {
	reqParams := model.RemoveFromCartRequest{}

	if err := c.ShouldBindUri(&reqParams); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": apperror.CustomValidationError(&reqParams, err),
		})
		return
	}

	if err := h.domain.RemoveFromCart(reqParams.CartID, reqParams.ProductID); err != nil {
		if errors.Is(err, domain.ErrCartNotFound) {
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

	c.JSON(http.StatusOK, gin.H{"message": "Item removed from cart"})
}

func (h *CartHandler) GetCartHandler(c *gin.Context) {
	reqParams := model.RequestParams{}

	if err := c.ShouldBindUri(&reqParams); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": apperror.CustomValidationError(&reqParams, err),
		})
		return
	}

	cart, err := h.domain.GetCart(reqParams.CartID)
	if err != nil {
		if errors.Is(err, domain.ErrCartNotFound) {
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

	c.JSON(http.StatusOK, cart)
}

func (h *CartHandler) ClearCartHandler(c *gin.Context) {
	reqParams := model.RequestParams{}

	if err := c.ShouldBindUri(&reqParams); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": apperror.CustomValidationError(&reqParams, err),
		})
		return
	}

	if err := h.domain.ClearCart(reqParams.CartID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cart cleared"})
}

func (h *CartHandler) UpdateCartItemHandler(c *gin.Context) {
	requestParams, ok := c.Get("reqParams")
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid Request!",
		})
		return
	}

	cartRequest, ok := requestParams.(model.AddToCartRequest)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid Request Type!",
		})
		return
	}

	if err := h.domain.UpdateCartItem(&cartRequest); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cart item updated"})
}
