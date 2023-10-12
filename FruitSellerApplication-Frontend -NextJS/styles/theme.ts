import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const CustomTheme = responsiveFontSizes(
    createTheme(
      {
      typography: {
        fontFamily: "Poppins, sans-serif",
      },
      spacing: 8,
      breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 900,
          lg: 1200,
          xl: 1536,
        },
      },
    }
    )
  );

export default CustomTheme