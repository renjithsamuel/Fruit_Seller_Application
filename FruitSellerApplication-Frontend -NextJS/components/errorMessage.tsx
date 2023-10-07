import React from "react";
import { Box, Card, Typography } from "@mui/material";
import NavBar from "./navBar";

interface IErrorMessage {
  message: string;
}

const ErrorDisplay = ({ message }: IErrorMessage) => {
  return (
    <>
      <NavBar />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="50vh"
        marginLeft={10}
        textAlign="center"
        // marginTop={"20vh"}
      >
        <Card
          sx={{
            minWidth: "40vw",
            maxWidth: "50vw",
            borderRadius: "16px",
            p: 2,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: "larger",
              fontWeight: "bold",
              color:
                message == "Something went wrong" ? "red" : "var(--link-color)",
            }}
          >
            {message}
          </Typography>
        </Card>
      </Box>
    </>
  );
};

export default ErrorDisplay;
