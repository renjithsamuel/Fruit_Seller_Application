import { useEffect, useState } from "react";
import { Product } from "../entity/product";
import { useProductContext } from "@/context/productContext/productContext.hooks";
import useUserContext from "@/context/userContext/userContext.hooks";

export function useHome() {
  const { products, isProductsError, isProductsLoading } = useProductContext();
  const { searchText, user } = useUserContext();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);

  useEffect(() => {
    products &&
      setCurrentProducts(
        products.filter((product) => {
          if (
            product?.productName &&
            product?.category &&
            product?.productName.toLowerCase().includes(searchText) &&
            product?.category
              .toLowerCase()
              .includes(selectedCategory.toLowerCase())
          ) {
            return product;
          }
        })
      );
  }, [searchText, selectedCategory, products]);

  return {
    selectedCategory,
    setSelectedCategory,
    currentProducts,
    isProductsError,
    isProductsLoading,
    user,
  };
}
