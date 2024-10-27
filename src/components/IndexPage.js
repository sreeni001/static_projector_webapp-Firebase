import {React,useState,useEffect} from 'react';
import './cssfiles/IndexPage.css';
import DashboardContent from './Dashboard.js'
import LoginCred from './LoginCredential.js';
import {useLocation} from 'react-router-dom';
function IndexPage(props){
    const locate = useLocation();
    var isvalidate = false;
    const {Name,role} = locate.state;
   // console.log(isvalidate);
    if(Name!==' ' && role!==' ') isvalidate = true; 
    return(
        <>
        
        <div className="ParentContainer">
        <div className='split loginContainer'>
        <LoginCred name={Name} role={role} />
        </div>
        <div className='split ContentContainer'>
        <DashboardContent isvalidate={isvalidate}/>
        </div>
        
        
        </div>
        </>
    )

}

export default IndexPage;