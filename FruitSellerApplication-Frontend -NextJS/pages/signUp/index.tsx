import React from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Card,
  MenuItem,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import NavBar from "../../components/navBar/navBar";
import Link from "next/link";
import { RegisterParams } from "@/constants/registerParams";
import { makeStyles } from "@mui/styles";
import { Theme } from "@material-ui/core";
import { useSignup } from "./signUp.hooks";

const Signup = () => {
  const classes = useStyles();
  const { initialValues, validationSchema, handleSubmit } = useSignup();

  return (
    <>
      <NavBar showSearchBar={false} />
      <Box className={`${classes.container}`}>
        <Card className={classes.card}>
          <Typography variant="h4" className={classes.heading}>
            Signup
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              {RegisterParams.map((param) => (
                <Box
                  key={param.keyForDB}
                  className={`${classes.textField}`}
                  textAlign="left"
                >
                  {param.keyForDB === "dateOfBirth" ? (
                    <>
                      <Field
                        as={TextField}
                        label={param.inputPlaceHolder}
                        name={param.keyForDB}
                        type={param.inputType}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </>
                  ) : param.keyForDB === "role" ? (
                    <>
                      <Field
                        as={TextField}
                        label="Role"
                        name="role"
                        textAlign="left"
                        fullWidth
                        select
                      >
                        <MenuItem value="buyer">Buyer</MenuItem>
                        <MenuItem value="seller">Seller</MenuItem>
                      </Field>
                    </>
                  ) : (
                    <Field
                      as={TextField}
                      label={param.inputPlaceHolder}
                      name={param.keyForDB}
                      type={param.inputType}
                      InputLabelProps={{
                        shrink: param.inputType === "date" ? true : undefined,
                      }}
                      fullWidth
                    />
                  )}
                  <ErrorMessage
                    name={param.keyForDB}
                    component="Box"
                    className={`error`}
                  />
                </Box>
              ))}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ margin: 0.5 }}
              >
                Signup
              </Button>
            </Form>
          </Formik>
          <Box margin={0.5}>
            <Link href="/login">
              <Typography variant="h6" className={classes.signUpLink}>
                Already have an account? Login
              </Typography>
            </Link>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default Signup;

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    minHeight: "100vh",
    margin: 15,
  },
  card: {
    minWidth: "95vw",
    borderRadius: "16px",
    padding: 15,
    [theme.breakpoints.up("md")]: {
      minWidth: "40vw",
    },
    [theme.breakpoints.between("sm", "md")]: {
      minWidth: "65vw",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      minWidth: "95vw",
    },
  },
  heading: {
    fontWeight: "600",
    fontSize: "25px",
  },
  textField: {
    margin: 15,
  },
  signUpLink: {
    color: "var(--link-color)",
  },
  error: {
    color: "red",
  },
}));
