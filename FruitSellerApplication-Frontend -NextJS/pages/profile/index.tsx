import { Typography, TextField, Button, Box, Card } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import NavBar from "../../components/navBar/navBar";
import Link from "next/link";
import { ProfileParams } from "@/constants/profileParams";
import { makeStyles } from "@mui/styles";
import { Theme } from "@material-ui/core";
import { useProfile } from "./profile.hooks";

const Profile = () => {
  const classes = useStyles();
  const {
    initialValues,
    validationSchema,
    handleSubmit,
    handleDeleteUser,
    Logout,
    isUserError,
    isUserLoading,
    user,
    router,
  } = useProfile();

  return (
    <>
      <NavBar showSearchBar={false} />
      <Box className={classes.container}>
        <Card
          className={classes.card}
          sx={{ marginTop: isUserError || !user ? "10%" : "0" }}
        >
          {isUserError || !user ? (
            <Link href="/login" className={classes.signUpLink}>
              <Typography
                variant="h6"
                className={classes.heading}
                textAlign={"center"}
              >
                User Not Found Please Login
              </Typography>
            </Link>
          ) : isUserLoading ? (
            <Typography
              variant="h6"
              className={classes.heading}
              textAlign={"center"}
            >
              Loading
            </Typography>
          ) : (
            <>
              <Typography
                variant="h4"
                className={classes.heading}
                textAlign={"center"}
              >
                User Profile
              </Typography>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                <Form>
                  <Box className={classes.profileFormWrap}>
                    {ProfileParams.map((param) => (
                      <Box
                        key={param.keyForDB}
                        className={classes.textFieldWrap}
                      >
                        <Field
                          as={TextField}
                          name={param.keyForDB}
                          label={param.inputPlaceHolder}
                          type={param.inputType}
                          fullWidth
                          className={classes.textField}
                        />
                        <ErrorMessage
                          name={param.keyForDB}
                          component="Box"
                          className={`error`}
                        />
                      </Box>
                    ))}
                  </Box>
                  <Box
                    display={"flex"}
                    justifyContent="center"
                    gap={2}
                    marginTop={1}
                    className={classes.ProfileBtnsWrap}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className={`profileBtns ${classes.profileBtns}`}
                    >
                      Update Profile
                    </Button>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      className={`profileBtns ${classes.profileBtns}`}
                      onClick={() => {
                        router.push("/profile/products");
                      }}
                    >
                      Products
                    </Button>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      onClick={Logout}
                      className={`profileBtns ${classes.profileBtns}`}
                    >
                      Logout
                    </Button>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      onClick={handleDeleteUser}
                      className={`profileBtns ${classes.profileBtns}`}
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

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    margin: 15,
  },
  card: {
    borderRadius: "16px",
    padding: 15,
    [theme.breakpoints.up("md")]: {
      width: "40vw",
    },
    [theme.breakpoints.between("sm", "md")]: {
      width: "65vw",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      width: "95vw",
    },
  },
  heading: {
    fontWeight: "600",
    [theme.breakpoints.up("md")]: {
      fontSize: "30px",
    },
    [theme.breakpoints.between("sm", "md")]: {
      fontSize: "28px",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      fontSize: "25px",
    },
  },
  signUpLink: {
    color: "var(--link-color)",
  },
  textFieldWrap: {
    margin: 10,
    width: "97%",
  },
  textField: {
    [theme.breakpoints.up("md")]: {
      fontSize: "15px",
    },
    [theme.breakpoints.between("sm", "md")]: {
      fontSize: "12px",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      fontSize: "10px",
    },
  },
  profileFormWrap: {
    display: "flex",
    flexDirection: "column",
  },
  ProfileBtnsWrap: {
    justifyContent: "center",
    gap: 8,
    marginTop: 15,
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
    },
    [theme.breakpoints.between("sm", "md")]: {
      flexDirection: "column",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      flexDirection: "column",
    },
  },
  profileBtns: {
    [theme.breakpoints.up("md")]: {
      fontSize: "15px",
    },
    [theme.breakpoints.between("sm", "md")]: {
      fontSize: "12px",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      fontSize: "10px",
    },
  },
}));
