import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

export default function ListAdmin() {
  const [admins, setAdmins] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [email, setEmail] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [password, setPassword] = useState('');
  const [adresse, setAdresse] = useState('');


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nomRegex = /^[A-Za-z\s]+$/;
  

  const isValidEmail = (email) => {
    return email.match(emailRegex);
  };
  const isValidNom = (nom) => {
    return nom.match(nomRegex);
  };

  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => setShowAddModal(true);

  const handleCloseUpdateModal = () => setShowUpdateModal(false);
  const handleShowUpdateModal = (admin) => {
    setSelectedAdmin(admin);
    setEmail(admin.email);
    setNom(admin.nom);
    setPrenom(admin.prenom);
    setPassword(admin.password);
    setAdresse(admin.adresse);
    setShowUpdateModal(true);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const containerStyle = {
    backgroundImage: 'url(/background.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
  };

  const fetchAdmins = () => {
    axios.get("http://localhost:8080/admins/all")
      .then((response) => {
        setAdmins(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAddAdmin = () => {
    if (!isValidEmail(email) || !isValidNom (nom) || !isValidNom (prenom) || !adresse) {
      alert('Please fill in all required fields.');
      return;
    }

    const newAdmin = {
      email: email,
      nom: nom,
      prenom: prenom,
      password: password,
      adresse: adresse,
    };

    axios.post("http://localhost:8080/admins/save", newAdmin)
      .then(() => {
        fetchAdmins();
        setEmail('');
        setNom('');
        setPrenom('');
        setPassword('');
        setAdresse('');
        handleCloseAddModal();
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert('Email already exists.'); // Display the error message
        } else {
          console.error(error);
        }
      });
  };

  const handleDeleteAdmin = (id) => {
    axios.delete(`http://localhost:8080/admins/${id}`)
      .then(() => {
        fetchAdmins();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleUpdateAdmin = () => {
    if (!isValidEmail(email) || !isValidNom(nom) || !isValidNom(prenom) || !adresse) {
      alert('Please fill in all required fields.');
      return;
    }
  
    const updatedAdmin = {
      id: selectedAdmin.id,
      email: email,
      nom: nom,
      prenom: prenom,
      // Only send the password if it's changed
      password: password !== selectedAdmin.password ? password : undefined,
      adresse: adresse,
    };
  
    axios
      .put(`http://localhost:8080/admins/${selectedAdmin.id}`, updatedAdmin)
      .then(() => {
        fetchAdmins();
        setEmail('');
        setNom('');
        setPrenom('');
        setPassword('');
        setAdresse('');
        handleCloseUpdateModal();
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert('Email already exists.'); // Display the error message
        } else {
          console.error(error);
        }
      });
  };
  

  return (
    <div style={containerStyle}>
      <h1 className="text-center bg-dark text-light">Syndic</h1>
      <Container className="mt-4">
        <Button variant="primary" onClick={handleShowAddModal}>
          Add Syndic
        </Button>
        <div style={{ maxHeight: '600px', overflowY: 'scroll' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Adresse</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.email}</td>
                <td>{admin.nom}</td>
                <td>{admin.prenom}</td>
                <td>{admin.adresse}</td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => handleShowUpdateModal(admin)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteAdmin(admin.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div >
        <Modal show={showAddModal} onHide={handleCloseAddModal}>
        
  <Modal.Header closeButton>
    <Modal.Title>Add Syndic</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form.Group controlId="formEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isInvalid={!email.match(emailRegex)}  // Check against regex
        />
        <Form.Control.Feedback type="invalid">
          Please enter a valid email address.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="formNom">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                 isInvalid={!nom.match(nomRegex)}  // Check against regex
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid nom address.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formPrenom">
                <Form.Label>Prénom</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Prénom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  isInvalid={!prenom.match(nomRegex)}  // Check against regex
                 />
                 <Form.Control.Feedback type="invalid">
                   Please enter a valid prenom address.
                 </Form.Control.Feedback>
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
    <Form.Group controlId="formAdresse">
      <Form.Label>Adresse</Form.Label>
      <Form.Control
        type="text"
        placeholder="Adresse"
        value={adresse}
        onChange={(e) => setAdresse(e.target.value)}
      />
    </Form.Group>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseAddModal}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleAddAdmin}>
      Add Syndic
    </Button>
  </Modal.Footer>
</Modal>

        

        {selectedAdmin && (
  <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
    <Modal.Header closeButton>
      <Modal.Title>Update Syndic</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <Form.Group controlId="formEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isInvalid={!email.match(emailRegex)}  // Check against regex
        />
        <Form.Control.Feedback type="invalid">
          Please enter a valid email address.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="formNom">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                 isInvalid={!nom.match(nomRegex)}  // Check against regex
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid nom address.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formPrenom">
                <Form.Label>Prénom</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Prénom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  isInvalid={!prenom.match(nomRegex)}  // Check against regex
                 />
                 <Form.Control.Feedback type="invalid">
                   Please enter a valid prenom address.
                 </Form.Control.Feedback>
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
      <Form.Group controlId="formAdresse">
        <Form.Label>Adresse</Form.Label>
        <Form.Control
          type="text"
          placeholder="Adresse"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
        />
      </Form.Group>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseUpdateModal}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleUpdateAdmin}>
        Update Syndic
      </Button>
    </Modal.Footer>
  </Modal>
)}

      </Container>
    </div>
  );
}
