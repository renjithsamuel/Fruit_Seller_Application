package routes

import (
	"FruitSellerApplicationUMS/handlers"
	"FruitSellerApplicationUMS/middleware"
	"github.com/gin-gonic/gin"
	"net/http"
)

type Route struct {
	Name        string
	Method      string
	Pattern     string
	Protected   bool
	HandlerFunc gin.HandlerFunc
}

type Routes []Route

func NewRoutes(userHandler *handlers.UserHandler) Routes {
	return Routes{
		Route{
			"Health",
			http.MethodGet,
			"/health",
			false,
			userHandler.HealthHandler,
		},
		Route{
			"Create User",
			http.MethodPost,
			"/users",
			false,
			userHandler.CreateUserHandler,
		},
		Route{
			"Login User",
			http.MethodPost,
			"/login",
			false,
			userHandler.LoginUserHandler,
		},
		Route{
			"Get User",
			http.MethodGet,
			"/users/:userID",
			true,
			userHandler.GetUserHandler,
		},
		Route{
			"Put User",
			http.MethodPut,
			"/users/:userID",
			true,
			userHandler.PutUserHandler,
		},
		Route{
			"Delete User",
			http.MethodDelete,
			"/users/:userID",
			true,
			userHandler.DeleteUserHandler,
		},
	}
}

func AttactRoutes(server *gin.Engine, routes Routes, middleware middleware.Middleware) {
	for _, route := range routes {
		if route.Protected {
			server.Handle(route.Method, route.Pattern, middleware.DoAuthenticate, route.HandlerFunc)
		} else {
			server.Handle(route.Method, route.Pattern, route.HandlerFunc)
		}
	}
}
