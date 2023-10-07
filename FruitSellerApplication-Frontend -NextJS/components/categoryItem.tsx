import React from "react";
import { Typography, Grid, Card, CardMedia, CardContent, Box } from "@mui/material";
import Image from "next/image";

interface CategoryListProps {
  categories: {
    category: string;
    imageUrl: string;
  }[];
  selectedCategory: any;
  setSelectedCategory: (category: string) => void;
}

const CategoryList = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: CategoryListProps) => {

  const handleCategory = (category: string) => {
    if (selectedCategory.toLowerCase() === category.toLowerCase()) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        marginLeft: {md : "10%", sm: "5%", xs : "2%"},
        marginTop: "3vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h6"
        sx={{ marginTop: 3, marginLeft: 3, textAlign: "left" }}
        className="categories"
      >
        Categories:
      </Typography>
      <Grid container spacing={2} marginLeft={"1%"} marginTop={1}>
        {categories.map((category, index) => (
          <Grid item key={index} xs={3} sm={2} md={1.2}>
            <Card
              sx={{
                borderRadius: "var(--border-radius)",
                border:
                  selectedCategory.toLowerCase() === category.category.toLowerCase()
                    ? "2px solid black"
                    : "2px solid transparent",
                backgroundColor:
                selectedCategory.toLowerCase() === category.category.toLowerCase()?
                "var(--hover-color-chip)" : "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingRight: "0.4vw",
              }}
              className="categoryChips"
              onClick={() => handleCategory(category.category)}
            >
              <Image
                alt={category.category}
                height="50"
                width="50"
                src={`/assets/${category.imageUrl}.svg`}
                style={{
                  padding: 10,
                  paddingLeft: 1,
                  paddingRight: 0,
                  objectFit: "contain",
                  userSelect: "none",
                  borderRadius:"var(--border-radius)",
                }}
              />
              <Box
                sx={{
                  fontSize: "small",
                  textAlign: "left",
                  textOverflow: "clip",
                  userSelect: "none",
                }}
              >
                {category.category}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategoryList;
