import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import ListSyndic from './ListSyndic';
import GesAppaMeuble from './ges_appa_meuble';
import ListPropriétaire from './ListPropriétaire';
import Payments from './ListPayments';
import Dashboard from './Admin_dashboard';
import TacheList from './ListTache';
import ListAdmin from './ListAdmi';
import ListLocateur from './ListLocateur';
import ListAnnonceAdmine from './ListAnnonceAdmin';

function NavBar(props) {
  const { customStyle, customBackgroundColor } = props;

  const [fontColor] = useState("white");
  const [buttonClicked, setButtonClicked] = useState(false);

  const customNavbarStyle = {
    backgroundColor: customBackgroundColor ? customBackgroundColor : "#000000",
    color: fontColor,
    fontSize: "15px",
  };

  const customNavLinkStyle = {
    color: fontColor,
    marginRight: "15px",
  };

  

  return (
    <div>
      <BrowserRouter>
        <Navbar expand="lg" className={customStyle} style={customNavbarStyle}>
          <Container>
            <Navbar.Brand as={Link} to="/Dashboard" style={customNavLinkStyle}></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/Dashboard" style={customNavLinkStyle}>Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/syndics" style={customNavLinkStyle}>Syndics</Nav.Link>
                <Nav.Link as={Link} to="/gardien" style={customNavLinkStyle}>Gardien</Nav.Link>
                <Nav.Link as={Link} to="/locateur" style={customNavLinkStyle}>Locateur</Nav.Link>
                <Nav.Link as={Link} to="/appartement_meuble" style={customNavLinkStyle}>Appartements et meuble</Nav.Link>
                <Nav.Link as={Link} to="/proprietaires" style={customNavLinkStyle}>Propriétaire</Nav.Link>
                <Nav.Link as={Link} to="/Payments" style={customNavLinkStyle}>Payment</Nav.Link>
                <Nav.Link as={Link} to="/Tache" style={customNavLinkStyle}>Tache</Nav.Link>
                <Nav.Link as={Link} to="/Annonce" style={customNavLinkStyle}>Annonce</Nav.Link>
              </Nav>
              
              <div>
                <Button
                  variant={buttonClicked ? "danger" : "outline-light"}
                  onClick={() => window.location.reload()}
                >
                  Log Out
                </Button>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Routes>
          <Route path="/locateur" element={<ListLocateur />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/syndics" element={<ListAdmin />} />
          <Route path="/gardien" element={<ListSyndic />} />
          <Route path="/appartement_meuble" element={<GesAppaMeuble />} />
          <Route path="/proprietaires" element={<ListPropriétaire />} />
          <Route path="/Payments" element={<Payments />} />
          <Route path="/Tache" element={<TacheList />} />
          <Route path="/Annonce" element={<ListAnnonceAdmine />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default NavBar;
