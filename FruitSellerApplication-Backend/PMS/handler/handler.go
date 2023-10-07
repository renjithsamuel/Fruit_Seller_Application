package handler

import (
	"FruitSellerApplicationPMS/domain"
)

type ProductHandler struct {
	domain domain.Service
}

func NewProductHanlder(domain domain.Service) *ProductHandler {
	return &ProductHandler{
		domain: domain,
	}
}
