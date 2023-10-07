import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CardMedia,
} from "@mui/material";
import { Product } from "../entity/apiTypes";

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
  const handleUpdateProduct = () => {
    setProductData({ ...product });
    setOpenDialog(true);
    setUpdateProduct(true);
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: 300,
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
              borderRadius:"var(--border-radius)",
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
        <Button onClick={handleUpdateProduct} className="addToCartBtn">
          Update Product
        </Button>
      </CardContent>
    </Card>
  );
};

export default SellerItem;
