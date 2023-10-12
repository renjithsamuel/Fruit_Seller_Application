import React from "react";
import { Typography, TextField, Button, Box, Card } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import NavBar from "../../components/navBar/navBar";
import Link from "next/link";
import { makeStyles } from "@mui/styles";
import { Theme } from "@material-ui/core";
import { useLogin } from "./login.hooks";

const Login = () => {
  const classes = useStyles();
  const { initialValues, validationSchema, handleSubmit } = useLogin();

  return (
    <>
      <NavBar showSearchBar={false} />
      <Box className={classes.container}>
        <Card className={classes.card}>
          <Typography
            variant="h4"
            textAlign={"center"}
            className={classes.heading}
          >
            Login
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <Box className={classes.textField}>
                <Field as={TextField} label="Email" name="email" fullWidth />
                <ErrorMessage name="email" component="Box" className="error" />
              </Box>
              <Box className={classes.textField}>
                <Field
                  as={TextField}
                  label="Password"
                  name="password"
                  type="password"
                  fullWidth
                />
                <ErrorMessage
                  name="password"
                  component="Box"
                  className="error"
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.loginButton}
              >
                Login
              </Button>
            </Form>
          </Formik>
          <Box className="oldclassname" margin={0.5}>
            <Link href="/signUp" className={classes.signUpLink}>
              <Typography variant="h6">
                Dont have an account? Sign up
              </Typography>
            </Link>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default Login;

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    minHeight: "90vh",
  },
  card: {
    [theme.breakpoints.up("md")]: {
      minWidth: "35vw",
    },
    [theme.breakpoints.between("sm", "md")]: {
      minWidth: "55vw",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      minWidth: "95vw",
    },
    borderRadius: "16px",
    padding: 15,
  },
  heading: {
    fontWeight: "600",
  },
  textField: {
    margin: 10,
    textAlign: "left",
  },
  loginButton: {
    alignSelf: "center",
    margin: 8,
  },
  signUpLink: {
    color: "var(--link-color)",
  },
}));
