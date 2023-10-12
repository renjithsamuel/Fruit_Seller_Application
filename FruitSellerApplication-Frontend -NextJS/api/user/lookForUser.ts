import { User } from "@/entity/user";

export const lookForUser = (): Promise<User> => {
  const tempUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  if (JSON.stringify(tempUser) !== "{}") {
    return tempUser;
  }
  return Promise.reject();
};
