import { useState } from "react";
import "./SignIn.css"
import { SignInUser } from "../../utils/ApiHandlers";


function SignIn({setCurrentUser}) {
    const [isLogin,setIsLogin] = useState(true)

    const [elements,setElements ] = useState({});
 
    const handleInputChange = (keyForDB,value) => {
        let updatedElems = {...elements}
        updatedElems[keyForDB] = value ;
        setElements(updatedElems);
        console.log(updatedElems);
    }

    const handleSubmit = async ()=>{
        if(isLogin){
            if( elements.email == null || elements.password == null){
                alert('send valid details!');
                console.log("send valid details!");
                return;
            }
        }
        else if(elements.name == null || elements.email == null || elements.role==null || elements.dateOfBirth==null || elements.phoneNumber ==null || elements.preferredLanguage == null
            || elements.address == null || elements.country == null || elements.password == null){
            alert('send valid details!');
            console.log("send valid details!");
            return;
        }

        const currentDate = new Date(elements.dateOfBirth);
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        elements.dateOfBirth = `${year}-${month}-${day}`;

        const userData = await SignInUser(isLogin,elements,setIsLogin);
        console.log(userData);
        userData && setCurrentUser(userData)
    }
    
    const RegisterParams = [
                    {keyForDB : "name",inputLabel : "username : " , inputPlaceHolder : " Enter username  " , inputType : "text"},
                    {keyForDB : "email",inputLabel : "email : " , inputPlaceHolder : " Enter email  " , inputType : "email"},
                    {keyForDB : "role",inputLabel : "role : " , inputPlaceHolder : " role  " , inputType : "text"},
                    {keyForDB : "dateOfBirth",inputLabel : "date of birth : " , inputPlaceHolder : " Enter End Date  " , inputType : "Date"},
                    {keyForDB : "phoneNumber",inputLabel : "Phone : " , inputPlaceHolder : " Enter phone number  " , inputType : "text"},
                    {keyForDB : "preferredLanguage",inputLabel : "Preferred language : " , inputPlaceHolder : " Enter preferred lang  " , inputType : "text"},
                    {keyForDB : "address",inputLabel : "Address : " , inputPlaceHolder : " Enter address " , inputType : "textarea"},
                    {keyForDB : "country",inputLabel : "Country : " , inputPlaceHolder : " Enter country  " , inputType : "text"},
                    {keyForDB : "password",inputLabel : "Password : " , inputPlaceHolder : " Enter password  " , inputType : "password"},
                ];

    return <div className="SignInWrapper">
        <div className="SignInBox">
            <div className="SignInName">
                {(isLogin)?"Login":"Register"}
            </div>
            {
                (isLogin)? 
                    <div className="LoginWrapper"> 
                        
                        <div className="LoginInputWrapper">
                            <div className="loginLeft">
                                Email
                            </div>
                            <div className="loginRight">
                                <input type="email"  tabIndex={0}  placeholder="Email"  className="loginInp" onChange={(e)=>{handleInputChange("email",e.target.value)}}/>
                            </div>
                        </div>
                        <div className="LoginInputWrapper">
                            <div className="loginLeft">
                                Password
                            </div>
                            <div className="loginRight">
                                <input type="Password"  tabIndex={0}  placeholder="Password"  className="loginInp" onChange={(e)=>{handleInputChange("password",e.target.value)}}/>
                            </div>
                        </div>
                    </div>
                : 
                    <div className="RegisterWrapper">
            
                                {
                                    RegisterParams.map((elem,index)=>{
                            
                                        return (
                                                <div className="registerInputWrapper" key={index}>
                                                    <div className="registerInputLeft">
                                                        {elem.inputLabel}
                                                    </div>
                                                    <div className="registerInputRight">
                                                        {(elem.keyForDB!='role' && elem.keyForDB!="preferredLanguage")?
                                                        <input type={elem.inputType}  tabIndex={0}  placeholder={elem.inputPlaceHolder}  id={elem.id} className='RegisterInputs' onChange={(e)=>{handleInputChange(elem.keyForDB,e.target.value)}}/>
                                                            :
                                                        (elem.keyForDB=="role")?
                                                         (<div className="roleSelectorWrapper">
                                                                <div className="roleSelector1" style={{backgroundColor:(elements.role=="buyer")?"var(--secondary-light-color)":"var(--primary-color)"}}  onClick={(e)=>{handleInputChange("role","buyer")}} >
                                                                    Buyer
                                                                </div>
                                                                <div className="roleSelector2" style={{backgroundColor:(elements.role=="seller")?"var(--secondary-light-color)":"var(--primary-color)"}}  onClick={(e)=>{handleInputChange("role","seller")}}>
                                                                    Seller
                                                                </div>
                                                         </div>)
                                                         :
                                                           ( <div className="langSelectorWrapper">
                                                                    <div className="langSelector1" style={{backgroundColor:(elements.preferredLanguage=="english")?"var(--secondary-light-color)":"var(--primary-color)"}} onClick={(e)=>{handleInputChange(elem.keyForDB,"english")}} >
                                                                        English
                                                                    </div>
                                                                    <div className="langSelector2" style={{backgroundColor:(elements.preferredLanguage=="tamil")?"var(--secondary-light-color)":"var(--primary-color)"}}  onClick={(e)=>{handleInputChange(elem.keyForDB,"tamil")}}>
                                                                        Tamil
                                                                    </div>
                                                            </div>)
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        }
                                    )
                                }
                    </div>
            }

                <div className="submitSignInWrap">
                    <button className="submitSignIn"  tabIndex={0} onClick={()=>{handleSubmit();}}>
                        Submit
                    </button>
                </div>
            <div className="AreYouRegistered">
                {
                 (!isLogin)?
                    <div> Already have an account? <span className="isLoginLink" onClick={()=>{setIsLogin(true)}}> Register </span> </div>
                    :
                    <div> New User? <span className="isLoginLink" onClick={()=>{setIsLogin(false)}}> Register </span></div>
                }
            </div>
        </div>
    </div>
}


export default SignIn