import { useContext, useState } from "react";
import "./AddProduct.css"
import { UserContext } from "../../App"
import { AddProducts } from "../../utils/ApiHandlers"

function AddProduct({addProduct,setAddProduct}) {
    const {allProducts,setAllProducts} = useContext(UserContext)

    const [elements,setElements ] = useState({});
 
    const handleInputChange = (keyForDB,value) => {
        let updatedElems = {...elements}
        updatedElems[keyForDB] = value ;
        setElements(updatedElems);
        console.log(updatedElems);
    }

    const handleSubmit = async ()=>{
        if(elements.productName == null || elements.description == null || elements.price==null || elements.stockQuantity==null || elements.category ==null || elements.imageUrl == null){
            alert('send valid details!');
            console.log("send valid details!");
            return;
        }

        const productData = await AddProducts(elements);
        productData && setAllProducts([...allProducts,productData])
        setAddProduct({...addProduct,isOpen:false})
    }
    
    const AddProductParams = [
                    {keyForDB : "productName",inputLabel : "productName : " , inputPlaceHolder : " productName  " , inputType : "text"},
                    {keyForDB : "description",inputLabel : "description : " , inputPlaceHolder : " description  " , inputType : "text"},
                    {keyForDB : "price",inputLabel : "price : " , inputPlaceHolder : " price  " , inputType : "Number"},
                    {keyForDB : "stockQuantity",inputLabel : "stockQuantity : " , inputPlaceHolder : " stockQuantity  " , inputType : "Number"},
                    {keyForDB : "category",inputLabel : "category : " , inputPlaceHolder : " Enter category  " , inputType : "text"},
                    {keyForDB : "imageUrl",inputLabel : "imageUrl : " , inputPlaceHolder : " Enter imageUrl  " , inputType : "text"},
                ];


    return (
        <>
            <div className="AddProductWrapper">
                    <div className="AddProductBox">
                        <div className="AddProductName">
                              AddProduct
                        </div>
        
                        <div className="FinalAddProductWrapper">
                
                                    {
                                        AddProductParams.map((elem,index)=>{
                                
                                            return (
                                                    <div className="AddProductInputWrapper" key={index}>
                                                        <div className="AddProductInputLeft">
                                                            {elem.inputLabel}
                                                        </div>
                                                        <div className="AddProductInputRight">
                                                            <input type={elem.inputType}  tabIndex={0}  placeholder={elem.inputPlaceHolder}  id={elem.id} className='RegisterInputs' onChange={(e)=>{handleInputChange(elem.keyForDB,e.target.value)}}/>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        )
                                    }
                        </div>
                        <div className="AddProductBtns">
                            <button className="submitSignIn"  tabIndex={0} onClick={()=>{handleSubmit();}}>
                                Submit
                            </button>
                            <button className="submitSignIn"  tabIndex={0} onClick={()=>{setAddProduct({...addProduct,isOpen:false})}}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
        </>
    )
}

export default AddProduct