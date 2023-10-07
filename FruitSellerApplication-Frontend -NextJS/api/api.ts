import axios from "axios";
import { Product, User, CartItem, UpdateCartObject } from "../entity/apiTypes";

export const sendHttpRequest = async (
  url: string,
  method: string,
  token: string | null,
  data: object | null
): Promise<any> => {
  let returnData: any;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `${token}`;
  }
  try {
    const response = await axios({
      url,
      method,
      data,
      headers,
    });

    returnData = response.data;
  } catch (err) {
    console.error(JSON.stringify(err));
  }
  return returnData;
};

export const lookForUser = (): Promise<User | null> => {
  const tempUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  if (JSON.stringify(tempUser) !== "{}") {
    return tempUser;
  }
  return Promise.resolve(null);
};

export const getProducts = async (): Promise<Product[] | null> => {
  const getProductsApi = `http://localhost:5004/products`;
  const resp = await sendHttpRequest(getProductsApi, "GET", null, null);
  if (resp == null || !Array.isArray(resp.products)) {
    console.error("[Get Products]: Something went wrong", resp);
  }
  return resp?.products || null;
};

export const SignInUser = async (
  isLogin: boolean,
  elements: object
): Promise<object | null> => {
  console.log(elements);
  let resp: any = {};
  if (isLogin) {
    const loginUserApi = `http://localhost:5001/login`;
    resp = await sendHttpRequest(loginUserApi, "POST", null, elements);
    console.log(resp);
    if (!resp.success) {
      console.error("[signInUser]: failed");
      return null;
    }
    const getUserAPI = `http://localhost:5001/users/${resp.userID}`;
    let UserData = await sendHttpRequest(getUserAPI, "GET", resp.token, null);
    if (!UserData.user) {
      console.error("[signInUser]: failed");
      return null;
    }
    console.log(UserData);

    const tempCurrentUser = JSON.stringify(UserData.user);
    if (resp?.token != null) {
      localStorage.setItem("token", resp.token);
    } else {
      console.log("token missing");
    }
    if (resp?.userID != null) {
      localStorage.setItem("userID", resp.userID);
    } else {
      console.log("userID missing");
    }
    if (UserData?.user?.cartID !== null) {
      localStorage.setItem("cartID", UserData.user.cartID);
    } else {
      console.log("cartID missing");
    }
    if (UserData?.user != null) {
      localStorage.setItem("currentUser", tempCurrentUser);
    } else {
      console.log("userdata missing");
    }
    return UserData && UserData.user;
  } 
  const postUserApi = `http://localhost:5001/users`;
  resp = await sendHttpRequest(postUserApi, "POST", null, elements);
  console.log(resp);
  if (!resp.success) {
    console.error("[signInUser]: failed");
    return null;
  }
  return Promise.resolve(null)
};

// The rest of the functions would be converted similarly.
export const UpdateUser = async (elements: User): Promise<object | null> => {
  let password = prompt("Enter your password") ?? "";
  if (password === "") {
    alert("Please enter a valid password!");
    console.error("Please enter a valid password!");
    return null;
  }
  elements["password"] = password;
  let resp: any = {};
  const userID = localStorage.getItem("userID");
  const postUserApi = `http://localhost:5001/users/${userID}`;
  resp = await sendHttpRequest(
    postUserApi,
    "PUT",
    localStorage.getItem("token"),
    elements
  );
  if (resp == null || !resp.success) {
    console.error("[UpdateUser]: failed");
  }

  const getUserAPI = `http://localhost:5001/users/${userID}`;
  let UserData = await sendHttpRequest(
    getUserAPI,
    "GET",
    localStorage.getItem("token"),
    null
  );
  if (UserData == null || !UserData.user) {
    console.error("[UpdateUser]: failed");
  }
  const tempCurrentUser = JSON.stringify(UserData.user);
  if (UserData == null || UserData.user != null) {
    localStorage.setItem("currentUser", tempCurrentUser);
  }
  return UserData?.user || null;
};

export const AddToCart = async (productID: string): Promise<boolean> => {
  const cartID = localStorage.getItem("cartID");

  if (!cartID) {
    console.error("[AddToCart]: CartID is missing");
    return false;
  }

  const addToCartApi = `http://localhost:5003/carts`;
  const addCartObj = { productID: productID, cartID: cartID, quantity: 1 };
  const resp = await sendHttpRequest(
    addToCartApi,
    "POST",
    localStorage.getItem("token"),
    addCartObj
  );
  if (resp == null || resp.message == null) {
    console.error("[AddToCart]: Something went wrong", resp);
    return false;
  }
  return true
};

export const getCartItems = async (): Promise<CartItem[] | null> => {
  let cartID: string | null = localStorage.getItem("cartID");
  if (!cartID) {
    console.error("[AddToCart]: CartID is missing");
    return Promise.resolve(null);
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
    return null;
  }
  return resp.items || null;
};

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

export const AddProducts = async (elements: Product): Promise<object> => {
  elements["sellerID"] = localStorage.getItem("userID") ?? "";
  console.log(elements);
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
  }
  const productID = resp && resp.productID;
  const getProductbyIDApi = `http://localhost:5004/products/${productID}`;
  resp = await sendHttpRequest(getProductbyIDApi, "GET", null, null);
  if (resp == null) {
    console.error("[AddProducts]: Something went wrong", resp);
  }
  return resp;
};

export const UpdateProducts = async (elements: Product): Promise<Product> => {
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
  }
  console.log(resp);

  const getProductbyIDApi = `http://localhost:5004/products/${elements.productID}`;
  resp = await sendHttpRequest(getProductbyIDApi, "GET", null, null);
  if (resp == null) {
    console.error("[AddProducts]: Something went wrong", resp);
  }
  console.log(resp);

  return resp;
};

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
  return true;
};

export const DeleteUser = async (): Promise<boolean> => {
  const userID = localStorage.getItem("userID");
  const deleteUserApi = `http://localhost:5001/users/${userID}`;
  const resp = await sendHttpRequest(
    deleteUserApi,
    "DELETE",
    localStorage.getItem("token"),
    null
  );
  if (resp == null) {
    console.error("[DeleteUser]: Something went wrong", resp);
    return false;
  }
  return true;
};
