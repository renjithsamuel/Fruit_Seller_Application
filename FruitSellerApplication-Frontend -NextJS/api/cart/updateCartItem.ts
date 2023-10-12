import { UpdateCartObject } from "@/entity/cart";
import { sendHttpRequest } from "../sendRequestHandler";

export const updateCartItem = async (
  updateCartObj: UpdateCartObject
): Promise<boolean> => {
  const cartID = localStorage.getItem("cartID");
  if (!cartID) {
    console.log("[updateCartItem] : CartID missing");
    return Promise.resolve(false);
  }

  updateCartObj.cartID = cartID;
  console.log(updateCartObj);

  const updateCartAPI = `http://localhost:5003/carts`;
  const resp = await sendHttpRequest(
    updateCartAPI,
    "PUT",
    localStorage.getItem("token"),
    updateCartObj
  );
  console.log(resp);
  if (resp == null || resp.message == null) {
    console.error("[updateCartItem]: Something went wrong", resp);
    return false;
  }
  if (resp.message === "Product Invalid or Out Of Stock") {
    return false;
  }
  return true;
};
