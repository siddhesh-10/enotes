import React,{useState} from 'react'
import {useParams,useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import M from 'materialize-css'
function  Newpassword  ()
{
    const navigate=useNavigate();
    const [password,setPasword] = useState("")
    const {token} = useParams();
    
    //console.log(token)
    const PostData = ()=>{
        if (!password || password.length <5) {
            return toast.warning("Password length greater than 5");
    
          }
        fetch("/new-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                token
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
           if(data.error){
              toast.error(data.error)
           }
           else{

              toast.success(data.message)
               navigate('/login')
           }
        }).catch(err=>{
            toast.error(err)
        })
    }
   return (
      <div className="home mycard" style={{margin:"0px auto",maxWidth:"800px"}}>
          <div className="card auth-card input-field">
            <h2>Enotes</h2>
        
            <input
            type="password"
            placeholder="enter a new password"
            value={password}
            onChange={(e)=>setPasword(e.target.value)}
            />
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={()=>PostData()}
            >
               Update password
            </button>
    
        </div>
      </div>
   )
}


export default Newpassword