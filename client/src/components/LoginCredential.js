import {React,useEffect,useState} from 'react';
import login from './assets/login.png';
import './cssfiles/LoginCred.css';
import LoginButtonImg from './assets/LoginButton.png';
import {useNavigate} from 'react-router-dom';
function LoginCredential(props){
    const navigate = useNavigate();
    const [userName,setUserName] = useState('No UserName');
    const [userRole,setUserRole] = useState('Role');
    const NavigateToLogin =()=>{
        navigate('/login');
    }
    useEffect(() => {
        const { name, role } =props;
        if (name) setUserName(name);
        if (role) setUserRole(role);
    }, [userName,userRole]);
    return(
        <>
            <div id="Container">
            <img src={login} className='UserImg'/>
            <h4 id="Name">{userName}</h4>
            <p id="Role">{userRole}</p>
            <img src='https://iconape.com/wp-content/files/ef/369917/svg/logout-logo-icon-png-svg.png' className='LoginButton-1' onClick={NavigateToLogin}/>
            </div>
        </>
    )

}
export default LoginCredential;