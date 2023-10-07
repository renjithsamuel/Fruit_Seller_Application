package routes

import (
	"FruitSellerApplicationCMS/handler"
	"FruitSellerApplicationCMS/middleware"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CartRoute struct {
	Name        string
	Method      string
	Pattern     string
	Protected   bool
	HandlerFunc gin.HandlerFunc
}

type CartRoutes []CartRoute

func NewCartRoutes(cartHandler *handler.CartHandler) CartRoutes {
	return CartRoutes{
		CartRoute{
			"Health",
			http.MethodGet,
			"/carts/health",
			false,
			cartHandler.HealthHandler,
		},
		CartRoute{
			"Get Cart",
			http.MethodGet,
			"/carts/:cartID",
			true,
			cartHandler.GetCartHandler,
		},
		CartRoute{
			"Add to Cart",
			http.MethodPost,
			"/carts",
			true,
			cartHandler.AddToCartHandler,
		},
		CartRoute{
			"Update Cart Item",
			http.MethodPut,
			"/carts",
			true,
			cartHandler.UpdateCartItemHandler,
		},
		CartRoute{
			"Remove from Cart",
			http.MethodDelete,
			"/carts/:cartID/products/:productID",
			true,
			cartHandler.RemoveFromCartHandler,
		},
		CartRoute{
			"Clear Cart",
			http.MethodDelete,
			"/carts/:cartID",
			true,
			cartHandler.ClearCartHandler,
		},
	}
}

func AttachCartRoutes(server *gin.Engine, cartRoutes CartRoutes, middleware middleware.Middleware) {
	for _, route := range cartRoutes {
		if route.Name == "Add to Cart" || route.Name == "Update Cart Item" {
			server.Handle(route.Method, route.Pattern, middleware.DoAuthenticate, middleware.VerifyProduct, route.HandlerFunc)
		} else if route.Protected {
			server.Handle(route.Method, route.Pattern, middleware.DoAuthenticate, route.HandlerFunc)
		} else {
			server.Handle(route.Method, route.Pattern, route.HandlerFunc)
		}
	}
}
