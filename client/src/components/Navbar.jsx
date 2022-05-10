
import React,{useContext} from "react";
import { Navbar, Nav, Container} from 'react-bootstrap';
import { UserContext } from "../App";
import { Link } from 'react-router-dom'


function Navbars()
{
  
const style={
  color:"black",
  textDecoration: 'none',
  marginBottom:"10px"
  
}

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
  
<Navbar bg="light" expand="lg" fixed="top"  >
  <Container >
    <Navbar.Brand href="/" className="brand navt">E-Notes</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">
      <Nav.Link className="navt"> <Link  to="/login" style={style}>Login</Link></Nav.Link>
      <Nav.Link className="navt"> <Link  to="/signup" style={style}>signup</Link></Nav.Link>
    
        {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
          <NavDropdown.Item className="navt" href="#action/3.1">Action</NavDropdown.Item>
          <NavDropdown.Item className="navt" href="#action/3.2">Another action</NavDropdown.Item>
          <NavDropdown.Item className="navt" href="#action/3.3">Something</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item  href="#action/3.4">Separated link</NavDropdown.Item>
        </NavDropdown> */}
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

    );
}

export default Navbars ;