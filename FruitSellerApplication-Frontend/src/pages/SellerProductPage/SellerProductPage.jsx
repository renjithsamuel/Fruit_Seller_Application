import { useContext, useEffect, useState } from "react"
import SellerProduct from "../../components/SellerProduct/SellerProduct"
import TopNav from "../../components/TopNav/TopNav"
import UpdateProduct from "../../components/UpdateProduct/UpdateProduct"
import "./SellerProductPage.css"
import { UserContext } from "../../App"
import addLight from "../../assets/images/add-light.svg"
import AddProduct from "../../components/AddProduct/AddProduct"

function SellerProductPage({allProducts}) {
    const {currentUser} = useContext(UserContext)
    const [updateProduct, setUpdateProduct] = useState({isOpen:false})
    const [addProduct, setAddProduct] = useState({isOpen:false})
    const [sellersProduct,setSellersProduct] = useState([])

    useEffect(()=>{
        if(allProducts.length > 0){
            let tempSellerProduct = allProducts.map((product)=>{
                if(product.sellerID == localStorage.getItem("userID")){
                    return product
                }
            })
            tempSellerProduct = tempSellerProduct.filter((prod) => prod!=undefined)
            console.log(tempSellerProduct);
            setSellersProduct(tempSellerProduct)
        }
    },[])

    useEffect(()=>{
        console.log(addProduct);
    },[addProduct])


    return (<>
        {(!updateProduct.isOpen)?'':<UpdateProduct updateProduct={updateProduct} setUpdateProduct={setUpdateProduct}/>}
        {(!addProduct.isOpen)?'':<AddProduct addProduct={addProduct} setAddProduct={setAddProduct}/>}
        <div className="SellerProductPageWrapper">
            <TopNav/>
            <div className="SellerProductPageTop">
                    <div className="yourProducts">
                        Your Products
                    </div>
                    <div className="addProduct">
                        <div className="addProductName" onClick={()=>setAddProduct({...addProduct,isOpen:true})}>
                            Add Product
                        </div>
                        <div className="addProductImg">
                            <img src={addLight} alt="add" width={30} height={30} />
                        </div>
                    </div>
                    <div className="revenueDisplay">
                        $57,000
                    </div>
            </div>
            <div className="FinalSellerProductsWrapper">
                {   
                    (sellersProduct.length <= 0) ? 
                    (
                        <span style={{fontSize:"xx-large",fontWeight:600,marginLeft:"40%",marginTop:"10%"}}> Nothing Here</span>
                    ) 
                    :
                    sellersProduct.map((product,index)=>{
                        return <SellerProduct key={index} product={product} setUpdateProduct={setUpdateProduct}/>
                    })
                }
            </div>
        </div>
    </>)
}

export default SellerProductPage