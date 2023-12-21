import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

function ListLocateur() {
  const [locateurs, setLocateurs] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedLocateur, setSelectedLocateur] = useState(null);
  const [email, setEmail] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [tele, setTele] = useState('');
  const [type, setType] = useState('');
  const [depense, setDepense] = useState('');
  const [password, setPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [vehicule, setVehicule] = useState(null); // Added vehicule state
  const [matricule, setMatricule] = useState(null); // Added matricule state

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
  const handleShowUpdateModal = (locateur) => {
    setSelectedLocateur(locateur);
    setEmail(locateur.email);
    setNom(locateur.nom);
    setPrenom(locateur.prenom);
    setTele(locateur.tele);
    setType(locateur.type);
    setDepense(locateur.depense);
    setVehicule(locateur.vehicule);
    setMatricule(locateur.matricule);
    if (locateur.password) {
      setPassword(locateur.password);
    } else {
      setPassword('');
    }
    setPasswordChanged(false);
    setShowUpdateModal(true);
  };

  useEffect(() => {
    fetchLocateurs();
  }, []);

  const fetchLocateurs = () => {
    axios.get("http://localhost:8080/locateurs/all")
      .then((response) => {
        setLocateurs(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAddLocateur = () => {
    if (!isValidEmail(email) || !isValidTele(tele) || !isValidNom(nom) || !isValidNom(prenom) || !password || !type || !depense) {
      alert('Please fill in all required fields with valid data.');
      return;
    }

    const newLocateur = {
      email: email,
      nom: nom,
      prenom: prenom,
      password: password,
      tele: tele,
      type: type,
      depense: depense,
      vehicule: vehicule,
      matricule: matricule
    };

   

    axios.post("http://localhost:8080/locateurs/save", newLocateur)
      .then(() => {
        fetchLocateurs();
        setEmail('');
        setNom('');
        setPrenom('');
        setTele('');
        setType('');
        setDepense('');
        setVehicule(null);
        setMatricule(null);
        setPassword('');
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

  const handleDeleteLocateur = (id) => {
    axios.delete(`http://localhost:8080/locateurs/${id}`)
      .then(() => {
        fetchLocateurs();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordChanged(true);
  };

  const handleUpdateLocateur = () => {
    if (!isValidEmail(email) || !tele || !isValidNom(nom) || !isValidNom(prenom) || !type || !depense) {
      alert('Please fill in all required fields with valid data.');
      return;
    }
   
    const updatedLocateur = {
      id: selectedLocateur.id,
      email: email,
      nom: nom,
      prenom: prenom,
      password: passwordChanged ? password : undefined,
      tele: tele,
      type: type,
      depense: depense,
      vehicule: vehicule,
      matricule: matricule
    };

    axios.put(`http://localhost:8080/locateurs/${selectedLocateur.id}`, updatedLocateur)
      .then(() => {
        fetchLocateurs();
        setEmail('');
        setNom('');
        setPrenom('');
        setTele('');
        setType('');
        setDepense('');
        setVehicule(null);
        setMatricule(null);
        setPassword('');
        handleCloseUpdateModal();
        console.log(updatedLocateur);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert('Email already exists.'); // Display the error message
        } else {
          console.error(error);
        }
      });

  };

  const containerStyle = {
    backgroundImage: 'url(/background.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
  };
  return (
    <div style={containerStyle}>
      <h1 className="text-center bg-dark text-light">Locateurs List</h1>
      <Container className="mt-4">
        <Button variant="primary" onClick={handleShowAddModal}>
          Add Locateur
        </Button>
        <div style={{ maxHeight: '600px', overflowY: 'scroll' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Téléphone</th>
              <th>Type</th>
              <th>Dépense</th>
              <th>Vehicule</th>
              <th>Matricule</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {locateurs.map((locateur) => (
              <tr key={locateur.id}>
                <td>{locateur.id}</td>
                <td>{locateur.email}</td>
                <td>{locateur.nom}</td>
                <td>{locateur.prenom}</td>
                <td>{locateur.tele}</td>
                <td>{locateur.type}</td>
                <td>{locateur.depense}</td>
                <td>{locateur.vehicule}</td>
                <td>{locateur.matricule}</td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => handleShowUpdateModal(locateur)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteLocateur(locateur.id)}>
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
            <Modal.Title>Add Locateur</Modal.Title>
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
            <Form.Group controlId="formType">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">Select type</option>
                <option value="Familial">Familial</option>
                <option value="Societe">Société</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formDepense">
              <Form.Label>Dépense</Form.Label>
              <Form.Control
                as="select"
                value={depense}
                onChange={(e) => setDepense(e.target.value)}
              >
                <option value="">Select Dépense</option>
                <option value="250">250</option>
                <option value="300">300</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formVehicule">
              <Form.Label>Vehicule</Form.Label>
              <Form.Control
                type="text"
                placeholder="Vehicule"
                value={vehicule}
                onChange={(e) => setVehicule(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formMatricule">
              <Form.Label>Matricule</Form.Label>
              <Form.Control
                type="text"
                placeholder="Matricule"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
              />
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddLocateur}>
              Add Locateur
            </Button>
          </Modal.Footer>
        </Modal>

        {selectedLocateur && (
          <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
            <Modal.Header closeButton>
              <Modal.Title>Update Locateur</Modal.Title>
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
              <Form.Group controlId="formTele">
                <Form.Label>Téléphone</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Téléphone"
                  value={tele}
                  onChange={(e) => setTele(e.target.value)}
                 
                />
              
              </Form.Group>
              <Form.Group controlId="formType">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  as="select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="">Select type</option>
                  <option value="Familial">Familial</option>
                  <option value="Societe">Société</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formDepense">
                <Form.Label>Dépense</Form.Label>
                <Form.Control
                  as="select"
                  value={depense}
                  onChange={(e) => setDepense(e.target.value)}
                >
                  <option value="">Select Dépense</option>
                  <option value="250">250</option>
                  <option value="300">300</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formVehicule">
                <Form.Label>Vehicule</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Vehicule"
                  value={vehicule}
                  onChange={(e) => setVehicule(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formMatricule">
                <Form.Label>Matricule</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Matricule"
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseUpdateModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdateLocateur}>
                Update Locateur
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Container>
    </div>
  );
}

export default ListLocateur;
