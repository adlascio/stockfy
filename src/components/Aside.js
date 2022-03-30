import React, {useState} from 'react'
import logo from '../images/logo512.png'
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Aside() {
  const user = useAuth();
  const [activeTab, setActiveTab] = useState("");
  return (
    <>
      {
        user.currentUser? (
            <aside>
                <div className='top'>
                    <div className='logo'>
                        <img src={logo}/>
                        <h2>$tockfy</h2>
                    </div>
                    <div className='close' id='close-btn'>
                        <span className="material-icons-sharp">close</span>
                    </div>
                </div>
                <div className='sidebar'>
                    <Link to='/profile' className={activeTab === "profile"?'sidebar__item active': 'sidebar__item'} onClick={()=>{setActiveTab("profile")}}> <span className="material-icons-sharp sidebar__item__icon">account_circle</span> My Profile</Link>
                    <Link to='/' className={activeTab === "dashboard"?'sidebar__item active': 'sidebar__item'} onClick={()=>{setActiveTab("dashboard")}}> <span className="material-icons-sharp sidebar__item__icon">grid_view</span>Dashboard</Link>
                    <Link to="/my-pies" className={activeTab === "my-pies"?'sidebar__item active': 'sidebar__item'} onClick={()=>{setActiveTab("my-pies")}}> <span className="material-icons-sharp sidebar__item__icon">pie_chart</span>My Pies</Link>
                    <Link to="/transactions" className={activeTab === "transactions"?'sidebar__item active': 'sidebar__item'} onClick={()=>{setActiveTab("transactions")}}>
                        <span className="material-icons-sharp sidebar__item__icon">receipt_long</span> Transactions
                    </Link>
                    <Link to="/logout" className='sidebar__item' > <span className="material-icons-sharp sidebar__item__icon">logout</span> Logout</Link>
                </div>
            </aside>
            ) : (<></>)
        }
    </>
    
    
  )
}
