import { UserInitialValues } from "@/entity/user";
import { sendHttpRequest } from "../sendRequestHandler";

export const RemoveFromCart = async (productID: string): Promise<boolean> => {
    const cartID = localStorage.getItem("cartID");
    if (!cartID) {
      console.log("[updateCartItem] : CartID missing");
      return Promise.resolve(false);
    }
  
    const RemoveFromCartAPI = `http://localhost:5003/carts/${cartID}/products/${productID}`;
    const resp = await sendHttpRequest(
      RemoveFromCartAPI,
      "DELETE",
      localStorage.getItem("token"),
      null
    );
    if (resp == null || resp.message == null) {
      console.error("[RemoveFromCart]: Something went wrong", resp);
      return false;
    }
    return true;
  };
  