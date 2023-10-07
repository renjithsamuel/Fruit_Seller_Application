import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  Box
} from "@mui/material";
import { Product, User } from "../entity/apiTypes";
import { AddToCart } from "../api/api";
import Notification from "./notification";
import {
  useMutation,
  useQueryClient,
} from "react-query";

type ProductItemProps = {
  product: Product;
  user: User | null;
};

const ProductItem = ({ product, user }: ProductItemProps) => {
  const [showNotification, setShowNotification] = useState(false);
  const queryClient = useQueryClient(); 

  const addToCartMutation = useMutation(AddToCart, {
    onSuccess: () => {
      queryClient.invalidateQueries("cart");
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 4000);
    },
  });
  const HandleAddToCart = async (productID: string | undefined) => {
    if (JSON.stringify(user) == "{}") {
      alert("Login to Add to Cart!");
      return;
    }
    if (productID != null) {
      const addedToCart = await addToCartMutation.mutateAsync(productID);
      // if (addedToCart) {
      //   setShowNotification(true);
      //   setTimeout(() => {
      //     setShowNotification(false);
      //   }, 4000);
      // }
    }
  };


  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "46vh",
        borderRadius: "var(--border-radius)",
      }}
      className="card"
    >
      {product.imageUrl && (
        <Box className="cartMediaWrap">
          <CardMedia
            component="img"
            alt={product.productName}
            src={product.imageUrl}
            sx={{
              maxWidth: "100%",
              maxHeight: "150px",
              objectFit: "contain",
              borderRadius: "var(--border-radius)",
            }}
            className="cardEffect"
          />
        </Box>
      )}
      <CardContent sx={{ paddingTop: "1vh", userSelect: "none" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ textAlign: "left" }}>
            <Typography variant="h6" sx={{ fontWeight: "600" }}>
              {" "}
              {product?.productName &&
                product?.productName?.charAt(0).toUpperCase() +
                  product?.productName?.slice(1)}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "gray", fontSize: "14px" }}
            >
              Available Quantity: {product.stockQuantity?.toString()}
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              fontSize: "18px",
              fontWeight: "600",
              textAlign: "right",
              alignSelf: "center",
            }}
          >
            ${product.price?.toString()}
          </Typography>
        </Box>
        <Button
          onClick={() => HandleAddToCart(product.productID)}
          className="addToCartBtn"
        >
          Add to Cart
        </Button>
        {showNotification && (
          <Notification
            message="Product added to cart!"
            duration={4000}
            onClose={() => setShowNotification(false)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ProductItem;
