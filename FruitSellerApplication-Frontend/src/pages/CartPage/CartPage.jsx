import "./CartPage.css"
import TopNav from '../../components/TopNav/TopNav';
import CartProduct from "../../components/CartProduct/CartProduct";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { getCartItems } from "../../utils/ApiHandlers";


function CartPage({}) {    
    const {currentUser,allProducts} = useContext(UserContext)
    const [cartItems , setCartItems] = useState([])
    const [cartProducts , setCartProducts] = useState([])
    const [totalCost,setTotalCost] = useState(0)

    useEffect(()=>{
        async function cartItems() {
            if(currentUser.cartID != null) {
                let tempCartItems = await getCartItems(currentUser.cartID)
                console.log(tempCartItems);
                if(JSON.stringify(tempCartItems)!="[]"){
                    setCartItems(tempCartItems)
                }else {
                    console.log("[CartItems]:failed");
                }
            }
        }
        cartItems()
    },[])

    useEffect(()=>{
        if(cartItems && cartItems.length > 0 && allProducts && allProducts.length > 0) {
            setTotalCost(0)
            let tempCartProducts = [];
            cartItems.forEach((cartItem)=>{
                allProducts.forEach(product => {
                        if(product && cartItem && product.productID ==cartItem.productID) {
                            if(tempCartProducts.indexOf(product)==-1){
                                product.quantity = cartItem.quantity
                                tempCartProducts.push(product)
                                setTotalCost((prevCost)=>{
                                    let tempTotalCost = prevCost + (product.quantity * product.price)
                                    return tempTotalCost
                                })
                            }
                        }
                });
            })
            setCartProducts(tempCartProducts)
        }
    },[cartItems])

    useEffect(()=>{
        console.log("cartProducts",cartProducts);
    },[cartProducts])


    return (<>
        <div className="CartPageWrapper">
            <TopNav/>
            <div className="CartPageTop">
                <div className="yourCartName">
                    Your Cart
                </div>
                <div className="TotalAmount">
                    ${totalCost}
                </div>
            </div>
            <div className="CartItemsWrapper">
                {   (cartProducts.length == 0)? 
                    (
                        <span style={{fontSize:"xx-large",fontWeight:600,marginLeft:"40%"}}> Nothing Here</span>
                    ) :
                    cartProducts.map((item,index)=>{
                        return <CartProduct key={index} product={item} cartID={currentUser.cartID} setCartItems={setCartItems} setTotalCost={setTotalCost}/>
                    })
                }
            </div>
        </div>
    </>)
}


export default CartPage