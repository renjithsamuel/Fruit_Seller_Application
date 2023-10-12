import * as Yup from "yup";
import dayjs from "dayjs";

export const createUserDetailsValidation = (): Yup.AnySchema =>
  Yup.object().shape({
    name: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Name should only contain letters and spaces")
      .required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    role: Yup.string()
      .oneOf(["buyer", "seller"], "Role must be either buyer or seller")
      .required("Role is required"),
    dateOfBirth: Yup.date()
      .required("Date of Birth is required")
      .test(
        "is-of-legal-age",
        "You must be 18 years or older.",
        function (value) {
          if (value) {
            const currentDate = dayjs();
            const minAgeDate = currentDate.subtract(18, "year");
            return dayjs(value).isBefore(minAgeDate);
          }
          return false;
        }
      ),
    phoneNumber: Yup.string()
      .matches(/^[0-9]+$/, "Phone Number should only contain numbers")
      .required("Phone Number is required"),
    preferredLanguage: Yup.string().required("Preferred language is required"),
    address: Yup.string()
      .min(10, "Must be more than 10 digits")
      .required("Address is required"),
    country: Yup.string().required("Country is required"),
  });
