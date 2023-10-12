export type Product = {
  productID: string;
  productName: string;
  description: string;
  price: number;
  stockQuantity: number;
  cartQuantity?: number;
  category: string;
  sellerID: string;
  imageUrl: string;
};

export type ProductInitialValues = {
  productID?: string;
  productName: string;
  description: string;
  price?: number;
  stockQuantity?: number;
  category: string;
  sellerID?: string;
  imageUrl: string;
};
