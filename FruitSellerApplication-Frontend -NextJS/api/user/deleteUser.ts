import { sendHttpRequest } from "../sendRequestHandler";

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
  