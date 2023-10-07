import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { CssBaseline, ThemeProvider, createTheme  } from "@mui/material";
import { Poppins } from "next/font/google";
import { User, Product } from "../entity/apiTypes";
import React, { createContext, useState } from "react";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export const UserContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  products: Product[] | null;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}>({
  user: null,
  setUser: () => {},
  searchText: "",
  setSearchText: () => {},
  products: [],
  setProducts: () => {},
});

export default function App({ Component, pageProps }: AppProps) {
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ThemeProvider theme={theme}> */}
        {/* <CssBaseline /> */}
        <main className={poppins.className}>
          <UserContext.Provider
            value={{
              setUser,
              user,
              searchText,
              setSearchText,
              products,
              setProducts,
            }}
          >
            <Component {...pageProps} />
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          </UserContext.Provider>
        </main>
      {/* </ThemeProvider> */}
    </QueryClientProvider>
  );
}


// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#ffffff",
//     },
//     secondary: {
//       main: "#92d6fd",
//     },
//     background: {
//       default: "#f9f9fb",
//     },
//     text: {
//       primary: "#000",
//     },
//     error: {
//       main: "#FF0000",
//     },
//   },
//   typography: {
//     fontFamily: "Poppins, sans-serif",
//   },
//   shape: {
//     borderRadius: 12, 
//   },
// });