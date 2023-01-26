import React, { useState , useEffect,useContext} from "react";
import Navbars from '../Navbar';
import { Link,useNavigate  } from 'react-router-dom';
import {UserContext} from '../../App'

function Window()
{
const { state, dispatch } = useContext(UserContext);
const navigate = useNavigate();
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
    return (
        <div>
            <Navbars/>
            <div className="homeimage">
            <div className="window">
             <h2>
                 enotes a social media app to download others notes and upload notes.
             </h2>
             
            </div>
            
             </div>
        </div>
    )
}

export default Window;