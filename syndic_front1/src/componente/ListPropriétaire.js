import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

export default function ProprietaireList() {
  const [proprietaires, setProprietaires] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProprietaire, setSelectedProprietaire] = useState(null);
  const [email, setEmail] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [password, setPassword] = useState('');
  const [tele, setTele] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false); // Track password changes


   // Regular expressions for email and phone number validation
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   const phoneRegex = /^\d{10}$/;
   const nomRegex = /^[A-Za-z\s]+$/;
  

 
 
   const isValidEmail = (email) => {
     return email.match(emailRegex);
   };
   
   const isValidTele = (tele) => {
     return tele && tele.match(phoneRegex);
   };
  
   
   const isValidNom = (nom) => {
    return nom.match(nomRegex);
  };
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => setShowAddModal(true);

  const handleCloseUpdateModal = () => setShowUpdateModal(false);
  const handleShowUpdateModal = (proprietaire) => {
    setSelectedProprietaire(proprietaire);
    setUpdateEmail(proprietaire.email); // Utilisez setUpdateEmail pour mettre à jour l'e-mail
    setNom(proprietaire.nom);
    setPrenom(proprietaire.prenom);
    setPassword(''); // Reset the password field
    setTele(proprietaire.tele);
    setShowUpdateModal(true);
    setPasswordChanged(false); // Reset the passwordChanged flag
  };

  const containerStyle = {
    backgroundImage: 'url(/background.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
  };

  useEffect(() => {
    fetchProprietaires();
  }, []);

  const fetchProprietaires = () => {
    axios.get("http://localhost:8080/proprietaires/all")
      .then((response) => {
        setProprietaires(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAddProprietaire = () => {
    if (!isValidEmail(email)||  !isValidNom (nom) || !isValidNom (prenom) || !password || !isValidTele(tele)) {
      alert('Please fill in all required fields.');
      return;
    }

    const newProprietaire = {
      email: email,
      nom: nom,
      prenom: prenom,
      password: password,
      tele: tele,
    };

    axios.post("http://localhost:8080/proprietaires/save", newProprietaire)
      .then(() => {
        fetchProprietaires();
        setEmail('');
        setNom('');
        setPrenom('');
        setPassword('');
        setTele('');
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

  const handleDeleteProprietaire = (id) => {
    axios.delete(`http://localhost:8080/proprietaires/${id}`)
      .then(() => {
        fetchProprietaires();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleUpdateProprietaire = () => {
    if (!isValidNom(nom) || !isValidNom(prenom) || !tele) {
      alert('Please fill in all required fields.');
      return;
    }
  
    const updatedProprietaire = {
      id: selectedProprietaire.id,
      email: email, // Ne mettez pas de vérification ici
      nom: nom,
      prenom: prenom,
      // Only send the password if it has changed
      password: passwordChanged ? password : undefined,
      tele: tele,
    };
  
    axios.put(`http://localhost:8080/proprietaires/${selectedProprietaire.id}`, updatedProprietaire)
      .then(() => {
        fetchProprietaires();
        setEmail(''); // Réinitialisez l'e-mail ici, même s'il n'a pas été vérifié
        setNom('');
        setPrenom('');
        setPassword('');
        setTele('');
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
  

  // Handle changes to the password field
  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordChanged(true);
  };
    // Ajoutez un nouvel état pour l'e-mail dans le formulaire de mise à jour
    const [updateEmail, setUpdateEmail] = useState('');

  return (
    <div style={containerStyle}>
      <h1 className="text-center bg-dark text-light">Propriétaires</h1>
      <Container className="mt-4">
        <Button variant="primary" onClick={handleShowAddModal}>
          Add Propriétaire
        </Button>
        <div style={{ maxHeight: '600px', overflowY: 'scroll' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Nom</th>
              <th>Prenom</th>
              <th>Tele</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {proprietaires.map((proprietaire) => (
              <tr key={proprietaire.id}>
                <td>{proprietaire.id}</td>
                <td>{proprietaire.email}</td>
                <td>{proprietaire.nom}</td>
                <td>{proprietaire.prenom}</td>
                <td>{proprietaire.tele}</td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => handleShowUpdateModal(proprietaire)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteProprietaire(proprietaire.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div>
        <Modal show={showAddModal} onHide={handleCloseAddModal}>
  <Modal.Header closeButton>
    <Modal.Title>Add Propriétaire</Modal.Title>
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
    <Form.Group controlId="formTele">
                  <Form.Label>Téléphone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Téléphone"
                    value={tele}
                    onChange={(e) => setTele(e.target.value)}
                    isInvalid={!tele || !tele.match || !tele.match(phoneRegex)}  // Check against regex
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid 10-digit phone number.
                  </Form.Control.Feedback>
                </Form.Group>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseAddModal}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleAddProprietaire}>
      Add Propriétaire
    </Button>
  </Modal.Footer>
</Modal>


{selectedProprietaire && (
  <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
    <Modal.Header closeButton>
      <Modal.Title>Update Propriétaire</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form.Group controlId="formEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="text"
          placeholder="Email"
          value={updateEmail} // Utilisez updateEmail au lieu de email
          onChange={(e) => setUpdateEmail(e.target.value)} // Utilisez setUpdateEmail
          isInvalid={!updateEmail.match(emailRegex)} // Utilisez updateEmail
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
          onChange={(e) => handlePasswordChange(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formTele">
                  <Form.Label>Téléphone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Téléphone"
                    value={tele}
                    onChange={(e) => setTele(e.target.value)}
                  
                  />
               
                </Form.Group>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseUpdateModal}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleUpdateProprietaire}>
        Update Propriétaire
      </Button>
    </Modal.Footer>
  </Modal>
)}

      </Container>
    </div>
  );
}
