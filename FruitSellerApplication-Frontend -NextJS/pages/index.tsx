import { Typography, Grid, Box } from "@mui/material";
import ProductItem from "../components/productItem/productItem";
import NavBar from "../components/navBar/navBar";
import CategoryList from "../components/categoryItem/categoryItem";
import ErrorDisplay from "../components/errorMessage/errorMessage";
import { categories } from "@/constants/categories";
import {  makeStyles} from "@mui/styles";
import { Theme } from "@material-ui/core";
import { useHome } from "./home.hooks";
import { Product } from "@/entity/product";

const Home = () => {
  const classes = useStyles();
  const {
    selectedCategory,
    setSelectedCategory,
    currentProducts,
    isProductsError,
    isProductsLoading,
    user,
  } = useHome();

  if (isProductsError) {
    return <ErrorDisplay message={"Something went wrong"} />;
  } else if (isProductsLoading) {
    return <ErrorDisplay message={"Loading"} />;
  }

  return (
    <>
      <NavBar showSearchBar={true} />
      <Box textAlign="center" className={classes.container}>
        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <Box sx={{ width: "100vw", px: { md: 10, sm: 2, xs: 2 } }}>
          <Typography variant="h5" sx={{ py: 2 }} className={classes.heading}>
            Popular
          </Typography>
          <Grid container spacing={2}>
            {currentProducts && currentProducts.length > 0 ? (
              currentProducts.map((product: Product) => (
                <Grid item key={product.productID} xs={6} sm={4} md={2.4}>
                  <ProductItem product={product} user={user} />
                </Grid>
              ))
            ) : (
              <Typography
                variant="h4"
                className={`${classes.noProductsText} noProducts`}
              >
                No Products
              </Typography>
            )}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

const useStyles = makeStyles((theme:Theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    paddingTop: 15,
    paddingBottom: 15,
  },
  heading: {
    marginTop: 2,
    marginBottom: 2,
    textAlign: "left",
    alignSelf: "start",
    fontWeight: "600",
    [theme.breakpoints.up("md")]: {
      fontSize: "30px",
    },
    [theme.breakpoints.between("sm", "md")]: {
      fontSize: "28px",
    },
    [theme.breakpoints.between("xs","sm")]: {
      fontSize: "22px",
    },

  },
  noProductsText: {
    fontWeight: "600",
    [theme.breakpoints.up("md")]: {
      fontSize: "28px",
    },
    [theme.breakpoints.between("sm", "md")]: {
      fontSize: "25px",
    },
    [theme.breakpoints.between("xs","sm")]: {
      fontSize: "20px",
    },
  },
}));

export default Home;
