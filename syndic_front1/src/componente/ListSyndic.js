import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

function SyndicList() {
  const [syndics, setSyndics] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedSyndic, setSelectedSyndic] = useState(null);
  const [email, setEmail] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [statutDay, setStatutDay] = useState('');
  const [password, setPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);

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
  const handleShowUpdateModal = (syndic) => {
    setSelectedSyndic(syndic);
    setEmail(syndic.email);
    setNom(syndic.nom);
    setPrenom(syndic.prenom);
    if (syndic.password) {
      setPassword(syndic.password);
    } else {
      setPassword('');
    }
    setAdresse(syndic.adresse);
    setStatutDay(syndic.statut_day);
    setPasswordChanged(false);
    setShowUpdateModal(true);
  };

  useEffect(() => {
    fetchSyndics();
  }, []);

  const fetchSyndics = () => {
    axios
      .get('http://localhost:8080/syndics/all')
      .then((response) => {
        setSyndics(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAddSyndic = () => {
    if (!isValidEmail(email) ||  !isValidNom (nom) || !isValidNom (prenom) || !password || !adresse || !statutDay) {
      alert('Please fill in all required fields.');
      return;
    }

    const newSyndic = {
      email: email,
      nom: nom,
      prenom: prenom,
      password: password,
      adresse: adresse,
      statut_day: statutDay,
    };

    axios
      .post('http://localhost:8080/syndics/save', newSyndic)
      .then(() => {
        fetchSyndics();
        setEmail('');
        setNom('');
        setPrenom('');
        setPassword('');
        setAdresse('');
        setStatutDay('');
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

  const handleDeleteSyndic = (id) => {
    axios
      .delete(`http://localhost:8080/syndics/${id}`)
      .then(() => {
        fetchSyndics();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordChanged(true);
  };

  const handleUpdateSyndic = () => {
    if (!isValidEmail(email) || !nom || !prenom || !adresse || !statutDay) {
      alert('Please fill in all required fields.');
      return;
    }

    const updatedSyndic = {
      id: selectedSyndic.id,
      email: email,
      nom: nom,
      prenom: prenom,
      password: passwordChanged ? password : undefined,
      adresse: adresse,
      statut_day: statutDay,
    };

    axios
      .put(`http://localhost:8080/syndics/${selectedSyndic.id}`, updatedSyndic)
      .then(() => {
        fetchSyndics();
        setEmail('');
        setNom('');
        setPrenom('');
        setPassword('');
        setAdresse('');
        setStatutDay('');
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

  const containerStyle = {
    backgroundImage: 'url(/background.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
  };

  return (
    <div style={containerStyle}>
      <h1 className="text-center bg-dark text-light">Gardien</h1>
      <Container className="mt-4">
        <Button variant="primary" onClick={handleShowAddModal}>
          Add Gardien
        </Button>
        <div style={{ maxHeight: '500px', overflowY: 'scroll' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Adresse</th>
              <th>Statut Day</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {syndics.map((syndic) => (
              <tr key={syndic.id}>
                <td>{syndic.id}</td>
                <td>{syndic.email}</td>
                <td>{syndic.nom}</td>
                <td>{syndic.prenom}</td>
                <td>{syndic.adresse}</td>
                <td>{syndic.statut_day}</td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => handleShowUpdateModal(syndic)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteSyndic(syndic.id)}>
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
            <Modal.Title>Add Gardien</Modal.Title>
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
                onChange={(e) => handlePasswordChange(e.target.value)}
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
            <Form.Group controlId="formStatutDay">
              <Form.Label>Statut Day</Form.Label>
              <Form.Control
                as="select"
                value={statutDay}
                onChange={(e) => setStatutDay(e.target.value)}
              >
                <option value=""> type  Gardien</option>
                <option value="day">Day</option>
                <option value="night">Night</option>
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddSyndic}>
              Add Gardien
            </Button>
          </Modal.Footer>
        </Modal>

        {selectedSyndic && (
          <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
            <Modal.Header closeButton>
              <Modal.Title>Update Gardien</Modal.Title>
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
                  onChange={(e) => handlePasswordChange(e.target.value)}
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
              <Form.Group controlId="formStatutDay">
                <Form.Label>Statut Day</Form.Label>
                <Form.Control
                  as="select"
                  value={statutDay}
                  onChange={(e) => setStatutDay(e.target.value)}
                >
                  <option value=""> type Gardien</option>
                  <option value="day">Day</option>
                  <option value="night">Night</option>
                </Form.Control>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseUpdateModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdateSyndic}>
                Update Gardien
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Container>
    </div>
  );
}

export default SyndicList;
