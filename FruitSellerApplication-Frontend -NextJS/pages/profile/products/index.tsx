import React, { useState, useEffect } from "react";
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
  Card,
} from "@mui/material";
import NavBar from "../../../components/navBar/navBar";
import SellerItem from "../../../components/sellerItem/sellerItem";
import { Product } from "@/entity/product";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ErrorDisplay from "../../../components/errorMessage/errorMessage";
import { AddProductParams } from "@/constants/addProductParams";
import { categoryArray } from "@/constants/categoryArray";
import { makeStyles } from "@mui/styles";
import { Theme } from "@material-ui/core";
import { useSellerProducts } from "./products.hooks";

const SellerProducts = () => {
  const classes = useStyles();
  const {
    sellerProducts,
    openDialog,
    updateProduct,
    userID,
    productData,
    handleOpenDialog,
    handleCloseDialog,
    handleDeleteProduct,
    handleAddorUpdateProduct,
    validationSchema,
    isProductsError,
    isProductsLoading,
    setProductData,
    setOpenDialog,
    setUpdateProduct,
  } = useSellerProducts();

  if (isProductsError) {
    return <ErrorDisplay message={"Something went wrong"} />;
  } else if (isProductsLoading) {
    return <ErrorDisplay message={"Loading"} />;
  }

  return (
    <Box>
      <NavBar showSearchBar={true} />
      <Box className={classes.container}>
        {!userID ? (
          <Card className={classes.card}>
            <Link href="/login">
              <Typography variant="h5" className={classes.loginLink}>
                Login to view your products
              </Typography>
            </Link>
          </Card>
        ) : (
          <Box className={classes.SellerProductsWrap}>
            <Box className={classes.ProductsTopBar}>
              <Typography variant="h4" className={classes.heading}>
                Seller Products
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenDialog}
                className="profileBtns"
                sx={{ fontSize: { md: "15px", sm: "13px", xs: "12px" } }}
              >
                Add Product
              </Button>
            </Box>

            <Grid container spacing={2} marginTop={1}>
              {sellerProducts && sellerProducts.length > 0 ? (
                sellerProducts.map((product: Product) => (
                  <Grid item key={product?.productID} xs={6} sm={4} md={2.2}>
                    <SellerItem
                      product={product}
                      setProductData={setProductData}
                      setOpenDialog={setOpenDialog}
                      setUpdateProduct={setUpdateProduct}
                    />
                  </Grid>
                ))
              ) : (
                <Typography variant="h4" className={classes.noProducts}>
                  No Products
                </Typography>
              )}
            </Grid>

            {/* pop up window for updation or addition of products  */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              {updateProduct ? (
                <DialogTitle className={classes.dialogTitle}>
                  Update Product
                </DialogTitle>
              ) : (
                <DialogTitle className={classes.dialogTitle}>
                  Add a New Product
                </DialogTitle>
              )}
              <DialogContent sx={{ overflowX: "hidden" }}>
                <Box
                  sx={{
                    width: { md: "25vw", sm: "45vw", xs: "65vw" },
                  }}
                >
                  <Formik
                    initialValues={productData}
                    validationSchema={validationSchema}
                    onSubmit={handleAddorUpdateProduct}
                  >
                    <Form>
                      {AddProductParams.map((param) => (
                        <Box key={param.keyForDB} sx={{ margin: 1.5 }}>
                          <Box className={classes.textFieldWrap}>
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
                                categoryArray.map((category) => (
                                  <MenuItem
                                    key={category}
                                    value={category}
                                    sx={{ textAlign: "left" }}
                                  >
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
                        </Box>
                      ))}
                      <Box
                        display="flex"
                        sx={{ justifyContent: "center", gap: 2, marginTop: 2 }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          className={`profileBtns`}
                        >
                          {updateProduct ? <>Update</> : <> Add Product</>}
                        </Button>
                        {updateProduct ? (
                          <Button
                            variant="contained"
                            color="primary"
                            type="button"
                            onClick={() =>
                              handleDeleteProduct(productData?.productID)
                            }
                            className={`profileBtns`}
                          >
                            Delete
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
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SellerProducts;

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    textAlign: "center",
    margin: "3px",
    [theme.breakpoints.up("md")]: {
      margin: "3px",
    },
    [theme.breakpoints.between("sm", "md")]: {
      margin: "2px",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      margin: "1px",
    },
  },
  card: {
    marginTop: "15px",
    marginLeft: "38%",
    minWidth: "20vw",
    maxWidth: "30vw",
    borderRadius: "var(--border-radius)",
    padding: "2px",
    [theme.breakpoints.up("md")]: {
      marginTop: "15px",
      marginLeft: "38%",
      width: "20vw",
    },
    [theme.breakpoints.between("sm", "md")]: {
      marginTop: "15px",
      marginLeft: "37%",
      minWidth: "30vw",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      marginTop: "15px",
      marginLeft: "30%",
      minWidth: "40vw",
    },
  },
  loginLink: {
    color: "blue",
    [theme.breakpoints.up("md")]: {
      color: "blue",
    },
    [theme.breakpoints.between("sm", "md")]: {
      color: "blue",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      color: "blue",
    },
  },
  SellerProductsWrap: {
    [theme.breakpoints.up("md")]: {
      marginTop: 15,
      paddingLeft: 25,
      paddingRight: 25,
    },
    [theme.breakpoints.between("sm", "md")]: {
      marginTop: 20,
      paddingLeft: 20,
      paddingRight: 20,
    },
    [theme.breakpoints.between("xs", "sm")]: {
      marginTop: 20,
      paddingLeft: 15,
      paddingRight: 15,
    },
    paddingTop: 15,
    paddingBottom: 15,
  },
  ProductsTopBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "600",
    [theme.breakpoints.up("md")]: {
      fontSize: "28px",
    },
    [theme.breakpoints.between("sm", "md")]: {
      fontSize: "25px",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      fontSize: "20px",
    },
  },
  textFieldWrap: {
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    width: "100%",
  },
  noProducts: {
    fontSize: "28px",
    fontWeight: "600",
    [theme.breakpoints.up("md")]: {
      fontSize: "28px",
    },
    [theme.breakpoints.between("sm", "md")]: {
      fontSize: "25px",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      fontSize: "20px",
    },
  },
  dialogTitle: {
    fontWeight: "600",
  },
}));
