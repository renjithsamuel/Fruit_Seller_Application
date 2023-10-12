import { CartItem } from "@/entity/cart";
import { sendHttpRequest } from "../sendRequestHandler";

export const DeleteProduct = async (productID: string): Promise<boolean> => {
    if (!confirm("Are you sure?")) {
      return false;
    }
    const sellerID = localStorage.getItem("userID");
    const RemoveProductApi = `http://localhost:5004/products/${productID}/seller/${sellerID}`;
    const resp = await sendHttpRequest(
      RemoveProductApi,
      "DELETE",
      localStorage.getItem("token"),
      null
    );
    if (resp == null) {
      console.error("[DeleteProduct]: Something went wrong", resp);
      return false;
    }
    return Promise.resolve(true);
  };