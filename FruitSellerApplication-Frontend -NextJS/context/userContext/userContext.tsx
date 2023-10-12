import React, { createContext, useState, useEffect } from "react";
import { User } from "../../entity/user";
import { lookForUser } from "@/api/user/lookForUser";
import { useQuery } from "react-query";

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  isUserError: boolean;
  isUserLoading: boolean;
}

export const UserContext = createContext<UserContextProps | undefined>(
  undefined
);

export const UserContextProvider: React.FC = ({ children }) => {
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const {
    data,
    isError: isUserError,
    isLoading: isUserLoading,
  } = useQuery({
    queryKey: "getUser",
    queryFn: lookForUser,
  });

  useEffect(() => {
    data !== undefined && setUser(data);
    localStorage.setItem("currentUser", JSON.stringify(data));
  }, [data]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        searchText,
        setSearchText,
        isUserError: isUserError,
        isUserLoading: isUserLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
