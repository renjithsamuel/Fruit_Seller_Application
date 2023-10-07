import React, { useContext } from "react";
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
import { UserContext } from "../pages/_app";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();
  return (
    <>
      {pathname == "/profile" ||
      pathname == "/login" ||
      pathname == "/signUp" ? (
        <NavBarProfile />
      ) : (
        <NavBarHome />
      )}
    </>
  );
};

export default NavBar;

const NavBarHome = () => {
  const router = useRouter();
  const { setSearchText } = useContext(UserContext);
  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          fontFamily: "Poppins",
          backgroundColor: "var(--primary-color)",
          width: "100%",
          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Poppins",
            backgroundColor: "var(--background-color)",
          }}
        >
          <Link href="/" className="topNavName">
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Poppins",
                color: "black",
                fontWeight: "550",
                fontSize: "30px",
              }}
            >
              FruitsBasket
            </Typography>
          </Link>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <Link href="/">
              <IconButton
                color={router.pathname === "/" ? "primary" : "inherit"}
              >
                <Box className="TopNavWrap">
                  <HomeIcon className="TopNavIcon" />
                </Box>
              </IconButton>
            </Link>
            <Link href="/cart">
              <IconButton
                color={router.pathname === "/cart" ? "primary" : "inherit"}
              >
                <Box className="TopNavWrap">
                  <ShoppingCartIcon className="TopNavIcon" />
                </Box>
              </IconButton>
            </Link>
            <Link href="/profile">
              <IconButton
                color={router.pathname === "/profile" ? "primary" : "inherit"}
              >
                <Box className="TopNavWrap">
                  <PersonOutlineIcon className="TopNavIcon" />
                </Box>
              </IconButton>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      <Box className="navBarCover">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="searchBar"
        >
          <InputBase
            placeholder="Search"
            inputProps={{ "aria-label": "search" }}
            sx={{ mr: 2, width: "90%", }}
            onChange={(e) => {
              setSearchText(e.target.value.trim().toLowerCase());
            }}
          />
          <SearchIcon sx={{ color: "#555555", marginRight: 1 }} />
        </Box>
      </Box>
    </Box>
  );
};

const NavBarProfile = () => {
  const router = useRouter();
  // const { setSearchText } = useContext(UserContext);
  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          fontFamily: "Poppins",
          backgroundColor: "var(--primary-color)",
          width: "100%",
          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Poppins",
            backgroundColor: "var(--background-color)",
          }}
        >
          <Link href="/" className="topNavName">
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Poppins",
                color: "black",
                fontWeight: "550",
                fontSize: "30px",
              }}
            >
              FruitsBasket
            </Typography>
          </Link>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
           
            }}
          >
            <Link href="/">
              <IconButton
                color={router.pathname === "/" ? "primary" : "inherit"}
              >
                <Box className="TopNavWrap">
                  <HomeIcon className="TopNavIcon" />
                </Box>
              </IconButton>
            </Link>
            <Link href="/cart">
              <IconButton
                color={router.pathname === "/cart" ? "primary" : "inherit"}
              >
                <Box className="TopNavWrap">
                  <ShoppingCartIcon className="TopNavIcon" />
                </Box>
              </IconButton>
            </Link>
            <Link href="/profile">
              <IconButton
                color={router.pathname === "/profile" ? "primary" : "inherit"}
              >
                <Box className="TopNavWrap">
                  <PersonOutlineIcon className="TopNavIcon" />
                </Box>
              </IconButton>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      {/* <Box className="navBarCover">
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="searchBar"
        >
          <InputBase
            placeholder="Search"
            inputProps={{ "aria-label": "search" }}
            sx={{ mr: 2, width: "90%" }}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          <SearchIcon sx={{ color: "#555555", marginRight: 1 }} />
        </Box>
      </Box> */}
    </Box>
  );
};
