import React, { useEffect, useState, useContext } from "react";
import { Typography, Grid, Box, Card } from "@mui/material";
import CartItem from "../../components/cartItem/cartItem";
import { Product } from "../../entity/product";
import NavBar from "../../components/navBar/navBar";
import Link from "next/link";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ErrorDisplay from "../../components/errorMessage/errorMessage";
import { makeStyles } from "@mui/styles";
import { Theme } from "@material-ui/core";
import { useCart } from "./cart.hooks";

const Cart = () => {
  const {
    cartID,
    totalCost,
    cartProducts,
    isCartError,
    isProductsError,
    isCartLoading,
    isProductsLoading,
    setCartProducts,
  } = useCart();
  const classes = useStyles();

  if (isCartError || isProductsError) {
    return <ErrorDisplay message={"Something went wrong"} />;
  } else if (isCartLoading || isProductsLoading) {
    return <ErrorDisplay message={"Loading"} />;
  }

  return (
    <Box>
      <NavBar showSearchBar={true} />
      <Box className={classes.container}>
        <Box className={classes.header}>
          <Typography variant="h5" className={classes.cartIcon}>
            <ShoppingCartIcon sx={{ marginRight: 1 }} />
            cart
          </Typography>
          <Typography variant="h5" className={classes.cartTotal}>
            ${totalCost}
          </Typography>
        </Box>
        <Card className={classes.card}>
          {!cartID ? (
            <Link href="/login">
              <Typography variant="h5" className={classes.loginLink}>
                Login to view cart
              </Typography>
            </Link>
          ) : cartProducts && cartProducts.length > 0 ? (
            <Grid container spacing={2} className={classes.cartGrid}>
              {cartProducts?.map((item: Product) => (
                <Grid item key={item.productID} xs={2} sm={4} md={3.5}>
                  <CartItem product={item} setCartProducts={setCartProducts} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="h5" className={classes.cartItems}>
              No cart Items
            </Typography>
          )}
        </Card>
      </Box>
    </Box>
  );
};

export default Cart;

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "90vh",
    textAlign: "center",
    margin: 20,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    maxWidth: "90vw",
    margin: "1vh",
    [theme.breakpoints.up("md")]: {
      minWidth: "50vw",
    },
    [theme.breakpoints.between("sm", "md")]: {
      minWidth: "75vw",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      minWidth: "84vw",
    },
  },
  cartIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "600",
  },
  cartTotal: {
    fontWeight: "600",
  },
  card: {
    maxWidth: "90vw",
    [theme.breakpoints.up("md")]: {
      minWidth: "50vw",
    },
    [theme.breakpoints.between("sm", "md")]: {
      minWidth: "75vw",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      minWidth: "84vw",
    },
    borderRadius: "var(--border-radius)",
    padding: 15,
  },
  loginLink: {
    color: "var(--link-color)",
  },
  cartGrid: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  cartItems: {
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
}));
