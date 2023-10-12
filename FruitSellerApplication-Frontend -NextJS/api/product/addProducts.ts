import { ProductInitialValues } from "@/entity/product";
import { sendHttpRequest } from "../sendRequestHandler";

export const AddProducts = async (
  elements: ProductInitialValues
): Promise<boolean> => {
  if (!elements.sellerID) {
    console.error("[AddProduct]: SellerID missing");
    return Promise.reject();
  }
  elements["price"] = Number(elements["price"]);
  elements["stockQuantity"] = Number(elements["stockQuantity"]);

  const PostProductsApi = `http://localhost:5004/products`;
  let resp: any = await sendHttpRequest(
    PostProductsApi,
    "POST",
    localStorage.getItem("token"),
    elements
  );
  console.log(resp);
  if (resp == null) {
    console.error("[AddProduct]: Something went wrong", resp);
    return Promise.reject();
  }
  return Promise.resolve(true);
};
