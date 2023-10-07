package apperror

import (
	"encoding/json"
	"errors"
	"fmt"
	validator "github.com/go-playground/validator/v10"
)

var (
	customErrors = map[string]error{
		"name.required":              errors.New("is required"),
		"name.min":                   errors.New("has to be atleast 2 characters"),
		"name.max":                   errors.New("can be atmost 30 characters"),
		"dateOfBirth.required":       errors.New("is required"),
		"role.required":              errors.New("is required"),
		"role.oneof":                 errors.New("has to be one of buyer or seller"),
		"email.required":             errors.New("is required"),
		"email.email":                errors.New("needs to be in correct format"),
		"email.min":                  errors.New("needs to be atleast 3 characters"),
		"email.max":                  errors.New("needs to be atmost 64 characters"),
		"preferredLanguage.required": errors.New("is required"),
		"address.required":           errors.New("is required"),
		"address.min":                errors.New("needs to be atleast 10 characters"),
		"address.max":                errors.New("needs to be atmost 50 characters"),
		"country.required":           errors.New("is required"),
		"password.required":          errors.New("is required"),
		"password.min":               errors.New("needs to be atleast 8 characters"),
		"password.max":               errors.New("needs to be atmost 20 characters"),
		"password.validatepassword":  errors.New("password should contain uppercase and lowercase letter and no special character"),
		"id.required":                errors.New("is required"),
		"id.uuid":                    errors.New("has to be a uuid"),
		"limit.min":                  errors.New("limit lower value is set to 10"),
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
