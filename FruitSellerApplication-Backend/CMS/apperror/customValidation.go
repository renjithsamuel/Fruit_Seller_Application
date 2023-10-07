package apperror

import (
	"encoding/json"
	"errors"
	"fmt"
	validator "github.com/go-playground/validator/v10"
)

var (
	customErrors = map[string]error{
		"userID.required":    errors.New("is required"),
		"userID.uuid":        errors.New("has to be a uuid"),
		"productID.required": errors.New("is required"),
		"productID.uuid":     errors.New("has to be a uuid"),
		"quantity.min":       errors.New("has to be atleast 1"),
		"limit.min":          errors.New("limit lower value is set to 10"),
	}
)

func CustomValidationError(sourceStruct interface{}, err error) []map[string]string {
	errs := make([]map[string]string, 0)
	// gets the type of the error
	switch errTypes := err.(type) {
	// if the error is of the type validation error then
	case validator.ValidationErrors:
		// loop over all the errors thrown by the validation package and print everything as user friendly manner
		for _, e := range errTypes {
			errorMap := make(map[string]string)

			key := e.Field() + "." + e.Tag()

			if v, ok := customErrors[key]; ok {
				errorMap[e.Field()] = v.Error()
			} else {
				errorMap[e.Field()] = fmt.Sprintf("custom message is not available : %v ", err)
			}
			errs = append(errs, errorMap)
		}
		return errs
	// the error could also be caused due to diffrent input than the model schema
	case *json.UnmarshalTypeError:
		errs = append(errs, map[string]string{errTypes.Field: fmt.Sprintf("%v cannot be a %v", err)})
		return errs
	}
	errs = append(errs, map[string]string{"unknown": fmt.Sprintf("unsupported Custom error for : %v", err)})
	return errs
}
