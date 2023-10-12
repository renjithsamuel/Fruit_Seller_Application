import { useMutation, useQueryClient } from "react-query";
import { UpdateCartObject } from "../../entity/cart";
import { Product } from "../../entity/product";
import { RemoveFromCart } from "../../api/cart/removeFromCart";
import { updateCartItem } from "../../api/cart/updateCartItem";

export const useCartItem = (
  product: Product,
  setCartProducts: React.Dispatch<React.SetStateAction<Product[] | null>>
) => {
  const queryClient = useQueryClient();

  const updateCartItemMutation = useMutation(updateCartItem, {
    onSuccess: () => {
      queryClient.invalidateQueries("cartItems");
    },
  });

  const removeFromCartMutation = useMutation(RemoveFromCart, {
    onSuccess: () => {
      queryClient.invalidateQueries("cartItems");
    },
  });

  const handleRemove = async (productID: string) => {
    if (productID != null) {
      const success = await removeFromCartMutation.mutateAsync(productID);
      if (success) {
        setCartProducts((cartProducts) => {
          return (cartProducts || []).filter(
            (cartItem) => cartItem.productID !== product.productID
          );
        });
      }
    }
  };

  const handleUpdateCartItem = async (productID: string, process: string) => {
    let updateObject: UpdateCartObject = { productID, cartID: "", quantity: 0 };
    if (process === "increase") {
      updateObject.quantity =
        product?.cartQuantity != null ? product?.cartQuantity + 1 : 1;
    } else if (product?.cartQuantity != null && product?.cartQuantity > 0) {
      updateObject.quantity =
        product?.cartQuantity != null ? product?.cartQuantity - 1 : 1;
    }

    if (updateObject?.quantity && updateObject?.quantity <= 0) {
      alert("Invalid quantity");
      return;
    }

    const success = await updateCartItemMutation.mutateAsync(updateObject);
    if (success) {
      setCartProducts((cartProducts) => {
        return (cartProducts || []).map((cartItem) => {
          if (cartItem.productID === product.productID) {
            return { ...cartItem, cartQuantity: updateObject.quantity };
          } else {
            return cartItem;
          }
        });
      });
    } else {
      alert("Product Invalid Or Out of Stock");
    }
  };

  return { handleRemove, handleUpdateCartItem };
};
