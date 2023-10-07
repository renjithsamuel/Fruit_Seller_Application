package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func (uh *UserHandler) HealthHandler(c *gin.Context) {
	ok, err := uh.domain.DBStatus()
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
