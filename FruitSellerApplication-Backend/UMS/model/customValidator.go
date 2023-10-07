package model

import (
	"reflect"
	"strings"
	"unicode"

	"github.com/gin-gonic/gin/binding"
	validator "github.com/go-playground/validator/v10"
)

var Validator *validator.Validate

// to register the validation to the gin engine so that when using shouldBindWithJson
// fn it catches the name validation error
func init() {
	var ok bool
	if Validator, ok = binding.Validator.Engine().(*validator.Validate); ok {
		_ = Validator.RegisterValidation("validatepassword", validatePassword, false)
		Validator.RegisterTagNameFunc(func(fld reflect.StructField) string {
			name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
			if name == "-" {
				return ""
			}
			return name
		})
	}
}

var validatePassword validator.Func = func(fl validator.FieldLevel) bool {
	value, ok := fl.Field().Interface().(string)
	if ok && len(value) != 0 {
		if len(value) > 7 && CheckLowerCase(value) && CheckSpecialCharacters(value) && CheckUpperCase(value) {
			return true
		}
		return false
	}
	return false
}

// helper functions

func CheckLowerCase(value string) bool {
	for _, char := range value {
		if unicode.IsLower(char) {
			return true
		}
	}
	return false
}

func CheckSpecialCharacters(value string) bool {
	for _, char := range value {
		if !unicode.IsLetter(char) && !unicode.IsNumber(char) {
			return true
		}
	}
	return false
}

func CheckUpperCase(value string) bool {
	for _, char := range value {
		if unicode.IsUpper(char) {
			return true
		}
	}
	return false
}
