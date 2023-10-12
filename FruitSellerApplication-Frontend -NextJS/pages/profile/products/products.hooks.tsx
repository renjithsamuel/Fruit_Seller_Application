import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Product, ProductInitialValues } from '@/entity/product';
import { UpdateProducts } from '../../../api/product/updateProducts';
import { DeleteProduct } from '../../../api/product/deleteProduct';
import { AddProducts } from '../../../api/product/addProducts';
import { useUserContext } from '@/context/userContext/userContext.hooks';
import { useProductContext } from '@/context/productContext/productContext.hooks';
import { createAddProductsValidation } from '@/validations/addProducts';
import { categoryArray } from '@/constants/categoryArray';

export function useSellerProducts() {
  const queryClient = useQueryClient();
  const { products, isProductsError, isProductsLoading } = useProductContext();
  const { searchText } = useUserContext();

  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [updateProduct, setUpdateProduct] = useState(false);
  const [userID, setUserID] = useState<string | null>('');
  const [productData, setProductData] = useState<ProductInitialValues>({
    productName: '',
    description: '',
    price: undefined,
    stockQuantity: undefined,
    category: '',
    imageUrl: '',
    sellerID: localStorage.getItem('userID') ?? '',
  });

  const updateProductMutation = useMutation(UpdateProducts, {
    onSuccess: () => queryClient.invalidateQueries('products'),
  });

  const addProductMutation = useMutation(AddProducts, {
    onSuccess: () => queryClient.invalidateQueries('products'),
  });

  useEffect(() => {
    const userID = localStorage.getItem('userID');
    if (products != null && products.length > 0) {
      const tempSellerProduct: Product[] = products
        .filter((product) => {
          if (
            product?.productName &&
            userID &&
            product?.sellerID &&
            product?.sellerID === userID &&
            product?.productName.toLowerCase().includes(searchText)
          ) {
            return true;
          }
          return false;
        })
        .filter(Boolean);
      setSellerProducts(tempSellerProduct);
    }
    setUserID(userID);
  }, [products, searchText]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setProductData({
      productName: '',
      description: '',
      price: undefined,
      stockQuantity: undefined,
      category: '',
      imageUrl: '',
    });
    setOpenDialog(false);
    setUpdateProduct(false);
  };

  const handleDeleteProduct = async (productID: string | undefined) => {
    if (!productID) {
      return;
    }
    const success = await DeleteProduct(productID);
    success &&
      setSellerProducts((products) =>
        products.filter((elem) => elem.productID !== productID)
      );
    handleCloseDialog();
  };

  const handleAddorUpdateProduct = async (values: ProductInitialValues) => {
    if (updateProduct) {
      updateProductMutation.mutate(values);
    } else {
      addProductMutation.mutate(values);
    }
    handleCloseDialog();
  };

  const validationSchema = createAddProductsValidation();

  return {
    sellerProducts,
    openDialog,
    updateProduct,
    userID,
    productData,
    updateProductMutation,
    addProductMutation,
    handleOpenDialog,
    handleCloseDialog,
    handleDeleteProduct,
    handleAddorUpdateProduct,
    validationSchema,
    isProductsError,
    isProductsLoading,
    setProductData,
    setOpenDialog,
    setUpdateProduct
  };
}
