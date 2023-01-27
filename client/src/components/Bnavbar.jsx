
import React,{useContext,useState} from "react";
import { UserContext } from "../App";
import { Link,useNavigate  } from 'react-router-dom'
import { Route, withRouter, BrowserRouter as Router, Switch } from 'react-router-dom';

import BottomNavigation from 'reactjs-bottom-navigation'
import 'reactjs-bottom-navigation/dist/index.css'
import HomeIcon from '@mui/icons-material/Home';
import HomeSharpIcon from '@mui/icons-material/HomeSharp';

import SearchIcon from '@mui/icons-material/Search';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';

import CreateSharpIcon from '@mui/icons-material/CreateSharp';
import CreateIcon from '@mui/icons-material/Create';

import PersonIcon from '@mui/icons-material/Person';
import PermIdentitySharpIcon from '@mui/icons-material/PermIdentitySharp';
function Bnavbars()
{
    const navigate=useNavigate();
    const [selected,setSelected]=useState(0);
const style={
  
  
}
const bottomNavItems = [
    {
      title: 'Home',
      key:0,
      route:'/home',
      icon: <HomeIcon style={{ fontSize: '18px' }} />,
      activeIcon: <HomeSharpIcon style={{ fontSize: '18px', color: '#fff' }} />
    },
    {
      title: 'Search',
      key:1,
      route:'/search',
      icon: <SearchIcon style={{ fontSize: '18px' }} />,
      activeIcon: <SearchSharpIcon style={{ fontSize: '18px', color: '#fff' }} />
    },
    {
      title: 'createpost',
      key:2,
      route:'/cretepost',
      icon: <CreateSharpIcon style={{ fontSize: '18px' }} />,
      activeIcon: <CreateIcon style={{ fontSize: '18px', color: '#fff' }} />
      
    },
    {
      title: 'profile',
      key:3,
      route:'/profile',
      icon: <PersonIcon style={{ fontSize: '18px' }} />,
      activeIcon: <PermIdentitySharpIcon style={{ fontSize: '18px', color: '#fff' }} />,
    //   onClick: () => alert('profile clicked')
    }
  ]
// const {state,dispatch}=useContext(UserContext);

//    const renderList=()=>{
//      if(state)
//      {

//      }
//      else
//      {

//      }
//    }
    return (
        <div className="bnavbar">
        <BottomNavigation
          items={bottomNavItems}
          Selected={selected}
          onItemClick={(item) =>{
            setSelected(item.id)
            
            navigate("/"+item.title)
            
            
          }
          
          }
        />
        </div>
  

    );
}

export default Bnavbars ;