import React, { useState , useEffect,useContext} from "react";

import { Card} from 'react-bootstrap';
import { Link,useNavigate  } from 'react-router-dom';

import {UserContext} from '../../App'

import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbars from '../Navbar';
toast.configure()
function Login() {
  const [Password, setPassword] = useState("");
  const [Email, setEmail] = useState("");
  const navigate=useNavigate();
  const [data, setData] = useState([]);
    const [showCom, setCom] = useState(false);
    const { state, dispatch } = useContext(UserContext);
    if(state && state._id)
  {
      navigate("/home")
  }
    useEffect(() => {
      if(state && state._id)
    {
        navigate("/home")
    }
  }, [])
        
  const postData = () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: Email,
        password: Password
      })
    };
    fetch('/login', requestOptions)
      .then(res => res.json())
      .then(data => {
        JSON.stringify(data)

        if (data.error) {
         toast.warning(data.error)
         
        }
        else
        {
          toast.success("login succesful");
          localStorage.setItem('jwt',data.token)
          
          localStorage.setItem("user",JSON.stringify(data.user))
               dispatch({type:"USER",payload:data.user})
          
          
          navigate('/home')
        }
      }).catch(err=>{
            console.log(err);
      });
  
  }
  
    return (
      <div>
      <Navbars/>
       <div className="wcard">
       <Card style={{ width: '18rem' }} className="cards .input-field">
         <div className="auth-card">
         <h2>E-notes</h2>
         <input type="text" placeholder="email" onChange={(e) => setEmail(e.target.value)} value={Email}/>
         <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} value={Password}/>
         <button className="btn waves-effect waves-light #66bb6a green lighten-1" onClick={postData}>
         login
         </button>
         <h6>
             <Link to='/signup'>don't have account?</Link>
         </h6>
         </div>
         </Card>
  
       </div>
       </div>
    )
}

export default Login;