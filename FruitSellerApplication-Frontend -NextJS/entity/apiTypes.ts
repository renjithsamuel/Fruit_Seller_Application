export type User = {
  userID?: string;
  name?: string;
  email?: string;
  role?: "BUYER" | "SELLER";
  dateOfBirth?: Date;
  phoneNumber?: number;
  preferredLanguage?: string;
  address?: string;
  country?: string;
  cartID?: string;
  password?: string;
};

export type Product = {
  productID?: string;
  productName?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  cartQuantity?: number;
  category?: string;
  sellerID?: string;
  imageUrl?: string;
};

export type CartItem = {
  productID?: string;
  quantity?: number;
};

export type UpdateCartObject = {
  productID?: string;
  cartID?: string;
  quantity?: number;
};

  export const AddProductParams = [
    {
      keyForDB: "productName",
      inputLabel: "productName : ",
      inputPlaceHolder: " product name  ",
      inputType: "text",
    },
    {
      keyForDB: "description",
      inputLabel: "description : ",
      inputPlaceHolder: " description  ",
      inputType: "text",
    },
    {
      keyForDB: "price",
      inputLabel: "price : ",
      inputPlaceHolder: " price  ",
      inputType: "Number",
    },
    {
      keyForDB: "stockQuantity",
      inputLabel: "stockQuantity : ",
      inputPlaceHolder: " stock quantity  ",
      inputType: "Number",
    },
    {
      keyForDB: "category",
      inputLabel: "category : ",
      inputPlaceHolder: " category  ",
      inputType: "text",
    },
    {
      keyForDB: "imageUrl",
      inputLabel: "imageUrl : ",
      inputPlaceHolder: " imageUrl  ",
      inputType: "text",
    },
  ];

export const RegisterParams = [
  {
    keyForDB: "name",
    inputLabel: "username : ",
    inputPlaceHolder: " Username  ",
    inputType: "text",
  },
  {
    keyForDB: "email",
    inputLabel: "email : ",
    inputPlaceHolder: " Email  ",
    inputType: "email",
  },
  {
    keyForDB: "role",
    inputLabel: "role : ",
    inputPlaceHolder: " Role  ",
    inputType: "text",
  },
  {
    keyForDB: "dateOfBirth",
    inputLabel: "date of birth : ",
    inputPlaceHolder: " Date of Birth  ",
    inputType: "Date",
  },
  {
    keyForDB: "phoneNumber",
    inputLabel: "Phone : ",
    inputPlaceHolder: " Phone Number  ",
    inputType: "text",
  },
  {
    keyForDB: "preferredLanguage",
    inputLabel: "Preferred language : ",
    inputPlaceHolder: " Preferred Language  ",
    inputType: "text",
  },
  {
    keyForDB: "address",
    inputLabel: "Address : ",
    inputPlaceHolder: " Address ",
    inputType: "textarea",
  },
  {
    keyForDB: "country",
    inputLabel: "Country : ",
    inputPlaceHolder: " Country  ",
    inputType: "text",
  },
  {
    keyForDB: "password",
    inputLabel: "Password : ",
    inputPlaceHolder: " Password  ",
    inputType: "password",
  },
];

export const categories = [
  { category: "Citrus", imageUrl: "category1" },
  { category: "Tropical", imageUrl: "category2" },
  { category: "Berries", imageUrl: "category3" },
  { category: "Melons", imageUrl: "category4" },
  { category: "Stone Fruits", imageUrl: "category5" },
  { category: "Exotic", imageUrl: "category6" },
  { category: "Climacteric", imageUrl: "category7" },
  { category: "Hybrids", imageUrl: "category8" },
  { category: "Drupes", imageUrl: "category9" },
];

export const ProfileParams = [
  {
    keyForDB: "name",
    inputLabel: "username : ",
    inputPlaceHolder: " Username  ",
    inputType: "text",
  },
  {
    keyForDB: "email",
    inputLabel: "email : ",
    inputPlaceHolder: " Email  ",
    inputType: "email",
  },
  {
    keyForDB: "role",
    inputLabel: "role : ",
    inputPlaceHolder: " Role  ",
    inputType: "text",
  },
  {
    keyForDB: "dateOfBirth",
    inputLabel: "date of birth : ",
    inputPlaceHolder: " Date of Birth  ",
    inputType: "Date",
  },
  {
    keyForDB: "phoneNumber",
    inputLabel: "Phone : ",
    inputPlaceHolder: " Phone number  ",
    inputType: "text",
  },
  {
    keyForDB: "preferredLanguage",
    inputLabel: "Preferred language : ",
    inputPlaceHolder: " Preferred Language  ",
    inputType: "text",
  },
  {
    keyForDB: "address",
    inputLabel: "Address : ",
    inputPlaceHolder: " Address ",
    inputType: "textarea",
  },
  {
    keyForDB: "country",
    inputLabel: "Country : ",
    inputPlaceHolder: " Country  ",
    inputType: "text",
  },
];
