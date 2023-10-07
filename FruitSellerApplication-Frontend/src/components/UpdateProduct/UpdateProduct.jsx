import { useContext, useEffect, useState } from "react";
import { UpdateProducts , DeleteProduct} from "../../utils/ApiHandlers";
import "./UpdateProduct.css"
import { UserContext } from "../../App";

function UpdateProduct({updateProduct,setUpdateProduct}) {
    const {setAllProducts} = useContext(UserContext)

    const [elements,setElements ] = useState({});

    useEffect(()=>{
        console.log(updateProduct);
        if(JSON.stringify(updateProduct)!="{}"){
            setElements({...updateProduct})
        }
    },[updateProduct])
 
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

        const productData = await UpdateProducts(elements);
        productData && setAllProducts((prev)=>{
            return prev.map((prod)=>{
                if(prod && currProduct && prod.productID != currProduct.productID){
                    return prod
                }else return elements
            })
        })

        setUpdateProduct({...updateProduct,isOpen:false})
    }

    const handledeleteProduct = async () => {
        const productData = await DeleteProduct(elements.productID);
        productData && setAllProducts((prev)=>{
            return prev.map((prod)=>{
                if(prod && updateProduct && prod.productID != updateProduct.productID){
                    return prod
                }
            })
        })

        setUpdateProduct({...updateProduct,isOpen:false})
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
                              Update Product
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
                                                            <input type={elem.inputType}  tabIndex={0}  placeholder={elements[elem.keyForDB]} value={elements[elem.keyForDB]}  id={elem.id} className='RegisterInputs' onChange={(e)=>{handleInputChange(elem.keyForDB,e.target.value)}}/>
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
                            <button className="submitSignIn"  tabIndex={0} onClick={()=>{setUpdateProduct({...updateProduct,isOpen:false,})}}>
                                Cancel
                            </button>
                            <button className="submitSignIn"  tabIndex={0} onClick={()=>{handledeleteProduct()}}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
        </>
    )
}

export default UpdateProduct