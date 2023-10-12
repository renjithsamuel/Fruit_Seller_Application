import React from "react";
import { Card, Typography, Button, Box, CardMedia } from "@mui/material";
import { Product } from "../../entity/product";
import { makeStyles } from "@mui/styles";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { Theme } from "@material-ui/core";
import { useSellerItem } from "./sellerItem.hooks";

type ProductItemProps = {
  product: Product;
  setProductData: (updatedProductData: Product) => void;
  setOpenDialog: (isOpen: boolean) => void;
  setUpdateProduct: (updateProduct: boolean) => void;
};

const SellerItem = ({
  product,
  setProductData,
  setOpenDialog,
  setUpdateProduct,
}: ProductItemProps) => {
  const classes = useStyles();
  const { handleUpdateProduct } = useSellerItem(
    product,
    setProductData,
    setOpenDialog,
    setUpdateProduct
  );

  return (
    <Card className={`${classes.card} card`}>
      {product.imageUrl && (
        <Box className={`${classes.cardMediaWrap} cartMediaWrap`}>
          <CardMedia
            component="img"
            alt={product?.productName}
            src={product?.imageUrl}
            className={`${classes.cardEffect} cardEffect`}
          />
        </Box>
      )}

      <Box className={classes.cardDescription}>
        <Box className={classes.cardHeader}>
          <Box className={classes.productName}>
            <Typography className={classes.productNameText}>
              {product?.productName &&
                capitalizeFirstLetter(product?.productName)}
            </Typography>
            <Typography className={classes.productQuantity}>
              Quantity: {product.stockQuantity?.toString()}
            </Typography>
          </Box>
          <Typography className={classes.productPrice}>
            ${product.price?.toString()}
          </Typography>
        </Box>
        <Button
          onClick={handleUpdateProduct}
          className={`${classes.addToCartBtn} addToCartBtn`}
        >
          Update
        </Button>
      </Box>
    </Card>
  );
};

export default SellerItem;

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    display: "flex",
    flexDirection: "column",
    gap: theme.breakpoints.between("sm", "md") ? 1 : 0.5,
    [theme.breakpoints.up("md")]: {
      width: "16vw",
      height: "41vh",
    },
    [theme.breakpoints.between("sm", "md")]: {
      minWidth: "28vw",
      height: "42vh",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      minWidth: "45vw",
      height: "37vh",
    },
    borderRadius: "var(--border-radius)",
    padding: "2vh",
  },
  cardMediaWrap: {
    height: "60%",
  },
  cardEffect: {
    maxWidth: "100%",
    maxHeight: "150px",
    objectFit: "contain",
    borderRadius: "var(--border-radius)",
  },
  cardDescription: {
    marginTop: 5,
    userSelect: "none",
    height: "40%",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
  },
  productName: {
    textAlign: "left",
  },
  productNameText: {
    fontWeight: "600",
    [theme.breakpoints.up("md")]: {
      fontSize: "20px",
    },
    [theme.breakpoints.between("sm", "md")]: {
      fontSize: "18px",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      fontSize: "15px",
    },
  },
  productQuantity: {
    color: "gray",
    [theme.breakpoints.up("md")]: {
      fontSize: "14px",
    },
    [theme.breakpoints.between("sm", "md")]: {
      fontSize: "13px",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      fontSize: "12px",
    },
  },
  productPrice: {
    [theme.breakpoints.up("md")]: {
      fontSize: "20px",
    },
    [theme.breakpoints.between("sm", "md")]: {
      fontSize: "18px",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      fontSize: "15px",
    },
    fontWeight: "600",
    textAlign: "right",
    alignSelf: "center",
  },
  addToCartBtn: {
    [theme.breakpoints.up("md")]: {
      fontSize: "15px",
    },
    [theme.breakpoints.between("sm", "md")]: {
      fontSize: "13px",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      fontSize: "12px",
    },
  },
}));
