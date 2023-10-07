import React from "react";
import { Typography, TextField, Button, Box, Card } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import NavBar from "../components/navBar";
import Link from "next/link";
import { SignInUser } from "../api/api";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";

const Login = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const mutation = useMutation((values: any) => SignInUser(true, values), {
    onSuccess: () => {
      queryClient.invalidateQueries("getUser");
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      const userData = await mutation.mutateAsync(values);
      console.log(userData);
      router.push("/profile");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <>
      <NavBar />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign={"center"}
        minHeight="100vh"
      >
        <Card
          sx={{
            minWidth: { md: "35vw", sm: "55vw", xs: "65vw" },
            borderRadius: "16px",
            p: 2,
          }}
        >
          <Typography variant="h4" textAlign={"center"}>
            Login
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <Box sx={{ margin: 1.5 }} textAlign={"left"}>
                <Field as={TextField} label="Email" name="email" fullWidth />
                <ErrorMessage name="email" component="Box" className="error" />
              </Box>
              <Box sx={{ margin: 1.5 }} textAlign={"left"}>
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
                sx={{ alignSelf: "center" }}
              >
                Login
              </Button>
            </Form>
          </Formik>
          <Box>
            <Link href="/signUp">
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
