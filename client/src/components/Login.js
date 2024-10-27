import {React,useState} from 'react';
import './cssfiles/login.css'
/*import LoginButton from './assets/LoginButton.png'*/
import logo from './assets/login.png';
import {useNavigate} from 'react-router-dom';
function Login(){
        const navigate = useNavigate();
        //const [userName,getUsername] = useState('');
        const Validation=async ()=>{
            try{
            
            const result = await fetch("http://localhost:4000/submit",{
                method: 'POST', 
                headers: {
                  'Content-Type': 'application/json', 
                },
                body: JSON.stringify({usrname: document.getElementsByClassName('usrname')[0].value ,pass: document.getElementsByClassName('pass')[0].value}),
            });
            if(!result.ok) throw new Error('problem in fetching');
            const data = await result.json();
            navigate('/IndexPage', {state : data});
            /* To send data to the next page using Usenavigation along with state that carrries the values to the next page     */

            }
            catch(err){
                console.error('Error fetching data:', err);
            }
        }
        return(
            <>
                <div className='Container'>
                <img src={logo} alt="image" className='login-logo'/>
                <div className='Form' >
                    
                    <input type='email' name='usrname' className='usrname' placeholder='Email'/>
                    <br/>
                    
                    <input type='password' name='pass' className='pass' placeholder='Password'/>
                    <img src='https://icon-library.com/images/login-icon/login-icon-29.jpg' onClick={Validation} className='LoginButton'/>
                </div>
                </div>
            </>
        )
}
export default Login;
