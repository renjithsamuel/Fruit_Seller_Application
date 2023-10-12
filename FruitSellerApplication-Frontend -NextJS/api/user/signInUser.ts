import { UserInitialValues } from "@/entity/user";
import { sendHttpRequest } from "../sendRequestHandler";

export const SignInUser = async (
  elements: UserInitialValues
): Promise<boolean> => {
  const postUserApi = `http://localhost:5001/users`;
  const resp = await sendHttpRequest(postUserApi, "POST", null, elements);
  console.log(resp);
  if (!resp.success) {
    console.error("[signInUser]: failed");
    Promise.reject();
  }
  return Promise.resolve(true);
};
