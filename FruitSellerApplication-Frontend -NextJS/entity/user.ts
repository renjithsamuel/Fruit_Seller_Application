export type User = {
  userID: string;
  name: string;
  email: string;
  role: "buyer" | "seller";
  dateOfBirth: Date;
  phoneNumber: number;
  preferredLanguage: string;
  address: string;
  country: string;
  cartID: string;
  password?: string;
};

export type UserInitialValues = {
  name: string;
  email: string;
  role: "buyer" | "seller";
  dateOfBirth?: Date;
  phoneNumber?: number;
  preferredLanguage: string;
  address: string;
  country: string;
  password?: string;
};

export type UserLogin = {
  email: string;
  password: string;
};
