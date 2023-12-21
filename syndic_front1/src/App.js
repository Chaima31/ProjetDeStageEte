import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import NavBar from './componente/NavBar';
import DashboardLocateur from './componente/Locateur_dashboard';
import SyndicNavBar from './componente/NavBar_Syndic';
import Profile from './componente/Profile';
import PasswordReset from './componente/PasswordReset';
import './App.css';
// LoginForm Component
function LoginForm({ show, onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`http://localhost:8080/Personnes/connect/${email}/${password}`);
      const userType = response.data;

      if (userType) {
        onSubmit(userType, email);
      } else {
        alert('User not found! Try again.');
      }
    } catch (error) {
      console.error('Error fetching user type:', error);
    }
  };

  return (
    <Modal show={show} onHide={() => onSubmit(null)}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button className="mt-2" variant="primary" type="submit">
            Login
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

// App Component
// App Component
function App() {
  const [userType, setUserType] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [connectedProprietaireEmail, setConnectedProprietaireEmail] = useState(null);

  const handleLogin = (userType, email) => {
    setUserType(userType);
    setShowLoginForm(false);
    setConnectedProprietaireEmail(email);

    const audio = new Audio('/opendoor.mp3');
    audio.play();
  };

  useEffect(() => {
    if (!userType) {
      const audio = new Audio('/opendoor.mp3');
      audio.pause();
    }
  }, [userType]);

  const containerStyle = {
    backgroundImage: 'url(/homebg.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
  };

  const [showPasswordResetForm, setShowPasswordResetForm] = useState(false);

  const togglePasswordResetForm = () => {
    setShowPasswordResetForm(!showPasswordResetForm);
  };

  return (
    <div  style={containerStyle}>
      <div style={{ textAlign: 'center' }}>
        {userType === null && !showLoginForm && (
          <>
            <Button
              className="text-light"
              style={{ marginTop: '60px' }}
              variant="warning"
              onClick={() => setShowLoginForm(true)}
            >
              Login to Account <i className="bi bi-key ml-3"></i>
            </Button>
          </>
        )}
      </div>
      <div>
        {userType === 'Syndic' ? (
          <SyndicNavBar email={connectedProprietaireEmail} />
        ) : userType === 'Proprietaire' ? (
          <Profile email={connectedProprietaireEmail} />
        ) : userType === 'Admin' ? (
          <NavBar email={connectedProprietaireEmail} />
        ) : userType === 'Locateur' ? (
          <DashboardLocateur email={connectedProprietaireEmail} />
        ) : (
          userType === null && showLoginForm ? (
            <LoginForm show={true} onSubmit={handleLogin} />
          ) : (
            <>
              <div className="text-center mt-5">
                <h1 className="text-warning text-center">Welcome</h1>
                <p className="text-dark text-center">
                  Syndic App is a comprehensive platform for managing residential communities,
                </p>
                <p className="text-dark mt-10px text-center" >
                  providing all the necessary tools to efficiently handle various tasks related to
                  property management.
                </p>
                <p className="text-dark mt-10px text-center">
                  From managing tenants and owners to handling expenses and maintenance,
                </p>
                <p className="text-dark mt-10px text-center">
                  Syndic App streamlines the entire process, making it easier and more organized.
                </p>
              </div>
            </>
          )
        )}
      </div>
      <div className="text-center mt-3  text-light">
        {userType === null && (
          <Button className="mt-3 text-light" variant="danger" onClick={togglePasswordResetForm}>
            Forgot Password?
          </Button>
        )}
      </div>

      <Modal show={showPasswordResetForm} onHide={togglePasswordResetForm}>
        <Modal.Header closeButton>
          <Modal.Title >Forgot Password Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PasswordReset show={true} onClose={togglePasswordResetForm} />
        </Modal.Body>
      </Modal>
    </div>
  );
}


export default App;
