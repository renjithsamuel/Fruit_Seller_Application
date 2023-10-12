import { User, UserInitialValues } from "@/entity/user";
import { sendHttpRequest } from "../sendRequestHandler";

export const UpdateUser = async (elements: UserInitialValues): Promise<boolean> => {
  let password = prompt("Enter your password") ?? "";
  if (password === "") {
    alert("Please enter a valid password!");
    console.error("Please enter a valid password!");
    return Promise.reject();
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
    return Promise.reject();
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

  return Promise.resolve(true);
};
