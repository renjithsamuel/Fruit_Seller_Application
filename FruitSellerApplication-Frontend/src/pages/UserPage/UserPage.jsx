import { useContext, useEffect , useState} from "react";
import SignIn from "../SignInPage/SignIn";
import "./UserPage.css"
import { UserContext } from "../../App";
import TopNav from "../../components/TopNav/TopNav";
import { DeleteUser, UpdateUser } from "../../utils/ApiHandlers";
import { Link } from 'react-router-dom';

function UserPage({}) {

    const {currentUser,setCurrentUser} = useContext(UserContext);

    return (<div className="UserPageWrapper">
        <TopNav />
        {
            (JSON.stringify(currentUser)=="{}")?
                <SignIn setCurrentUser={setCurrentUser}/>
            : 
                <Profile currentUser={currentUser} setCurrentUser={setCurrentUser}/>
        }
    </div>)
}

export default UserPage

function Profile({currentUser,setCurrentUser}) {

    const [elements,setElements ] = useState({});

    useEffect(()=>{
        if(JSON.stringify(currentUser)!="{}"){
            setElements({...currentUser})
        }
    },[currentUser])
 
    const handleInputChange = (keyForDB,value) => {
        let updatedElems = {...elements}
        updatedElems[keyForDB] = value;
        setElements(updatedElems);
        console.log(updatedElems);
    }

    const handleSubmit = async ()=>{
        if(elements.name == null || elements.email == null || elements.role==null || elements.dateOfBirth==null || elements.phoneNumber ==null || elements.preferredLanguage == null
            || elements.address == null || elements.country == null){
            alert('send valid details!');
            console.log("send valid details!");
            return;
        }
        const currentDate = new Date(elements.dateOfBirth);
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        elements.dateOfBirth = `${year}-${month}-${day}`;

        const userData = await UpdateUser(elements);
        console.log(userData);
        userData && setCurrentUser(userData)
    }

    const logout = () => {
        if (confirm('sure to logout?')){
            localStorage.clear()
            setCurrentUser({})
        }
    }


    const handleDeleteUser = async () => {
        if(!confirm("Are you sure?")){
            return
        }
        if(await DeleteUser()){
            logout()
        }
    }

    return (<>
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
                                        <input type={elem.inputType}  tabIndex={0}  placeholder={elements[elem.keyForDB]} value={elements[elem.keyForDB]} id={elem.id} className='RegisterInputs' onChange={(e)=>{handleInputChange(elem.keyForDB,e.target.value)}}/>
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
                                <div className="submitSignInWrap" style={{display:"flex"}}>
                                    <button className="submitSignIn"  tabIndex={0} onClick={()=>{handleSubmit();}}>
                                        update
                                    </button>
                                    <button className="submitSignIn"  tabIndex={0} onClick={()=>{logout();}}>
                                        logout
                                    </button>
                                    {(currentUser.role == "seller")?
                                        <Link to={"/product"} tabIndex={0} style={{all:"unset"}}>
                                            <button className="submitSignIn"  tabIndex={0}>
                                                products
                                            </button>
                                        </Link>
                                        : ''
                                    }
                                    <button className="submitSignIn"  tabIndex={0} onClick={()=>{handleDeleteUser();}}>
                                        Delete User
                                    </button>
                                </div>
</div>
    
    </>)
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
];