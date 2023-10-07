package handler

import (
	"FruitSellerApplicationCMS/domain"
	validator "github.com/go-playground/validator/v10"
	"reflect"
	"strings"
)

var (
	validate = validator.New()
)

func init() {
	validate.RegisterTagNameFunc(func(fld reflect.StructField) string {
		name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
		if name == "-" {
			return ""
		}
		return name
	})
}

type CartHandler struct {
	domain domain.Service
}

func NewCartHandler(domain domain.Service) *CartHandler {
	return &CartHandler{
		domain: domain,
	}
}
