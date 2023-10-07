"use client";
import React, { useState, useEffect } from "react";
import { Typography, TextField, Button, Box, Card } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import NavBar from "../components/navBar";
import { ProfileParams } from "../entity/apiTypes";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { User } from "../entity/apiTypes";
import { lookForUser, UpdateUser, DeleteUser } from "../api/api";
import Link from "next/link";
import { useMutation, useQueryClient } from "react-query";

const Profile = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<User | null>({});

  const { data: user, isError } = useQuery({
    queryKey: "getUser",
    queryFn: () => lookForUser(),
  });

  const Logout = () => {
    if (confirm("sure to logout?")) {
      localStorage.clear();
      if (typeof window !== undefined) router.push("/");
      setCurrentUser({});
      return;
    }
  };

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  const initialValues: User = {
    name: user?.name,
    email: user?.email,
    role: user?.role,
    dateOfBirth: user?.dateOfBirth,
    phoneNumber: user?.phoneNumber,
    preferredLanguage: user?.preferredLanguage,
    address: user?.address,
    country: user?.country,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    role: Yup.string()
      .oneOf(["buyer", "seller"], "Role must be either buyer or seller")
      .required("Role is required"),
    dateOfBirth: Yup.date().required("Date of Birth is required"),
    phoneNumber: Yup.string().required("Phone Number is required"),
    preferredLanguage: Yup.string().required("Preferred language is required"),
    address: Yup.string().required("Address is required"),
    country: Yup.string().required("Country is required"),
  });

  const mutation = useMutation((values: any) => UpdateUser(values), {
    onSuccess: () => {
      queryClient.invalidateQueries("getUser");
    },
  });
  const handleSubmit = async (values: any) => {
    values.role = values?.role?.toLowerCase();
    const currentDate = new Date(values.dateOfBirth);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    values.dateOfBirth = `${year}-${month}-${day}`;
    try {
      const userData = await mutation.mutateAsync(values);
      console.log(userData);
      userData && setCurrentUser(userData);
    } catch (error) {
      console.error("upadte user failed:", error);
    }
  };

  const handleDeleteUser = async () => {
    if (!confirm("Are you sure?")) {
      return;
    }
    if (await DeleteUser()) {
      Logout();
    }
  };

  return (
    <>
      <NavBar />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        minHeight="100vh"
        margin={5}
      >
        <Card
          sx={{
            minWidth: { md: "40vw", sm: "55vw", xs: "75vw" },
            maxWidth: { md: "50vw", sm: "65vw", xs: "85vw" },
            borderRadius: "16px",
            p: 2,
          }}
        >
          {isError || !user ? (
            <Link href="/login">
              <Typography variant="h6" textAlign={"center"}>User Not Found Please Login</Typography>
            </Link>
          ) : (
            <>
              <Typography variant="h4" textAlign={"center"}>User Profile</Typography>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                <Form>
                  <Box className="profileFormWrap">
                    {ProfileParams.map((param) => (
                      <Box
                        key={param.keyForDB}
                        sx={{ margin: 1.5, width: "80%" }}
                      >
                        <Field
                          as={TextField}
                          name={param.keyForDB}
                          label={param.inputPlaceHolder}
                          type={param.inputType}
                          fullWidth
                        />
                        <ErrorMessage
                          name={param.keyForDB}
                          component="Box"
                          className="error"
                        />
                      </Box>
                    ))}
                  </Box>
                  <Box
                    display={"flex"}
                    sx={{
                      justifyContent: "center",
                      gap: 2,
                      margin: 3,
                      flexDirection: { md: "row", sm: "column", xs: "column" },
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      className="profileBtns"
                    >
                      Update Profile
                    </Button>
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        className="profileBtns"
                        onClick={()=>{router.push("/profile/products")}}
                      >
                        Products
                      </Button>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      onClick={Logout}
                      className="profileBtns"
                    >
                      Logout
                    </Button>

                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      onClick={handleDeleteUser}
                      className="profileBtns"
                    >
                      Delete User
                    </Button>
                  </Box>
                </Form>
              </Formik>
            </>
          )}
        </Card>
      </Box>
    </>
  );
};

export default Profile;
