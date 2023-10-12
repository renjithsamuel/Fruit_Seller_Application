import { Product } from "@/entity/product";
import { sendHttpRequest } from "../sendRequestHandler";

export const getProducts = async (): Promise<Product[]> => {
    const getProductsApi = `http://localhost:5004/products`;
    const resp = await sendHttpRequest(getProductsApi, "GET", null, null);
    if (resp == null || !Array.isArray(resp.products)) {
      console.error("[Get Products]: Something went wrong", resp);
    }
    return resp?.products;
  };