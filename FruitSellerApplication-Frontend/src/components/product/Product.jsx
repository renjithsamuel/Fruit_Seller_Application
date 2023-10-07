import "./Product.css"
import cartLight from "../../assets/images/cart-light.svg"
import { AddToCart } from "../../utils/ApiHandlers"
import { useContext } from "react"
import { UserContext } from "../../App"

function Product({product,cartID}) {

    const {currentUser} = useContext(UserContext)

    const HandleAddToCart = async (productID) => {
        if(JSON.stringify(currentUser)=="{}"){
            alert("Login to Add to Cart!")
            return
        }
        if(productID!=null) {
            AddToCart(productID,cartID)
        }
    }

    return <div className="productWrapper">
        <div className="productTop">
            <div className="productImageWrap">
                <img src={product.imageUrl} className={"productImg"} alt="product"/>
            </div>
            <div className="ProductName">
                    {product.productName}
            </div>
            <div className="ProductDesc">
                    {product.description}
            </div>
        </div>
        <div className="productMiddleLine">

        </div>
        <div className="productBottom">
            <div className="ProductBottomLeft">
                <div className="productPrice">
                   <div className="productPriceName">
                        price 
                   </div>
                   <div className="productPriceDisplay">
                        {product.price}
                   </div>
                </div>
                <div className="productStockQuantity">
                    <div className="stockQuantityName">
                        stock 
                    </div>
                    <div className="stockQuantityDisplay">
                        {product.stockQuantity}
                    </div>
                </div>
            </div>
            <div className="ProductBottomRight">
                <div className="productBuyBtn" onClick={()=>HandleAddToCart(product.productID)}>
                    <img src={cartLight} alt="cart" width={30} height={30} />
                </div>
            </div>
         </div>
</div>
}

export default Product