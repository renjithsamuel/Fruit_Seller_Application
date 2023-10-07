import React, { useContext, useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Box,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import ProductItem from "../components/productItem";
import { useQuery } from "react-query";
import { getProducts, lookForUser } from "../api/api";
import { Product, categories } from "../entity/apiTypes";
import NavBar from "../components/navBar";
import { UserContext } from "./_app";
import CategoryList from "../components/categoryItem";
import ErrorDisplay from "../components/errorMessage";
import { error } from "console";

const Home = () => {
  const { searchText, user, setUser, products, setProducts } =
    useContext(UserContext);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);

  const { data, isError, isLoading } = useQuery({
    queryKey: "products",
    queryFn: getProducts,
  });
  const { data: dataUser, isError: isUserError } = useQuery({
    queryKey: "getUser",
    queryFn: lookForUser,
  });

  useEffect(() => {
    data && setProducts(data);
  });

  useEffect(() => {
    products &&
      setCurrentProducts(
        products.filter((product) => {
          if (
            product?.productName &&
            product?.category &&
            product?.productName.toLowerCase().includes(searchText) &&
            product?.category
              .toLowerCase()
              .includes(selectedCategory.toLowerCase())
          ) {
            return product;
          }
        })
      );
  }, [searchText, selectedCategory, products]);

  if (isUserError || !data) {
    return null;
  } else {
    dataUser && setUser(dataUser);
  }

  if (isError) {
    return <ErrorDisplay message={"Something went wrong"} />;
  } else if (isLoading) {
    return <ErrorDisplay message={"Loading"} />;
  }

  return (
    <>
      <NavBar />
      <Box textAlign="center" sx={{ marginLeft: {md:"3vw",xs:"0vw",sm:0}, marginRight: "1vw" }}>
        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <Typography
          variant="h5"
          sx={{
            marginTop: 3,
            marginLeft: 3,
            textAlign: "left",
            fontWeight: "600",
          }}
        >
          Popular
        </Typography>
        <Grid
          container
          spacing={2}
          margin={1}
          marginLeft={3}
          overflow={"hidden"}
        >
          {currentProducts && currentProducts.length > 0 ? (
            currentProducts.map((product: Product) => (
              <Grid item key={product.productID} xs={5} sm={3} md={2.2}>
                <ProductItem product={product} user={user} />
              </Grid>
            ))
          ) : (
            <Typography variant="h4" className="noProducts">
              No Products.
            </Typography>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default Home;
