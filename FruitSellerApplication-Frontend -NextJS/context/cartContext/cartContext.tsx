import React, { createContext, useState, useEffect } from "react";
import { Product } from "../../entity/product";
import { CartItem } from "../../entity/cart";
import { getCartItems } from "@/api/cart/getCartItems";
import { useQuery, useQueryClient } from "react-query";

interface CartContextProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  isCartError: boolean;
  isCartLoading: boolean;
}

export const CartContext = createContext<CartContextProps | undefined>(
  undefined
);

export const CartContextProvider: React.FC = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const {
    data,
    isError: isCartError,
    isLoading: isCartLoading,
  } = useQuery({
    queryKey: "cartItems",
    queryFn: getCartItems,
  });

  useEffect(() => {
    data && setCartItems(data);
  }, [data]);

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, isCartError, isCartLoading }}
    >
      {children}
    </CartContext.Provider>
  );
};
