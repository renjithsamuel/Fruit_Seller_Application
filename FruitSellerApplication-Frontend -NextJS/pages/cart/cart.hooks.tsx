import { useEffect, useState } from "react";
import { Product } from "../../entity/product";
import useCartContext from "@/context/cartContext/cartContext.hooks";
import { useProductContext } from "@/context/productContext/productContext.hooks";
import useUserContext from "@/context/userContext/userContext.hooks";

export function useCart() {
  const [cartID, setCartID] = useState<string | null>("");
  const [totalCost, setTotalCost] = useState<number>(0);
  const [cartProducts, setCartProducts] = useState<Product[] | null>([]);
  const { cartItems, isCartError, isCartLoading } = useCartContext();
  const { products, isProductsError, isProductsLoading } = useProductContext();
  const { searchText } = useUserContext();

  useEffect(() => {
    setCartID(localStorage.getItem("cartID"));
  }, []);

  useEffect(() => {
    if (
      cartItems &&
      cartItems?.length > 0 &&
      products &&
      products?.length > 0
    ) {
      let tempCartProducts: Product[] = [];
      cartItems.forEach((cartItem) => {
        products.forEach((product) => {
          if (
            product &&
            cartItem &&
            product.productID === cartItem.productID &&
            product?.productName?.toLowerCase().includes(searchText)
          ) {
            if (tempCartProducts.indexOf(product) === -1) {
              product.cartQuantity = cartItem.quantity;
              tempCartProducts.push(product);
            }
          }
        });
      });
      setCartProducts(tempCartProducts);
    }
  }, [products, searchText, cartItems]);

  useEffect(() => {
    setTotalCost(0);
    cartProducts?.forEach((product) => {
      setTotalCost((prevCost) => {
        if (product?.cartQuantity != null && product?.price != null) {
          prevCost += product?.cartQuantity * product?.price;
        }
        return prevCost;
      });
    });
  }, [cartProducts]);

  return {
    cartID,
    totalCost,
    cartProducts,
    isCartError,
    isProductsError,
    isCartLoading,
    isProductsLoading,
    setCartProducts,
  };
}
