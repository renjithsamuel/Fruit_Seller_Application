import {
  Card,
  Typography,
  Button,
  CardMedia,
  Box,
  IconButton,
} from "@mui/material";
import { UpdateCartObject } from "../../entity/cart";
import { Product } from "../../entity/product";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { RemoveFromCart } from "../../api/cart/removeFromCart";
import { updateCartItem } from "../../api/cart/updateCartItem";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation, useQueryClient } from "react-query";
import { makeStyles } from "@mui/styles";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { Theme } from "@material-ui/core";
import { useCartItem } from "./cartItem.hooks";

type CartItemProps = {
  product: Product;
  setCartProducts: React.Dispatch<React.SetStateAction<Product[] | null>>;
};

const CartItem = ({ product, setCartProducts }: CartItemProps) => {
  const classes = useStyles();

  const { handleRemove, handleUpdateCartItem } = useCartItem(
    product,
    setCartProducts
  );

  return (
    <Card className={classes.card}>
      {/* image */}
      {product.imageUrl && (
        <Box className={classes.imageBox}>
          <CardMedia
            component="img"
            alt={product.productName}
            src={product.imageUrl}
            className={classes.image}
          />
        </Box>
      )}

      {/* name and price */}
      <Box className={classes.nameAndPrice}>
        <Typography variant="h6" className={classes.nameAndPriceText}>
          {" "}
          {product?.productName && capitalizeFirstLetter(product?.productName)}
        </Typography>
        <Typography variant="body1" className={classes.StockQuantity}>
          Left in stock: {product?.stockQuantity}
        </Typography>
      </Box>

      {/* increase and decrease */}
      <Box className={classes.increaseDecrease}>
        <IconButton
          onClick={() =>
            product?.productID &&
            handleUpdateCartItem(product.productID, "increase")
          }
        >
          <AddCircleIcon />
        </IconButton>
        <Box className={`cartIconWrap ${classes.cartIconWrap}`}>
          {product?.cartQuantity?.toString()}
        </Box>
        <IconButton
          onClick={() =>
            product?.productID &&
            handleUpdateCartItem(product.productID, "decrease")
          }
        >
          <RemoveCircleIcon />
        </IconButton>
      </Box>

      {/* price display */}
      <Typography className={classes.priceDisplay}>
        $
        {product?.price &&
          product?.cartQuantity &&
          (product?.price * product?.cartQuantity).toString()}
      </Typography>

      {/* delete button */}
      <Box className={classes.deleteButton}>
        <IconButton
          color="error"
          className="cartIconWrap"
          onClick={() => product?.productID && handleRemove(product?.productID)}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
};

export default CartItem;

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    boxShadow: "none",
    [theme.breakpoints.up("md")]: {
      width: "47vw",
      height: "12vh",
    },
    [theme.breakpoints.between("sm", "md")]: {
      width: "70vw",
      height: "16vh",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      width: "85vw",
      height: "20vh",
    },
  },
  imageBox: {
    width: "20%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.up("md")]: {
      width: "20%",
    },
    [theme.breakpoints.between("sm", "md")]: {
      width: "20%",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      width: "15%",
    },
  },
  image: {
    maxWidth: "60px",
    maxHeight: "100%",
    objectFit: "contain",
    borderRadius: "var(--border-radius)",
  },
  nameAndPrice: {
    textAlign: "left",
    position: "relative",
    [theme.breakpoints.up("md")]: {
      left: "-2vw",
      width: "30%",
    },
    [theme.breakpoints.between("sm", "md")]: {
      left: "-1vw",
      width: "20%",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      left: "2vw",
      width: "35%",
    },
  },
  nameAndPriceText: {
    fontWeight: "600",
    [theme.breakpoints.up("md")]: {
      fontSize: "20px",
    },
    [theme.breakpoints.between("sm", "md")]: {
      fontSize: "18px",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      fontSize: "18px",
    },
  },
  StockQuantity: {
    color: "gray",
    fontWeight: "500",
    [theme.breakpoints.up("md")]: {
      fontSize: "14px",
    },
    [theme.breakpoints.between("sm", "md")]: {
      fontSize: "13px",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      fontSize: "13px",
    },
  },
  increaseDecrease: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
    [theme.breakpoints.up("md")]: {
      width: "20%",
      flexDirection: "row",
      gap: 12,
    },
    [theme.breakpoints.between("sm", "md")]: {
      width: "20%",
      flexDirection: "row",
      gap: 8,
    },
    [theme.breakpoints.between("xs", "sm")]: {
      width: "15%",
      flexDirection: "column",
      gap: 5,
    },
  },
  cartIconWrap: {
    padding: 10,
    borderRadius: "var(--icon-border-radius)",
    fontWeight: "600",
    fontSize: "17px",
    [theme.breakpoints.up("md")]: {
      padding: 18,
      fontSize: "20px",
    },
    [theme.breakpoints.between("sm", "md")]: {
      padding: 15,
      fontSize: "18px",
    },
  },
  priceDisplay: {
    width: "15%",
    fontWeight: "600",
    fontSize: "17px",
    [theme.breakpoints.up("md")]: {
      fontSize: "20px",
      width: "10%",
    },
    [theme.breakpoints.between("sm", "md")]: {
      fontSize: "18px",
      width: "10%",
    },
  },
  deleteButton: {
    width: "15%",
    [theme.breakpoints.up("md")]: {
      width: "10%",
    },
    [theme.breakpoints.between("sm", "md")]: {
      width: "10%",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      width: "15%",
    },
  },
}));
