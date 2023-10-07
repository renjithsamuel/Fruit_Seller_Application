package middleware

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (m *UserMiddleware) DoAuthenticate(c *gin.Context) {
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
