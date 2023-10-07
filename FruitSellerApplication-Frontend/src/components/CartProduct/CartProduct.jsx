import "./CartProduct.css"
import deleteLight from "../../assets/images/delete-light.svg"
import minusLight from "../../assets/images/minus-light.svg"
import addLight from "../../assets/images/add-light.svg"
import { AddToCart, RemoveFromCart, updateCartItem } from "../../utils/ApiHandlers"

function CartProduct({product,cartID,setCartItems,setTotalCost}) {

    const handleRemoveFromCart = async (productID) => {
            if(productID!=null) {
                let success = await RemoveFromCart(productID,cartID)
                if(success) {
                    setCartItems((cartItems)=>{
                        return cartItems.map((cartItem)=>{
                            if(cartItem && product && cartItem.productID != product.productID){
                                return cartItem
                            }
                        })
                    })
                }
            }
    }

    const handleUpdateCartItem = async (productID,process) =>{ 
        let updateObject = {productID : productID,cartID: cartID}
        if(process=="add"){
            updateObject.quantity = product.quantity + 1
        }else if (product.quantity > 0){
            updateObject.quantity = product.quantity - 1
        }

        if(updateObject.quantity <= 0) {
            alert("Invalid quantity")
            return
        }

        let success = await updateCartItem(updateObject)
        if(success) {
            setCartItems((cartItems)=>{
                return cartItems.map((cartItem)=>{
                    if(cartItem && product && cartItem.productID == product.productID){
                        cartItem.quantity = updateObject.quantity
                        return cartItem
                    }
                    else {
                        return cartItem
                    }
                })
            })
        }else {
            alert("Product Invalid Or Out of Stock")
        }

    }

    return (
        <>  
            <div className="CartProductWrapper">
                <div className="CartProductImage">
                    <img src={product.imageUrl} alt="img" />
                </div>
                <div className="CartProductDetails1">
                        <div className="CartProductName">
                            {product.productName}
                        </div>
                        <div className="CartProductDesc">
                            {product.description}
                        </div>
                </div>
                <div className="CartProductDetails2">
                        <div className="CartProductQuantity">
                                <div className="CartProductQuantityName">
                                    Quantity 
                                 </div>
                                <div className="CartProductQuantityDisplay">
                                    {product.quantity}
                                </div>
                        </div>
                        <div className="CartProductTotalPrice">
                                 <div className="CartProductTotalPriceName">
                                    Price 
                                 </div>
                                <div className="CartProductTotalPriceDisplay">
                                  ${product.quantity * product.price}
                                </div>
                        </div>
                </div>
                <div className="CartProductDetails3">
                    <div className="CartProductIncrease" onClick={()=>{handleUpdateCartItem(product.productID,"add")}}>
                        <img src={addLight} alt="add" height={30} width={30} />
                        </div>
                    <div className="CartProductDecrease" onClick={()=>{handleUpdateCartItem(product.productID,"subtract")}}>
                        <img src={minusLight} alt="subtract" height={25} width={25} />
                        
                    </div>
                </div>
                <div className="CartProductLine"></div>
                <div className="RemoveFromCartBtn" onClick={()=>{handleRemoveFromCart(product.productID)}}>
                    <img src={deleteLight} alt="del" width={40} height={40} />
                </div>
            </div>
        </>
    )
}

export default CartProduct