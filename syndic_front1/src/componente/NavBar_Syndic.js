import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'; 
// Import your components
//import Home from './Home';
//import ListSyndic from './ListSyndic';
import GesAppaMeuble from './ges_appa_meuble';
import ListPropriétaire from './ListPropriétaire';
import Payments from './ListPayments';
import ListLocateur from './ListLocateur';
import SyndicDashboard from './Syndic_Dashboard';
//import TacheList from './ListTache';
// ... (imports remain the same)

function SyndicNavBar(props) {
  const { customStyle, customBackgroundColor } = props;

  const [fontColor] = useState("white"); // Set the initial font color to white

  const customNavbarStyle = {
    backgroundColor: customBackgroundColor ? customBackgroundColor : "#000000",
    color: fontColor, // Use the state variable for the font color
     // Set the font weight to bold
    fontSize: "15px", // Set the font size to 15 pixels
  };
  
  const customNavLinkStyle = {
    color: fontColor, // Use the state variable for the navigation link font color
    marginRight: "15px",
  };

  


  return (
    <div>
    <BrowserRouter>
      <Navbar expand="lg"   className={customStyle} style={customNavbarStyle}>
        <Container>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
    
              {/* <Nav.Link as={Link}   to="/" style={customNavLinkStyle} >
                Home
              </Nav.Link> */}
              <Nav.Link as={Link} to="/DashboardSyndic" style={customNavLinkStyle}>
            Dashboard  
              </Nav.Link>
              {/* <Nav.Link as={Link} to="/syndics" style={customNavLinkStyle}>
                Syndics
              </Nav.Link> */}
              <Nav.Link as={Link} to="/appartement_meuble" style={customNavLinkStyle}>
                Appartements et meuble
              </Nav.Link>
              <Nav.Link as={Link} to="/proprietaires" style={customNavLinkStyle}>
                Propriétaire
              </Nav.Link>
              <Nav.Link as={Link} to="/locateur" style={customNavLinkStyle}>
                Locateur
                </Nav.Link>
              <Nav.Link as={Link} to="/Payments" style={customNavLinkStyle}>
                Payment
              </Nav.Link>
              {/* <Nav.Link as={Link} to="/Tache" style={customNavLinkStyle}>
                Tache
              </Nav.Link> */}

              
            </Nav>
            
             {/* Add the Log Out button */}
             <Button className="ml-2"
                variant="outline-light"
                onClick={() => window.location.reload()}
              >
                Log Out
              </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
      
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/locateur" element={<ListLocateur />} /> 
        <Route path="/DashboardSyndic" element={<SyndicDashboard email={props.email}/>} />
        {/* <Route path="/syndics" element={<ListSyndic />} /> */}
        <Route path="/appartement_meuble" element={<GesAppaMeuble/>} />
        <Route path="/proprietaires" element={<ListPropriétaire />} />
        <Route path="/Payments" element={<Payments />} />
        {/* <Route path="/Tache" element={<TacheList />} /> */}
      </Routes>
    </BrowserRouter>

   
 
    </div> 
    );
}

export default SyndicNavBar;
