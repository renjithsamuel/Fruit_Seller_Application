import { Grid, Card, Box } from "@mui/material";
import Image from "next/image";
import { makeStyles } from "@mui/styles";
import { Theme } from "@material-ui/core";
import { categoryItem } from "@/entity/category";
import { useCategoryList } from "./categoryItem.hooks";

interface CategoryListProps {
  categories: categoryItem[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CategoryList = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: CategoryListProps) => {
  const classes = useStyles();

  const { handleCategory } = useCategoryList(
    categories,
    selectedCategory,
    setSelectedCategory
  );

  return (
    <Grid
      container
      spacing={2}
      marginTop={1}
      className={classes.CategoryWrap}
      sx={{
        px: { md: 2, sm: 2, xs: 1 },
      }}
    >
      {categories.map((category, index) => (
        <Grid item key={index} xs={4} sm={3} md={1}>
          <Box
            className={`${classes.gridItem} ${
              selectedCategory.toLowerCase() === category.category.toLowerCase()
                ? classes.selected
                : classes.unSelected
            }`}
            onClick={() => handleCategory(category.category)}
          >
            <Box className={classes.categoryImageBox}>
              <Image
                alt={category.category}
                height="40"
                width="40"
                src={`/assets/${category.imageUrl}.svg`}
                className={classes.categoryImage}
              />
            </Box>
            <Box className={classes.categoryName}>{category.category}</Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default CategoryList;

const useStyles = makeStyles((theme: Theme) => ({
  CategoryWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
  },
  gridItem: {
    borderRadius: "var(--border-radius)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "var(--box-shadow)",
  },
  selected: {
    border: "2px solid black",
    backgroundColor: "var(--hover-color-chip)",
  },
  unSelected: {
    border: "2px solid transparent",
    backgroundColor: "white",
  },
  categoryImageBox: {
    width: "35%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryImage: {
    padding: 10,
    paddingLeft: 1,
    objectFit: "contain",
    userSelect: "none",
    borderRadius: "var(--border-radius)",
  },
  categoryName: {
    textAlign: "left",
    textOverflow: "clip",
    userSelect: "none",
    width: "60%",
    [theme.breakpoints.up("md")]: {
      fontSize: "13px",
    },
    [theme.breakpoints.between("sm", "md")]: {
      fontSize: "13px",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      fontSize: "12px",
    },
  },
}));
