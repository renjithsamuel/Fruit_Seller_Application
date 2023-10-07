package model

import (
	"reflect"
	"strings"

	"github.com/gin-gonic/gin/binding"
	validator "github.com/go-playground/validator/v10"
)

var Validator *validator.Validate

// to register the validation to the gin engine so that when using shouldBindWithJson
// fn it catches the name validation error
func init() {
	var ok bool
	if Validator, ok = binding.Validator.Engine().(*validator.Validate); ok {
		Validator.RegisterTagNameFunc(func(fld reflect.StructField) string {
			name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
			if name == "-" {
				return ""
			}
			return name
		})
	}
}
