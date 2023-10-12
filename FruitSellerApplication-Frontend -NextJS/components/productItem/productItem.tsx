import {
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  Box,
  capitalize,
} from "@mui/material";
import { User } from "../../entity/user";
import { Product } from "../../entity/product";
import Notification from "../notification/notification";
import { makeStyles } from "@mui/styles";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { Theme } from "@material-ui/core";
import { useProductItem } from "./productItem.hooks";

type ProductItemProps = {
  product: Product;
  user: User | null;
};

const ProductItem = ({ product, user }: ProductItemProps) => {
  const classes = useStyles();
  const { HandleAddToCart, showNotification, setShowNotification } =
    useProductItem(user);

  return (
    <Card className={`${classes.card} card`}>
      {product.imageUrl && (
        <Box className="cartMediaWrap">
          <CardMedia
            component="img"
            alt={product.productName}
            src={product.imageUrl}
            className={`${classes.cardEffect} cardEffect`}
          />
        </Box>
      )}
      <Box className={classes.ProductDescriptionWrap}>
        <Box className={classes.ProductDescription}>
          <Box textAlign="left">
            <Typography
              variant="h6"
              sx={{
                fontWeight: "600",
                fontSize: { md: "20px", sm: "18px", xs: "15px" },
              }}
            >
              {product?.productName &&
                capitalizeFirstLetter(product?.productName)}
            </Typography>
            <Typography variant="body1" className={classes.Quantity}>
              Quantity: {product.stockQuantity?.toString()}
            </Typography>
          </Box>
          <Typography variant="body1" className={classes.Price}>
            ${product.price?.toString()}
          </Typography>
        </Box>
        <Button
          onClick={() => HandleAddToCart(product.productID)}
          className={"addToCartBtn"}
        >
          Add to Cart
        </Button>
          <Notification
            message="Product added to cart!"
            showNotification={showNotification}
            setShowNotification={setShowNotification}
          />
      </Box>
    </Card>
  );
};

export default ProductItem;

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: "45vw",
    height: "37vh",
    borderRadius: "var(--border-radius)",
    padding: "2vh",
    [theme.breakpoints.up("md")]: {
      width: "16vw",
      height: "41vh",
    },
    [theme.breakpoints.between("sm", "md")]: {
      width: "28vw",
      height: "42vh",
    },
  },
  Quantity: {
    color: "gray",
    fontSize: "12px",
    [theme.breakpoints.up("md")]: {
      fontSize: "14px",
    },
    [theme.breakpoints.between("sm", "md")]: {
      fontSize: "13px",
    },
  },
  Price: {
    fontWeight: "600",
    textAlign: "right",
    alignSelf: "center",
    fontSize: "15px",
    [theme.breakpoints.up("md")]: {
      fontSize: "20px",
    },
    [theme.breakpoints.between("sm", "md")]: {
      fontSize: "18px",
    },
  },
  ProductDescriptionWrap: {
    userSelect: "none",
    height: "40%",
  },
  ProductDescription: {
    display: "flex",
    justifyContent: "space-between",
  },
  cardEffect: {
    maxWidth: "100%",
    maxHeight: "150px",
    objectFit: "contain",
    borderRadius: "var(--border-radius)",
  },
}));
