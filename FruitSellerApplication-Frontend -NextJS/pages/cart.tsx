import React, { useEffect, useState, useContext } from "react";
import { Typography, Grid, Box, Card } from "@mui/material";
import CartItem from "../components/cartItem";
import { useQuery } from "react-query";
import { getCartItems, getProducts } from "../api/api";
import { Product } from "../entity/apiTypes";
import NavBar from "../components/navBar";
import Link from "next/link";
import { UserContext } from "./_app";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ErrorDisplay from "../components/errorMessage";

const Cart = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: "cartItems",
    queryFn: getCartItems,
  });
  const { data: allProducts } = useQuery({
    queryKey: "products",
    queryFn: getProducts,
  });
  const [cartID, setCartID] = useState<string | null>("");
  const [totalCost, setTotalCost] = useState<number>(0);
  const [cartProducts, setCartProducts] = useState<Product[] | null>([]);
  const { searchText } = useContext(UserContext);

  useEffect(() => {
    setCartID(localStorage.getItem("cartID"));
  }, []);

  useEffect(() => {
    if (data && data?.length > 0 && allProducts && allProducts?.length > 0) {
      let tempCartProducts: Product[] = [];
      data.forEach((cartItem) => {
        allProducts.forEach((product) => {
          if (
            product &&
            cartItem &&
            product.productID == cartItem.productID &&
            product?.productName?.toLowerCase().includes(searchText)
          ) {
            if (tempCartProducts.indexOf(product) == -1) {
              product.cartQuantity = cartItem.quantity;
              tempCartProducts.push(product);
            }
          }
        });
      });
      setCartProducts(tempCartProducts);
    }
  }, [data, allProducts, searchText]);

  useEffect(() => {
    setTotalCost(0);
    cartProducts?.map((product) => {
      setTotalCost((prevCost) => {
        if (product?.cartQuantity != null && product?.price != null) {
          prevCost += product?.cartQuantity * product?.price;
        }
        return prevCost;
      });
    });
  }, [cartProducts]);

  if (isError) {
    return <ErrorDisplay message={"Something went wrong"} />;
  } else if (isLoading) {
    return <ErrorDisplay message={"Loading"} />;
  }

  return (
    <Box>
      <NavBar />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        minHeight="100vh"
        textAlign="center"
        margin={5}
        sx={{marginLeft:{md:12,sm:5,xs:5}}}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            minWidth: { md: "40vw", sm: "65vw", xs: "84vw" },
            maxWidth: { md: "50vw", sm: "75vw", xs: "90vw" },
            margin: "1vh",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "600",
            }}
          >
            {" "}
            <ShoppingCartIcon sx={{ marginRight: 1 }} />
            cart
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: "600" }}>
            ${totalCost}
          </Typography>
        </Box>
        <Card
          sx={{
            minWidth: { md: "40vw", sm: "65vw", xs: "84vw" },
            maxWidth: { md: "50vw", sm: "75vw", xs: "90vw" },
            borderRadius: "var(--border-radius)",
            p: 2,
          }}
        >
          {!cartID ? (
            <Link href="/login">
              <Typography variant="h5" sx={{ color: "blue" }}>
                Login to view cart
              </Typography>
            </Link>
          ) : cartProducts && cartProducts.length > 0 ? (
            <Grid
              container
              spacing={2}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {cartProducts?.map((item: Product) => (
                <Grid item key={item.productID} xs={2} sm={4} md={3.5}>
                  <CartItem product={item} setCartProducts={setCartProducts} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="h5">No cart Items</Typography>
          )}
        </Card>
      </Box>
    </Box>
  );
};

export default Cart;
