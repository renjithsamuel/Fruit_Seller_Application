import "./TopNav.css"
import lottie from 'lottie-web';
import { defineElement } from 'lord-icon-element';
import { Link } from 'react-router-dom';

defineElement(lottie.loadAnimation);    

function TopNav({pageName,setSearchText}) {
    return <div className="TopNavWrapper">
        <div className="TopNavLeft">
            <div className="SearchBox">
                    <lord-icon
                        src="https://cdn.lordicon.com/xfftupfv.json"
                        trigger="hover"
                        colors="primary:#121331"
                        style={{width:30,height:30  }}
                     >
                 </lord-icon>
                <input type="text" placeholder="Search" id="searchInp" onChange={(e)=>{setSearchText(e.target.value)}}/>
            </div>
        </div>
        <Link to={'/'} tabIndex={0} style={{all:'unset'}}><div className="TopNavMiddle">
            <div>
            FruityBasket
            </div>
            </div></Link>
        <div className="TopNavRight">
            <div className="notificationsBtn">
                                <lord-icon
                                    src="https://cdn.lordicon.com/psnhyobz.json"
                                    trigger="hover"
                                    colors="primary:#121331"
                                    style={{width:30,height:30  }}
                                >
                                </lord-icon>
            </div>
            <Link to={'/cart'} tabIndex={0} >
                    <div className="cartBtn">
                                        <lord-icon
                                            src="https://cdn.lordicon.com/hyhnpiza.json"
                                            trigger="hover"
                                            colors="primary:#121331"
                                            style={{width:30,height:30  }}
                                        >
                                        </lord-icon>
                    </div>
                </Link>
                <Link to={'/profile'} tabIndex={0} >
                    <div className="profileBtn">
                                <lord-icon
                                    src="https://cdn.lordicon.com/bhfjfgqz.json"
                                    trigger="hover"
                                    colors="primary:#121331"
                                    style={{width:30,height:30  }}
                                >
                                </lord-icon>
                    </div>
                </Link>
        </div>
    </div>
}

export default TopNav