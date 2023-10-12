import { sendHttpRequest } from "../sendRequestHandler";

export const AddToCart = async (productID: string): Promise<boolean> => {
    const cartID = localStorage.getItem("cartID");
  
    if (!cartID) {
      console.error("[AddToCart]: CartID is missing");
      return false;
    }
  
    const addToCartApi = `http://localhost:5003/carts`;
    const addCartObj = { productID: productID, cartID: cartID, quantity: 1 };
    const resp = await sendHttpRequest(
      addToCartApi,
      "POST",
      localStorage.getItem("token"),
      addCartObj
    );
    if (resp == null || resp.message == null) {
      console.error("[AddToCart]: Something went wrong", resp);
      return false;
    }
    return true;
  };