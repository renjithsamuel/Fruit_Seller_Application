import './App.css'
import { Routes,Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import { createContext, useEffect, useState } from 'react';
import { getProducts, lookForUser } from './utils/ApiHandlers';
import UserPage from './pages/UserPage/UserPage';
import CartPage from './pages/CartPage/CartPage';
import SellerProductPage from './pages/SellerProductPage/SellerProductPage';

export const UserContext = createContext(null);

function App() {
  const [allProducts,setAllProducts] = useState([])
  const [currentUser,setCurrentUser] = useState({})

  useEffect(()=>{
    const tempUser = lookForUser()
    if(tempUser) {
      setCurrentUser(tempUser)
    }
    let tempProducts
    async function GetProductsAsync(){
        tempProducts = await getProducts() 
        setAllProducts(tempProducts)
    }
    GetProductsAsync()
  },[])

  return (
    <div>
     <UserContext.Provider value={{setCurrentUser,currentUser,allProducts,setAllProducts}}>
        <Routes >
          <Route path="/" element={<HomePage allProducts={allProducts}/>}/>
          <Route path="/profile" element={<UserPage/>}/>
          <Route path="/cart" element={<CartPage/>}/>
          <Route path="/product" element={<SellerProductPage allProducts={allProducts}/>}/>
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App

// const {navOpen} = useContext(UserContext);