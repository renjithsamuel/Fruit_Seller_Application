import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { Poppins } from "next/font/google";
import React from "react";
import { UserContextProvider } from "../context/userContext/userContext";
import { ProductContextProvider } from "../context/productContext/productContext";
import { CartContextProvider } from "../context/cartContext/cartContext";
import CustomTheme from "@/styles/theme";
import { ThemeProvider } from "@mui/styles";

const queryClient = new QueryClient();

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <main className={poppins.className}>
        <UserContextProvider>
          <ProductContextProvider>
            <CartContextProvider>
            <ThemeProvider theme={CustomTheme}>
              <Component {...pageProps} />
              </ThemeProvider>
            </CartContextProvider>
          </ProductContextProvider>
        </UserContextProvider>
      </main>
    </QueryClientProvider>
  );
}
