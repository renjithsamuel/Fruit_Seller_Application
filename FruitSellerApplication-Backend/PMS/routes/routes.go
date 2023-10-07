package routes

import (
	"FruitSellerApplicationPMS/handler"
	"FruitSellerApplicationPMS/middleware"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ProductRoute struct {
	Name        string
	Method      string
	Pattern     string
	Protected   bool
	HandlerFunc gin.HandlerFunc
}

type ProductRoutes []ProductRoute

func NewProductRoutes(productHandler *handler.ProductHandler) ProductRoutes {
	return ProductRoutes{
		ProductRoute{
			"health",
			http.MethodGet,
			"/products/health",
			false,
			productHandler.HealthHandler,
		},
		ProductRoute{
			"get all products",
			http.MethodGet,
			"/products",
			false,
			productHandler.GetProducts,
		},
		ProductRoute{
			"get product by id",
			http.MethodGet,
			"/products/:productID",
			false,
			productHandler.GetProductById,
		},
		ProductRoute{
			"add product",
			http.MethodPost,
			"/products",
			false,
			productHandler.AddProduct,
		},
		ProductRoute{
			"update product",
			http.MethodPatch,
			"/products",
			true,
			productHandler.UpdateProduct,
		},
		ProductRoute{
			"delete product",
			http.MethodDelete,
			"/products/:productID/seller/:sellerID",
			true,
			productHandler.RemoveProduct,
		},
	}
}

func AttachProductRoutes(server *gin.Engine, productRoutes ProductRoutes, middleware middleware.Middleware) {
	for _, route := range productRoutes {
		if route.Protected {
			server.Handle(route.Method, route.Pattern, middleware.DoAuthenticate, route.HandlerFunc)
		} else {
			server.Handle(route.Method, route.Pattern, route.HandlerFunc)
		}
	}
}
