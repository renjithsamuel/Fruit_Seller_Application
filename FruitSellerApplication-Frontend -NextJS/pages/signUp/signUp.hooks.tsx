// signUp.hooks.tsx

import { useMutation, useQueryClient } from "react-query";
import { createUserDetailsValidation } from "@/validations/userDetails";
import { SignInUser } from "../../api/user/signInUser";
import { UserInitialValues } from "@/entity/user";
import { useRouter } from "next/router";

export function useSignup() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const initialValues: UserInitialValues = {
    name: "",
    email: "",
    password: "",
    role: "buyer",
    dateOfBirth: undefined,
    phoneNumber: 0,
    preferredLanguage: "",
    address: "",
    country: "",
  };

  const validationSchema = createUserDetailsValidation();

  const mutation = useMutation(
    (values: UserInitialValues) => SignInUser(values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("getUser");
        router.push("/login");
      },
    }
  );

  const handleSubmit = async (values: UserInitialValues) => {
    console.log(values);
    try {
      const userData = await mutation.mutateAsync(values);
      console.log(userData);
    } catch (error) {
      console.error("signUp failed:", error);
    }
  };

  return {
    initialValues,
    validationSchema,
    handleSubmit,
  };
}
