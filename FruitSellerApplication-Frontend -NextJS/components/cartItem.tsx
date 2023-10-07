import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  Box,
  IconButton,
} from "@mui/material";
import { Product, UpdateCartObject } from "../entity/apiTypes";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { RemoveFromCart, updateCartItem } from "../api/api";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation, useQueryClient } from "react-query";

type CartItemProps = {
  product: Product;
  setCartProducts: React.Dispatch<React.SetStateAction<Product[] | null>>;
};

const CartItem = ({ product, setCartProducts }: CartItemProps) => {
  const queryClient = useQueryClient();

  const updateCartItemMutation = useMutation(updateCartItem, {
    onSuccess: () => {
      queryClient.invalidateQueries("cart");
    },
  });

  const removeFromCartMutation = useMutation(RemoveFromCart, {
    onSuccess: () => {
      queryClient.invalidateQueries("cart");
    },
  });

  const handleRemove = async (productID: string) => {
    if (productID != null) {
      const success = await removeFromCartMutation.mutateAsync(productID);
      if (success) {
        setCartProducts((cartProducts) => {
          return (cartProducts || []).filter(
            (cartItem) => cartItem.productID !== product.productID
          );
        });
      }
    }
  };

  const handleUpdateCartItem = async (productID: string, process: string) => {
    let updateObject: UpdateCartObject = { productID: productID };
    if (process === "increase") {
      updateObject.quantity =
        product?.cartQuantity != null ? product?.cartQuantity + 1 : 1;
    } else if (product?.cartQuantity != null && product?.cartQuantity > 0) {
      updateObject.quantity =
        product?.cartQuantity != null ? product?.cartQuantity - 1 : 1;
    }

    if (updateObject?.quantity && updateObject?.quantity <= 0) {
      alert("Invalid quantity");
      return;
    }

    const success = await updateCartItemMutation.mutateAsync(updateObject);
    if (success) {
      setCartProducts((cartProducts) => {
        return (cartProducts || []).map((cartItem) => {
          if (cartItem.productID === product.productID) {
            return { ...cartItem, cartQuantity: updateObject.quantity };
          } else {
            return cartItem;
          }
        });
      });
    } else {
      alert("Product Invalid Or Out of Stock");
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        width: {md:"47vw",sm:"70vw",xs:"85vw"},
        height: {md:"12vh",sm:"16vh",xs:"20vh"},
        boxShadow: "none",
      }}
    >
      {product.imageUrl && (
        <Box
          sx={{
            width:{md: "15%",sm:"20%",xs:"25%"},
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CardMedia
            component="img"
            alt={product.productName}
            src={product.imageUrl}
            sx={{
              margin: 0,
              padding: 0,
              maxWidth: "60px",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: "var(--border-radius)",
            }}
          />
        </Box>
      )}

      <Box
        sx={{
          width:{md: "20%",sm:"25%",xs:"30%"},
          textAlign: "left",
          position: "relative",
          left: "-2vw",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "600" }}>
          {" "}
          {product?.productName &&
            product?.productName?.charAt(0).toUpperCase() +
              product?.productName?.slice(1)}
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "gray", fontSize: "medium", fontWeight: "500" }}
        >
          Left in stock: {product?.stockQuantity}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          width:{md: "20%",sm:"25%",xs:"30%"},
        }}
      >
        <IconButton
          className="cartIconWrap"
          onClick={() =>
            product?.productID &&
            handleUpdateCartItem(product.productID, "increase")
          }
        >
          <AddCircleIcon />
        </IconButton>
        <Box className="cartIconWrap" sx={{ padding: 3, fontWeight: "600" }}>
          {product?.cartQuantity?.toString()}
        </Box>
        <IconButton
          className="cartIconWrap"
          onClick={() =>
            product?.productID &&
            handleUpdateCartItem(product.productID, "decrease")
          }
        >
          <RemoveCircleIcon />
        </IconButton>
      </Box>

      <Typography
        variant="body1"
        sx={{   width:{md: "10%",sm:"25%",xs:"30%"}, fontWeight: "600", fontSize: "larger" }}
      >
        $
        {product?.price &&
          product?.cartQuantity &&
          (product?.price * product?.cartQuantity).toString()}
      </Typography>
      <IconButton
        className="cartIconWrap"
        color="error"
        onClick={() => product?.productID && handleRemove(product?.productID)}
      >
        <DeleteIcon />
      </IconButton>
    </Card>
  );
};

export default CartItem;
