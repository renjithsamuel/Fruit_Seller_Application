package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *CartHandler) HealthHandler(c *gin.Context) {
	ok, err := h.domain.DBStatus()
	if err != nil {
		c.JSON(http.StatusFailedDependency, gin.H{
			"status": "alive",
			"db":     err.Error(),
		})
		return
	}
	if ok {
		c.JSON(http.StatusOK, gin.H{
			"status": "alive",
			"db":     "connected",
		})
		return
	}
	c.JSON(http.StatusInternalServerError, gin.H{
		"status": "alive",
		"db":     "false",
	})
}
