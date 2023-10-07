package apperror

import (
	"encoding/json"
	"errors"
	"fmt"
	validator "github.com/go-playground/validator/v10"
)

var (
	customErrors = map[string]error{
		"productName.required":    errors.New("is required"),
		"productName.min":         errors.New("has to be atleast 3 characters"),
		"productName.max":         errors.New("can be atmost 100 characters"),
		"description.required":    errors.New("is required"),
		"description.min":         errors.New("has to be atleast 3 characters"),
		"description.max":         errors.New("can be atmost 255 characters"),
		"price.required":          errors.New("is required"),
		"sellerID.required":       errors.New("is required"),
		"sellerID.uuid":           errors.New("has to be a uuid"),
		"stockQuantitty.required": errors.New("is required"),
		"productID.required":      errors.New("is required"),
		"productID.uuid":          errors.New("has to be a uuid"),
		"limit.min":               errors.New("limit lower value is set to 10"),
	}
)

func CustomValidationErrors(sourceStruct interface{}, err error) []map[string]string {
	errs := make([]map[string]string, 0)
	switch errTypes := err.(type) {
	case validator.ValidationErrors:
		for _, e := range errTypes {
			errorMap := make(map[string]string)

			key := e.Field() + "." + e.Tag()

			if v, ok := customErrors[key]; ok {
				errorMap[e.Field()] = v.Error()
			} else {
				errorMap[e.Field()] = fmt.Sprintf("custom message is not available : %v", err)
			}
			errs = append(errs, errorMap)
		}
		return errs
	case *json.UnmarshalTypeError:
		errs = append(errs, map[string]string{errTypes.Field: fmt.Sprintf("%v cannot be a %v", err)})
	}
	errs = append(errs, map[string]string{"unknown": fmt.Sprintf("unsupported custom error for : %v", err)})
	return errs
}
