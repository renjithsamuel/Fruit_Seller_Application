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
import * as Yup from "yup";
import NavBar from "../components/navBar";
import { RegisterParams } from "../entity/apiTypes";
import { SignInUser } from "../api/api";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";

const Signup = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const initialValues = {
    name: "",
    email: "",
    password: "",
    role: "",
    dateOfBirth: "",
    phoneNumber: "",
    preferredLanguage: "",
    address: "",
    country: "",
  };

  const validationSchema = Yup.object().shape({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
      role: Yup.string()
      .oneOf(["BUYER", "SELLER"], "Role must be either BUYER or SELLER")
      .required("Role is required"),
      dateOfBirth: Yup.date().required("Date of Birth is required"),
      phoneNumber: Yup.string().required("Phone Number is required"),
      preferredLanguage: Yup.string().required("Preferred language is required"),
      address: Yup.string().required("Address is required"),
      country: Yup.string().required("Country is required"),
  });

  const mutation = useMutation((values: any) => SignInUser(false, values), {
    onSuccess: () => {
      queryClient.invalidateQueries("getUser");
      router.push("/profile");
    },
  });

  const handleSubmit = async (values: any) => {
    values.role = values.role.toLowerCase()
    const currentDate = new Date(values.dateOfBirth);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    console.log(values);

    values.dateOfBirth = `${year}-${month}-${day}`;

    try {
      const userData = await mutation.mutateAsync(values);
      console.log(userData);
    } catch (error) {
      console.error("signUp failed:", error);
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
        margin={5}
      >
        <Card sx={{ minWidth:  { md: "40vw", sm: "65vw", xs: "75vw" }, borderRadius: "16px", p: 2 }}>
          <Typography variant="h4">Signup</Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              {RegisterParams.map((param) => (
                <Box key={param.keyForDB} sx={{ margin: 1.5 }} textAlign={"left"}>
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
                        <MenuItem value="BUYER">Buyer</MenuItem>
                        <MenuItem value="SELLER">Seller</MenuItem>
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
                  <ErrorMessage name={param.keyForDB} component="Box"  className="error" />
                </Box>
              ))}
              <Button type="submit" variant="contained" color="primary">
                Signup
              </Button>
            </Form>
          </Formik>
          <Box>
            <Link href="/login">
              <Typography variant="h6">
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
