  import { useMutation, useQueryClient } from "react-query";
  import { AddToCart } from "../../api/cart/addToCart";
  import { useState } from "react";
  import { User } from "@/entity/user";

  export const useProductItem = (user: User | null) => {
    const queryClient = useQueryClient();
    const [showNotification, setShowNotification] = useState(false);

    const addToCartMutation = useMutation(AddToCart, {
      onSuccess: () => {
        queryClient.invalidateQueries("cartItems");
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 4000);
      },
    });

    const HandleAddToCart = async (productID: string | undefined) => {
      if (!user) {
        alert("Login to Add to Cart!");
        return;
      }
      if (productID != null) {
        const addedToCart = await addToCartMutation.mutateAsync(productID);
        if (!addedToCart) {
          alert("Product Invalid Or Out of Stock");
        }
      }
    };
    return {
      HandleAddToCart,
      showNotification,
      setShowNotification
    };
  };
