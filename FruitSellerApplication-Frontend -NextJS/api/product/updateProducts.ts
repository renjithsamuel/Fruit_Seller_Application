import { ProductInitialValues } from "@/entity/product";
import { sendHttpRequest } from "../sendRequestHandler";

export const UpdateProducts = async (
    elements: ProductInitialValues
  ): Promise<boolean> => {
    const sellerID = localStorage.getItem("userID");
    if (sellerID == null) {
      console.log("[error]userID missing");
      return Promise.reject();
    }
    elements["sellerID"] = sellerID;
  
    console.log(elements);
    const PatchProductsApi = `http://localhost:5004/products`;
    let resp: any = await sendHttpRequest(
      PatchProductsApi,
      "PATCH",
      localStorage.getItem("token"),
      elements
    );
    if (resp == null) {
      console.error("[AddProduct]: Something went wrong", resp);
      return Promise.reject();
    }
    return Promise.resolve(true);
  };