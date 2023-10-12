import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Box,
} from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SearchIcon from "@mui/icons-material/Search";
import { useUserContext } from "@/context/userContext/userContext.hooks";
import { makeStyles } from "@mui/styles";
import { Theme } from "@material-ui/core";

type NavBarProps = {
  showSearchBar: Boolean;
};

const NavBar = ({ showSearchBar }: NavBarProps) => {
  const classes = useStyles();
  const router = useRouter();
  const { setSearchText } = useUserContext();

  return (
    <Box>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Link href="/" className="topNavName">
            <Typography variant="h6" className={classes.link}>
              FruitsBasket
            </Typography>
          </Link>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <Link href="/">
              <IconButton
                color={router.pathname === "/" ? "primary" : "inherit"}
                className={classes.topNavIcons}
              >
                <Box className="TopNavWrap">
                  <HomeIcon className="TopNavIcon" />
                </Box>
              </IconButton>
            </Link>
            <Link href="/cart">
              <IconButton
                color={router.pathname === "/cart" ? "primary" : "inherit"}
                className={classes.topNavIcons}
              >
                <Box className="TopNavWrap">
                  <ShoppingCartIcon className="TopNavIcon" />
                </Box>
              </IconButton>
            </Link>
            <Link href="/profile">
              <IconButton
                color={router.pathname === "/profile" ? "primary" : "inherit"}
                className={classes.topNavIcons}
              >
                <Box className="TopNavWrap">
                  <PersonOutlineIcon className="TopNavIcon" />
                </Box>
              </IconButton>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      {showSearchBar && (
        <Box className="navBarCover">
          <Box className={`${classes.searchBarContainer} searchBar`}>
            <InputBase
              className={classes.searchBarInput}
              placeholder="Search"
              inputProps={{ "aria-label": "search" }}
              sx={{ mr: 2, width: "90%" }}
              onChange={(e) => {
                setSearchText(e.target.value.trim().toLowerCase());
              }}
            />
            <SearchIcon className={`${classes.searchIcon} searchBarInp`} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default NavBar;

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    fontFamily: "Poppins",
    backgroundColor: "var(--primary-color)",
    width: "100%",
    boxShadow: "none",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    fontFamily: "Poppins",
    backgroundColor: "var(--background-color)",
  },
  link: {
    fontFamily: "Poppins",
    color: "black",
    fontWeight: "550",
    [theme.breakpoints.up("md")]: {
      fontSize: "30px",
    },
    [theme.breakpoints.between("sm", "md")]: {
      fontSize: "28px",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      fontSize: "22px",
    },
  },
  topNavIcons: {
    color: "inherit",
  },
  searchBarContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "65vw",
    marginLeft: "18%",
    [theme.breakpoints.up("md")]: {
      width: "35vw",
      marginLeft: "32.4%",
    },
    [theme.breakpoints.between("sm", "md")]: {
      width: "50vw",
      marginLeft: "27%",
    },
    [theme.breakpoints.between("xs", "sm")]: {
      width: "65vw",
      marginLeft: "18%",
    },
  },
  searchBarInput: {
    mr: 2,
    width: "90%",
  },
  searchIcon: {
    color: "#555555",
    marginRight: 1,
  },
}));
