
export const sendHttpRequest = async (url , method, token, data) => {
    let returnData ;
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `${token}`;
    }
    await fetch(url,{
        method : method ,
        body : JSON.stringify(data),
        headers : headers
    }).then((response)=>{return response.json()}).then((response)=>returnData=response).catch(err=>console.log(JSON.stringify(err)));
    return returnData;
}

export const lookForUser = () => {
    const tempUser = JSON.parse(localStorage.getItem("currentUser"))
    if(JSON.stringify(tempUser)!="{}") {
        return tempUser
    }
    return null
}

export const getProducts = async () => {
    const getProductsApi = `http://localhost:5004/products`
    const resp = await sendHttpRequest(getProductsApi,"GET")
    if (resp==null || !Array.isArray(resp.products)) {
        console.log("[Get Products]:Something went wrong",resp);
    }
    return resp.products
}


export const SignInUser = async (isLogin,elements,setIsLogin) => {
    console.log(elements);
    let resp = {};
    if (isLogin){
        const loginUserApi = `http://localhost:5001/login`
        resp = await sendHttpRequest(loginUserApi,"POST",null ,elements)
        console.log(resp);
        if (!resp.success){
            console.log("[signInUser]:failed");
            return
        }
    }
    else {
        const postUserApi = `http://localhost:5001/users`
        resp = await sendHttpRequest(postUserApi,"POST",null,elements)
        console.log(resp);
        if (!resp.success){
            console.log("[signInUser]:failed");
            return
        }
        setIsLogin(true)
    }
    const getUserAPI = `http://localhost:5001/users/${resp.userID}`
    let UserData = await sendHttpRequest(getUserAPI,"GET",resp.token)
    if (!UserData.user){
        console.log("[signInUser]:failed");
        return
    }
    const tempCurrentUser = JSON.stringify(UserData.user)
    if(resp==null || resp.token!=null){
        localStorage.setItem("token",resp.token)
      }
    if (resp==null || resp.userID!=null ){
            localStorage.setItem("userID",resp.userID)
        }
    if (UserData==null ||UserData.user!=null){
        localStorage.setItem("currentUser",tempCurrentUser)
    }
    return UserData && UserData.user
}



export const UpdateUser = async (elements) => {
    elements.password = prompt("Enter your password") 
    if (elements.password == null) {
        alert('send valid details!');
        console.log("send valid details!");
        return;
    }
    console.log(elements);
    let resp = {};
    const userID = localStorage.getItem("userID")
    const postUserApi = `http://localhost:5001/users/${userID}`
    resp = await sendHttpRequest(postUserApi,"PUT",localStorage.getItem("token"),elements)
    if (resp==null || !resp.success){
        console.log("[UpdateUser]:failed");
    }
    
    const getUserAPI = `http://localhost:5001/users/${userID}`
    let UserData = await sendHttpRequest(getUserAPI,"GET",localStorage.getItem("token"))
    if (UserData==null || !UserData.user){
        console.log("[UpdateUser]:failed");
    }
    const tempCurrentUser = JSON.stringify(UserData.user)
    if(UserData==null || UserData.user!=null){ 
        localStorage.setItem("currentUser",tempCurrentUser)
    }  
    return UserData.user
}



export const AddToCart = async (productID,cartID) => {
    const addToCartApi = `http://localhost:5003/carts`
    const addCartObj = {productID : productID,cartID:cartID,quantity:1}
    const resp = await sendHttpRequest(addToCartApi,"POST",localStorage.getItem("token"),addCartObj)
    if (resp==null || resp.message==null) {
        console.log("[AddToCart]:Something went wrong",resp);
        return
    }
    alert("Product added to cart!")
}


export const getCartItems = async (cartID) => {
    const GetCartApi = `http://localhost:5003/carts/${cartID}`
    const resp = await sendHttpRequest(GetCartApi,"GET",localStorage.getItem("token"))

    if (resp==null || resp.userID==null) {
        console.log("[AddToCart]:Something went wrong",resp);
        return
    }
    return resp.items
}

export const RemoveFromCart = async (productID,cartID) => {
    const RemoveFromCartAPI = `http://localhost:5003/carts/${cartID}/products/${productID}`
    const resp = await sendHttpRequest(RemoveFromCartAPI,"DELETE",localStorage.getItem("token"))
    if (resp==null || resp.message==null) {
        console.log("[RemoveFromCart]:Something went wrong",resp);
        return false
    }
    return true
}

export const updateCartItem = async (updateCartObj) => {
    const updateCartAPI = `http://localhost:5003/carts`
    const resp = await sendHttpRequest(updateCartAPI,"PUT",localStorage.getItem("token"),updateCartObj)
    console.log(resp);
    if (resp==null || resp.message==null) {
        console.log("[updateCartItem]:Something went wrong",resp);
        return false
    }
    if (resp.message == "Product Invalid or Out Of Stock"){
        return false
    }
    return true
}


export const AddProducts = async (elements) => {
    elements.sellerID = localStorage.getItem("userID")
    console.log(elements);
    elements.price = Number(elements.price)
    elements.stockQuantity = Number(elements.stockQuantity)
    
    const PostProductsApi = `http://localhost:5004/products`
    let resp = await sendHttpRequest(PostProductsApi,"POST",localStorage.getItem("token"),elements)
    console.log(resp);
    if (resp==null) {
        console.log("[AddProduct]:Something went wrong",resp);
    }
    const productID = resp && resp.productID
    const getProductbyIDApi = `http://localhost:5004/products/${productID}`
    resp = await sendHttpRequest(getProductbyIDApi,"GET")
    if (resp==null) {
        console.log("[AddProducts]:Something went wrong",resp);
    }
    return resp.products
}

export const UpdateProducts = async (elements) => {
    elements.sellerID = localStorage.getItem("userID")
    console.log(elements);
    const PatchProductsApi = `http://localhost:5004/products`
    let resp = await sendHttpRequest(PatchProductsApi,"PATCH",localStorage.getItem("token"),elements)
    if (resp==null) {
        console.log("[AddProduct]:Something went wrong",resp);
    }
    const productID = resp && resp.productID
    const getProductbyIDApi = `http://localhost:5004/products/${productID}`
    resp = await sendHttpRequest(getProductbyIDApi,"GET")
    if (resp==null) {
        console.log("[AddProducts]:Something went wrong",resp);
    }
    return resp.products
}

export const DeleteProduct = async (productID) => {
    if(!confirm("are you sure")){
        return false
    }
    const    sellerID =  localStorage.getItem("userID")
    const RemoveProductApi = `http://localhost:5004/products/${productID}/seller/${sellerID}`
    const resp = await sendHttpRequest(RemoveProductApi,"DELETE",localStorage.getItem("token"))
    if (resp==null) {
        console.log("[DeleteProduct]:Something went wrong",resp);
        return false
    }
    return true
}


export const DeleteUser = async () => {
    const userID =  localStorage.getItem("userID")
    const deleteUserApi = `http://localhost:5001/users/${userID}`
    const resp = await sendHttpRequest(deleteUserApi,"DELETE",localStorage.getItem("token"))
    if (resp==null) {
        console.log("[DeleteUser]:Something went wrong",resp);
        return false
    }
    return true
}
