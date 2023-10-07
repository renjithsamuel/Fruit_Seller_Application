package handlers

import (
	"FruitSellerApplicationUMS/apperror"
	"FruitSellerApplicationUMS/domain"
	"FruitSellerApplicationUMS/model"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func (uh *UserHandler) GetUserHandler(c *gin.Context) {
	reqParams := model.RequestParams{}

	if err := c.ShouldBindUri(&reqParams); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": apperror.CustomValidationError(&reqParams, err),
		})
		return
	}

	user, err := uh.domain.GetUser(reqParams.ID)

	if err != nil {
		if errors.Is(err, domain.ErrUserNotFound) {
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
		"user": user,
	})
}

func (uh *UserHandler) CreateUserHandler(c *gin.Context) {
	user := model.UserCreateRequest{}
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": apperror.CustomValidationError(&user, err),
		})
		return
	}

	// encrypting the password of the user before stroign
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error while hashing the password",
		})
		return
	}
	user.Password = string(hashedPassword)

	// parsing date string to date object
	dateOfBirth, err := time.Parse("2006-01-02", user.DateOfBirth)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{
			"message": "Error while parsing the Date of bith",
		})
		return
	}
	user.DateOfBirth = dateOfBirth.Format(time.RFC3339)

	registerUser, err := uh.domain.CreateUser(&user)
	if err != nil {
		if errors.Is(err, domain.ErrUserAlreadyExists) {
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

	uh.eventClient.PublishUserCreated(registerUser)

	c.JSON(http.StatusCreated, gin.H{
		"message": "User Created Successfully",
		"success": true,
		"userID":  registerUser.UserID,
	})
}

func (uh *UserHandler) LoginUserHandler(c *gin.Context) {
	user := model.UserLoginRequest{}
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": apperror.CustomValidationError(&user, err),
		})
		return
	}

	userID, storedPassword, err := uh.domain.LoginUser(&user)
	if err != nil {
		if errors.Is(err, domain.ErrUserNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"message": err.Error(),
			})
			return
		}

		if errors.Is(err, domain.ErrIncorrectPassword) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": err.Error(),
			})
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})

		return
	}

	// Compare the stored hashed password with the login password
	if err := bcrypt.CompareHashAndPassword([]byte(*storedPassword), []byte(user.Password)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": domain.ErrIncorrectPassword.Error(),
		})
		return
	}

	token, err := uh.authClient.RequestToken(*userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Token creation failed",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "logged in successfully",
		"success": true,
		"token":   token,
		"userID":  *userID,
	})
}

func (uh *UserHandler) PutUserHandler(c *gin.Context) {
	reqParams := model.RequestParams{}

	if err := c.ShouldBindUri(&reqParams); err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"message": apperror.CustomValidationError(&reqParams, err),
		})
		return
	}

	userUpdate := model.UserPutRequest{}
	if err := c.ShouldBindJSON(&userUpdate); err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"message": apperror.CustomValidationError(&userUpdate, err),
		})
		return
	}

	err := uh.domain.PutUser(&userUpdate, reqParams.ID)
	if err != nil {
		if errors.Is(err, domain.ErrUserNotFound) {
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
		"message": "User updated successfully",
	})
}

func (uh *UserHandler) DeleteUserHandler(c *gin.Context) {
	reqParams := model.RequestParams{}

	if err := c.ShouldBindUri(&reqParams); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": apperror.CustomValidationError(&reqParams, err),
		})
		return
	}

	cartID, err := uh.domain.DeleteUser(reqParams.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(), // something went wrong - for internal server
		})
		return
	}

	err = uh.cartClient.DeleteUserEvent(*cartID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User deleted successfully",
	})
}
