import "./HomePage.css";
import TopNav from "../../components/TopNav/TopNav";
import Category from "../../components/Category/Category";
import Product from "../../components/product/Product";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";

function HomePage({ allProducts }) {
  const { currentUser } = useContext(UserContext);

  const pageName = "home";

  const categories = [
    { category: "Citrus", imageUrl: "../src/assets/images/category1" },
    { category: "Tropical", imageUrl: "../src/assets/images/category2" },
    { category: "Berries", imageUrl: "../src/assets/images/category3" },
    { category: "Melons", imageUrl: "../src/assets/images/category4" },
    { category: "Stone Fruits", imageUrl: "../src/assets/images/category5" },
    { category: "Exotic", imageUrl: "../src/assets/images/category6" },
    { category: "Climacteric", imageUrl: "../src/assets/images/category7" },
    { category: "Hybrids", imageUrl: "../src/assets/images/category8" },
    { category: "Drupes", imageUrl: "../src/assets/images/category9" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    allProducts ? setProducts(allProducts) : setProducts(productsArr);
  }, [allProducts]);

  useEffect(() => {
    setProducts(
      allProducts.filter((product) => {
        if (
          product.productName.includes(searchText) &&
          product.category.includes(selectedCategory)
        ) {
          return product;
        }
      })
    );
  }, [searchText, selectedCategory]);

  return (
    <div className="HomePageWrapper">
      <TopNav page={pageName} setSearchText={setSearchText} />
      <div className="categoriesWrapper">
        <div className="CategoriesName">Categories</div>
        <div className="finalCategoriesWrapper">
          {categories.length == 0 ? (
            <span
              style={{
                fontSize: "xx-large",
                fontWeight: 600,
                marginLeft: "40%",
              }}
            >
              {" "}
              Nothing Here
            </span>
          ) : (
            categories.map((category, index) => {
              return (
                <Category
                  key={index}
                  category={category}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              );
            })
          )}
        </div>
      </div>
      <div className="productsWrapper">
        <div className="productsName">Products</div>
        <div className="finalProductWrapper">
          {products.length == 0 ? (
            <span
              style={{
                fontSize: "xx-large",
                fontWeight: 600,
                marginLeft: "40%",
              }}
            >
              {" "}
              Nothing Here
            </span>
          ) : (
            products.map((product, index) => {
              return (
                <Product
                  key={index}
                  product={product}
                  cartID={currentUser.cartID}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;

const productsArr = [
  {
    productName: "banana",
    stockQuantity: 8,
    price: 30,
    description: "A sweet and nutritious tropical fruit.",
    imageUrl:
      "https://m.media-amazon.com/images/I/51ebZJ+DR4L._AC_UF1000,1000_QL80_.jpg",
  },
  {
    productName: "orange",
    stockQuantity: 12,
    price: 40,
    description: "A citrus fruit packed with vitamin C.",
    imageUrl:
      "https://img.freepik.com/premium-photo/orange-crop-isolated_90839-212.jpg?w=2000",
  },
  {
    productName: "strawberries",
    stockQuantity: 6,
    price: 60,
    description: "Juicy red berries perfect for desserts and snacks.",
    imageUrl:
      "https://s30386.pcdn.co/wp-content/uploads/2019/08/Strawberries_HNL1306_ts104880701.jpg",
  },
  {
    productName: "watermelon",
    stockQuantity: 3,
    price: 25,
    description: "Refreshing and hydrating summer fruit.",
    imageUrl:
      "https://hips.hearstapps.com/hmg-prod/images/fresh-ripe-watermelon-slices-on-wooden-table-royalty-free-image-1684966820.jpg?crop=0.6673xw:1xh;center,top&resize=1200:*",
  },
  {
    productName: "grapes",
    stockQuantity: 9,
    price: 35,
    description: "Small, juicy, and great for snacking.",
    imageUrl:
      "https://www.indianonshop.com/wp-content/uploads/2022/06/Graps.jpg",
  },
  {
    productName: "kiwi",
    stockQuantity: 7,
    price: 45,
    description: "A fuzzy, green fruit with a tangy-sweet flavor.",
    imageUrl:
      "https://cdn.britannica.com/45/126445-050-4C0FA9F6/Kiwi-fruit.jpg",
  },
  {
    productName: "mango",
    stockQuantity: 5,
    price: 55,
    description: "Exotic tropical fruit known for its sweet taste.",
    imageUrl:
      "https://m.media-amazon.com/images/I/41EvGpCFECL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    productName: "pear",
    stockQuantity: 10,
    price: 35,
    description: "A crisp and juicy fruit with a mild, sweet flavor.",
    imageUrl:
      "https://cdn.grofers.com/app/images/products/sliding_image/62078a.jpg?ts=1690813821",
  },
  {
    productName: "pineapple",
    stockQuantity: 2,
    price: 70,
    description: "A tropical delight with a sweet and tangy taste.",
    imageUrl:
      "https://3.imimg.com/data3/OQ/OI/MY-3986048/fresh-pineapple-500x500.jpg",
  },
  {
    productName: "blueberries",
    stockQuantity: 8,
    price: 70,
    description: "Small, antioxidant-rich berries bursting with flavor.",
    imageUrl:
      "https://www.bigbasket.com/media/uploads/p/l/30009286_7-fresho-blueberry.jpg",
  },
];
