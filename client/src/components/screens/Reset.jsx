import React,{useState,useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import M from 'materialize-css'
function Reset()
{
    
    const navigate=useNavigate();
    const [email,setEmail] = useState("")
    const PostData = ()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email",classes:"#c62828 red darken-3"})
            return
        }
        fetch('/reset-password',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email
            })
        }).then(res=>res.json())
        .then(data=>{
           if(data.error){
            return toast.warning(data.error);
           }
           else{
               
               toast.success(data.message)
               navigate('/login')
           }
        }).catch(err=>{
            console.log(err)
            return toast.warning("enter valid email");
        })
    }
   return (
      <div className="home mycard" style={{margin:"0px auto",maxWidth:"800px"}}>
          <div className="card auth-card input-field">
            <h2>Enotes</h2>
            <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={()=>PostData()}
            >
               reset password
            </button>
            
    
        </div>
      </div>
   )
}


export default Reset