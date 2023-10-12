import { Product } from "@/entity/product";

export const useSellerItem = (
  product: Product,
  setProductData: (updatedProductData: Product) => void,
  setOpenDialog: (isOpen: boolean) => void,
  setUpdateProduct: (updateProduct: boolean) => void
) => {
  const handleUpdateProduct = () => {
    setProductData({ ...product });
    setOpenDialog(true);
    setUpdateProduct(true);
  };
  return {
    handleUpdateProduct,
  };
};
