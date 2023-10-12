import { UserLogin,User } from "@/entity/user";
import { sendHttpRequest } from "../sendRequestHandler";

export const LoginUser = async (elements: UserLogin): Promise<User> => {
  console.log(elements);
  let resp: any = {};
  const loginUserApi = `http://localhost:5001/login`;
  resp = await sendHttpRequest(loginUserApi, "POST", null, elements);
  console.log(resp);
  if (!resp.success) {
    console.error("[signInUser]: failed");
    return Promise.reject();
  }
  const getUserAPI = `http://localhost:5001/users/${resp.userID}`;
  let UserData = await sendHttpRequest(getUserAPI, "GET", resp.token, null);
  if (!UserData.user) {
    console.error("[signInUser]: failed");
    return Promise.reject();
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
};
