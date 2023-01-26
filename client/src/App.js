    import React,{useEffect,useContext,useReducer, createContext} from "react";
   
    import {
      BrowserRouter ,
      Routes ,
      Route,
      useLocation
    } from "react-router-dom";

    import './App.css';
    import Navbars from './components/Navbar';
    import { useNavigate } from 'react-router-dom';

    import Login from './components/screens/Login.jsx';
    import Signup from './components/screens/Signup.jsx';

    import Home from './components/screens/Home'
    import Window from './components/screens/Window'
    import Profile from './components/screens/Profile';
    import CreatePost from './components/screens/CreatePost';
    import UserProfile from './components/screens/UserProfile';
    import Search from './components/screens/Search';
    import Departmennt from './components/screens/Department';
    import Subject from './components/screens/Subject';
    import Reset from './components/screens/Reset';
    import Newpassword from './components/screens/Newpassword';
   import {reducer,initialState} from './reducers/userReducer.js'

   export const UserContext = createContext();

const Routing=()=>{
  const navigate = useNavigate();
  const location = useLocation();
  
  const {state,dispatch}=useContext(UserContext);
  const user = JSON.parse(localStorage.getItem("user"));
  

  useEffect(()=>{
    if(user){
      dispatch({type:"USER",payload:user})
      
    }
    else
    {
      console.log("hyr");
      console.log(location.pathname);
     if(!location.pathname.startsWith('/reset'))
       navigate('/login')
    
      
    }
  },[]);

  return (
    <Routes>
    
    <Route path="/" element={<Window />}></Route>
    <Route path="/login" element={<Login />}></Route>
    <Route path="/signup" element={<Signup />}></Route>
    
    {/* <Route path="/reset/:token">
        <Newpassword />
      </Route> */}
      <Route  path={`reset/:token`}  exact={true} element={<Newpassword />}></Route>
      <Route  path="/reset" exact={true} element={<Reset />}></Route>
    <>
    <Route  path={`profile/:userId`}  exact={true} element={<UserProfile />}></Route>
    <Route  path={`search/:dept`}  exact={true} element={<Departmennt />}></Route>
    <Route  path={`searchs/:sub`}  exact={true} element={<Subject />}></Route>
    
    <Route exact path="/profile"  element={<Profile />}></Route>
    <Route exact path="/home"  element={<Home />}></Route>
    <Route path="/createpost" element={<CreatePost />}></Route>
    <Route path="/search" element={<Search />}></Route>
    
    
    

    
    </>
  </Routes>
  )
}

    function App() {
      const initialStates = {
        user: {},
        error: null
    };
    
      const [state, dispatch] = useReducer(reducer, initialStates);
     
      return (
        <UserContext.Provider value={{ state, dispatch }}>
          <BrowserRouter>

            <Routing />

          </BrowserRouter>
        </UserContext.Provider>
      );
    }

    export default App;

    