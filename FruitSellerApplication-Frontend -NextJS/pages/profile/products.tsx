import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  Box,
  MenuItem,
  CardMedia,
  Card,
} from "@mui/material";
import NavBar from "../../components/navBar";
import SellerItem from "../../components/sellerItem";
import { Product } from "@/entity/apiTypes";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getProducts,
  UpdateProducts,
  AddProducts,
  DeleteProduct,
} from "../../api/api";
import { AddProductParams } from "../../entity/apiTypes";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
4;
import { UserContext } from "../_app";
import ErrorDisplay from "../../components/errorMessage";

const SellerProducts = () => {
  const queryClient = useQueryClient();

  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [updateProduct, setUpdateProduct] = useState(false);
  const [userID, setUserID] = useState<string | null>("");
  const { searchText } = useContext(UserContext);
  const [productData, setProductData] = useState<Product>({
    productName: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    category: "",
    imageUrl: "",
  });

  const { data, isError, isLoading } = useQuery({
    queryKey: "products",
    queryFn: getProducts,
  });

  const updateProductMutation = useMutation(UpdateProducts, {
    onSuccess: () => queryClient.invalidateQueries("products"),
  });

  const addProductMutation = useMutation(AddProducts, {
    onSuccess: (productData) => {
      queryClient.invalidateQueries("products");
      setSellerProducts([...sellerProducts, productData]);
    },
  });

  useEffect(() => {
    const userID = localStorage.getItem("userID");
    if (data != null && data.length > 0) {
      const tempSellerProduct: Product[] = data
        .filter((product) => {
          if (
            product?.productName &&
            userID &&
            product?.sellerID &&
            product?.sellerID === userID &&
            product?.productName.toLowerCase().includes(searchText)
          ) {
            return true;
          }
          return false;
        })
        .filter(Boolean);
      setSellerProducts(tempSellerProduct);
    }

    setUserID(userID);
  }, [data, searchText]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setProductData({
      productName: "",
      description: "",
      price: undefined,
      stockQuantity: undefined,
      category: "",
      imageUrl: "",
    });
    setOpenDialog(false);
    setUpdateProduct(false);
  };

  const handleDeleteProduct = async (productID: string | undefined) => {
    if (!productID) {
      return;
    }
    const success = await DeleteProduct(productID);
    success &&
      setSellerProducts((products) =>
        products.filter((elem) => elem.productID != productID)
      );
    handleCloseDialog();
  };

  const handleAddorUpdateProduct = async (values: Product) => {
    if (updateProduct) {
      updateProductMutation.mutate(values);
    } else {
      addProductMutation.mutate(values);
    }
    handleCloseDialog();
  };

  const validationSchema = Yup.object().shape({
    productName: Yup.string().required("Product Name is required"),
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

  if (isError) {
    return <ErrorDisplay message={"Something went wrong"} />;
  } else if (isLoading) {
    return <ErrorDisplay message={"Loading"} />;
  }

  return (
    <Box>
      <NavBar />
      <Box textAlign="center" sx={{ marginLeft: "2vw", marginRight: "1vw" , marginTop:{md: "0",sm : "4vh",xs:"5vh"}}}>
        {!userID ? (
          <Card
            sx={{
              marginLeft: "25%",
              marginTop: "10%",
              minWidth: "40vw",
              maxWidth: "50vw",
              borderRadius: "var(--border-radius)",
              p: 2,
            }}
          >
            <Link href="/login">
              <Typography variant="h5" sx={{ color: "blue" }}>
                Login to view your products
              </Typography>
            </Link>
          </Card>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                margin: 2,
              }}
            >
              <Typography variant="h4">Seller Products</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenDialog}
                className="profileBtns"
              >
                Add Product
              </Button>
            </Box>

            <Grid container spacing={2} margin={2}>
              {sellerProducts && sellerProducts.length > 0 ? (
                sellerProducts.map((product: Product) => (
                  <Grid item key={product.productID} xs={5} sm={3} md={2.2}>
                    <SellerItem
                      product={product}
                      setProductData={setProductData}
                      setOpenDialog={setOpenDialog}
                      setUpdateProduct={setUpdateProduct}
                    />
                  </Grid>
                ))
              ) : (
                <Typography variant="h4" className="noProducts">
                  No Products.
                </Typography>
              )}
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
              {updateProduct ? (
                <DialogTitle sx={{ fontWeight: "600" }}>
                  Update Product
                </DialogTitle>
              ) : (
                <DialogTitle sx={{ fontWeight: "600" }}>
                  Add a New Product
                </DialogTitle>
              )}
              <DialogContent sx={{ overflowX: "hidden" }}>
                <Box  sx={{ padding: 1 }}>
                  <Formik
                    initialValues={productData}
                    validationSchema={validationSchema}
                    onSubmit={handleAddorUpdateProduct}
                  >
                    <Form>
                      {AddProductParams.map((param) => (
                        <Box key={param.keyForDB} sx={{ margin: 1.5 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "start",
                              alignItems: "center",
                              width: {md:"25vw",sm:"45vw",xs:"65vw"},
                            }}
                          >
                            <Field
                              as={TextField}
                              label={param.inputPlaceHolder}
                              name={param.keyForDB}
                              type={param.inputType}
                              placeholder={param.inputPlaceHolder}
                              select={param.keyForDB === "category"}
                              sx={{ textAlign: "left" }}
                              fullWidth
                            >
                              {param.keyForDB === "category" &&
                                [
                                  "Citrus",
                                  "Tropical",
                                  "Berries",
                                  "Melons",
                                  "Stone Fruits",
                                  "Exotic",
                                  "Climacteric",
                                  "Hybrids",
                                  "Drupes",
                                ].map((category) => (
                                  <MenuItem key={category} value={category} sx={{textAlign:"left"}}>
                                    {category}
                                  </MenuItem>
                                ))}
                            </Field>
                          </Box>
                          <ErrorMessage
                            name={param.keyForDB}
                            component="Box"
                            className="error"
                          />
                          {productData.imageUrl &&
                            param.keyForDB == "imageUrl" && (
                              <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                sx={{ width: "100%", margin: 2 }}
                              >
                                <Card
                                  sx={{
                                    maxWidth: 200,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <CardMedia
                                    component="img"
                                    alt="Image Preview"
                                    height="auto"
                                    image={productData.imageUrl}
                                    sx={{ width: "80%" }}
                                  />
                                </Card>
                              </Box>
                            )}
                        </Box>
                      ))}

                      <Box
                        display={"flex"}
                        sx={{ justifyContent: "center", gap: 2, margin: 2 }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          className="profileBtns"
                        >
                          {updateProduct ? (
                            <>Update Product</>
                          ) : (
                            <> Add Product</>
                          )}
                        </Button>
                        {updateProduct ? (
                          <Button
                            variant="contained"
                            color="primary"
                            type="button"
                            onClick={() =>
                              handleDeleteProduct(productData?.productID)
                            }
                            className="profileBtns"
                          >
                            Delete Product
                          </Button>
                        ) : (
                          ""
                        )}
                      </Box>
                    </Form>
                  </Formik>
                </Box>
              </DialogContent>
            </Dialog>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SellerProducts;
