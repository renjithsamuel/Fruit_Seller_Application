import { useContext } from "react";
import { ProductContext } from "./productContext";

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error(
      "useProductContext must be used within a ProductContextProvider"
    );
  }
  return context;
};
