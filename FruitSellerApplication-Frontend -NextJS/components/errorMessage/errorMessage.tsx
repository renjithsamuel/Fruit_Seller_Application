import React from "react";
import { Box, Card, Typography } from "@mui/material";
import NavBar from "../navBar/navBar";
import { makeStyles } from "@mui/styles";
import { Theme } from "@material-ui/core";
interface IErrorMessage {
  message: string;
}

const ErrorDisplay = ({ message }: IErrorMessage) => {
  const classes = useStyles();

  return (
    <>
      <NavBar showSearchBar={true} />
      <Box className={classes.ErrorMessageWrap}>
        <Card className={classes.ErrorCard}>
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

const useStyles = makeStyles((theme: Theme) => ({
  ErrorMessageWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50vh",
    marginLeft: 10,
    textAlign: "center",
  },
  ErrorCard: {
    minWidth: "40vw",
    maxWidth: "50vw",
    borderRadius: "16px",
    padding: 20,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
}));
