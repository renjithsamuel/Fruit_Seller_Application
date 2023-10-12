import React, { createContext, useState, useEffect } from "react";
import { Product } from "../../entity/product";
import { getProducts } from "@/api/product/getProducts";
import { useQuery } from "react-query";

interface ProductContextProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  isProductsError: boolean;
  isProductsLoading: boolean;
}

export const ProductContext = createContext<ProductContextProps | undefined>(
  undefined
);

export const ProductContextProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const {
    data,
    isError: isProductsError,
    isLoading: isProductsLoading,
  } = useQuery({
    queryKey: "products",
    queryFn: getProducts,
  });

  useEffect(() => {
    data && setProducts(data);
  }, [data]);

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        isProductsError,
        isProductsLoading,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
