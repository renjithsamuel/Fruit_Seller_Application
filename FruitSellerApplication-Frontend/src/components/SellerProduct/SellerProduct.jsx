import "./SellerProduct.css"
import editLight from "../../assets/images/edit-light.svg"


function SellerProduct({product,setUpdateProduct}) {

    const HandleEditProduct = (product) => {
        setUpdateProduct({...product,isOpen:true})
    }
    
    return <div className="productWrapper">
        <div className="productTop">
            <div className="productImageWrap">
                <img src={product && product.imageUrl} className={"productImg"} alt="product"/>
            </div>
            <div className="ProductName">
                    {product && product.productName}
            </div>
            <div className="ProductDesc">
                    {product && product.description}
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
                        {product && product.price}
                   </div>
                </div>
                <div className="productStockQuantity">
                    <div className="stockQuantityName">
                        stock 
                    </div>
                    <div className="stockQuantityDisplay">
                        { product && product.stockQuantity}
                    </div>
                </div>
            </div>
            <div className="ProductBottomRight">
                <div className="productBuyBtn" onClick={()=>HandleEditProduct(product)}>
                    <img src={editLight} alt="cart" width={30} height={30} />
                </div>
            </div>
         </div>
</div>
}

export default SellerProduct