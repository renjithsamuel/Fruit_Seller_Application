package model

import (
	"github.com/gin-gonic/gin/binding"
	validator "github.com/go-playground/validator/v10"
	"reflect"
	"strings"
)

var (
	Validator *validator.Validate
)

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
