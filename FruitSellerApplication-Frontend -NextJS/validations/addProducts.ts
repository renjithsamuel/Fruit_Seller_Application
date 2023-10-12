import * as Yup from "yup";

export const createAddProductsValidation = (): Yup.AnySchema =>
  Yup.object().shape({
    productName: Yup.string()
      .required("Product Name is required")
      .matches(
        /^[a-zA-Z\s]+$/,
        "Product Name should only contain letters and spaces"
      ),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .required("Price is required"),
    stockQuantity: Yup.number()
      .typeError("Stock Quantity must be a number")
      .required("Stock Quantity is required"),
    category: Yup.string().required("Category is required"),
    imageUrl: Yup.string().required("Image URL is required"),
  });
