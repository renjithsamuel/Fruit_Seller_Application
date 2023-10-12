import { CartItem } from "@/entity/cart";
import { sendHttpRequest } from "../sendRequestHandler";

export const getCartItems = async (): Promise<CartItem[]> => {
    let cartID: string | null = localStorage.getItem("cartID");
    if (!cartID) {
      console.error("[AddToCart]: CartID is missing");
      return Promise.reject();
    }
    const GetCartApi = `http://localhost:5003/carts/${cartID}`;
    const resp = await sendHttpRequest(
      GetCartApi,
      "GET",
      localStorage.getItem("token"),
      null
    );
  
    if (resp == null || resp.userID == null) {
      console.error("[AddToCart]: Something went wrong", resp);
      return Promise.reject();
    }
    return resp.items || null;
  };