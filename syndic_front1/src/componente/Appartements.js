import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

export default function Appartements() {
  const [appartements, setAppartements] = useState([]);
  const [proprietaires, setProprietaires] = useState([]);
  const [meubles, setMeubles] = useState([]);
  const [locateurs, setLocateurs] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedAppartement, setSelectedAppartement] = useState(null);
  const [numero, setNumero] = useState('');
  const [proprietaireId, setProprietaireId] = useState('');
  const [meubleId, setMeubleId] = useState('');
  const [locateurId, setLocateurId] = useState('');

  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => setShowAddModal(true);

  const handleCloseUpdateModal = () => setShowUpdateModal(false);
  const handleShowUpdateModal = (appartement) => {
    setSelectedAppartement(appartement);
    setNumero(appartement.numero);
    setProprietaireId(appartement.proprietaire ? appartement.proprietaire.id : '');
    setMeubleId(appartement.meuble ? appartement.meuble.id : '');
    setLocateurId(appartement.locateur ? appartement.locateur.id : '');
    setShowUpdateModal(true);
  };

  useEffect(() => {
    fetchAppartements();
    fetchProprietaires();
    fetchMeubles();
    fetchLocateurs();
  }, []);

  const fetchAppartements = () => {
    axios
      .get('http://localhost:8080/appartements/all')
      .then((response) => {
        setAppartements(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchProprietaires = () => {
    axios
      .get('http://localhost:8080/proprietaires/all')
      .then((response) => {
        setProprietaires(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchMeubles = () => {
    axios
    
      .get('http://localhost:8080/meubles/all')
      .then((response) => {
        setMeubles(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchLocateurs = () => {
    axios
      .get('http://localhost:8080/locateurs/locateurs-not-located')
      .then((response) => {
        setLocateurs(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAddAppartement = () => {
    if (!numero || !proprietaireId || !meubleId) {
      console.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }
  
    const newAppartement = {
      numero: Number(numero),
      proprietaire: {
        id: Number(proprietaireId),
      },
      meuble: {
        id: Number(meubleId),
      },
      locateur: locateurId ? { id: Number(locateurId) } : null,
    };
  
    axios
      .post('http://localhost:8080/appartements/save', newAppartement)
      .then(() => {
        fetchAppartements();
        setNumero('');
        setProprietaireId('');
        setMeubleId('');
        setLocateurId('');
        handleCloseAddModal();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeleteAppartement = (id) => {
    axios
      .delete(`http://localhost:8080/appartements/${id}`)
      .then(() => {
        fetchAppartements();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleUpdateAppartement = () => {
    if (!numero || !proprietaireId || !meubleId) {
      console.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }
  
    const updatedAppartement = {
      id: selectedAppartement.id,
      numero: Number(numero),
      proprietaire: {
        id: Number(proprietaireId),
      },
      meuble: {
        id: Number(meubleId),
      },
      locateur: locateurId ? { id: Number(locateurId) } : null,
    };
  
    axios
      .put(`http://localhost:8080/appartements/${selectedAppartement.id}`, updatedAppartement)
      .then(() => {
        fetchAppartements();
        setNumero('');
        setProprietaireId('');
        setMeubleId('');
        setLocateurId('');
        handleCloseUpdateModal();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div>
      <h1 className="text-center bg-dark text-light">Appartements</h1>
      <Container className="mt-4">
        <div class="alert alert-warning" role="alert">
          <i class="bi bi-exclamation-triangle"></i> Avant de créer une appartement, vous devez ajouter un propriétaire, meuble, locateur , merci <i class="bi bi-emoji-smile"></i>.
        </div>

        <Button variant="primary"  onClick={handleShowAddModal}>
          Add Appartement
        </Button>
        <div style={{ maxHeight: '500px', overflowY: 'scroll' }}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Appartment N°</th>
                <th>Meuble</th>
                <th>Propriétaires</th>
                <th>Locateur</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appartements.map((appartement) => (
                <tr key={appartement.id}>
                  <td>{appartement.id}</td>
                  <td>{appartement.numero}</td>
                  <td>{`Bloc ${appartement.meuble?.nom ?? 'N/A'}`}</td>
                  <td>{appartement.proprietaire?.nom ?? 'N/A'}</td>
                  <td>{appartement.locateur?.nom ?? 'N/A'}</td>
                  <td>
                    <Button variant="primary" size="sm" onClick={() => handleShowUpdateModal(appartement)}>
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteAppartement(appartement.id)}>
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
            <Modal.Title>Add Appartement</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formNumero">
              <Form.Label>Appartment Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Appartment Number"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formProprietaireId">
              <Form.Label>Propriétaire ID</Form.Label>
              <Form.Control as="select" value={proprietaireId} onChange={(e) => setProprietaireId(e.target.value)}>
                <option value="">Select Proprietaire</option>
                {proprietaires.map((proprietaire) => (
                  <option key={proprietaire.id} value={proprietaire.id}>
                    {proprietaire.id}-{proprietaire.nom}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formMeubleId">
              <Form.Label>Meuble ID</Form.Label>
              <Form.Control as="select" value={meubleId}  onChange={(e) => setMeubleId(e.target.value)}>
                <option value="">Select Meuble</option>
                {meubles.map((meuble) => (
                  <option key={meuble.id} value={meuble.id}>
                    {meuble.id}-{meuble.nom}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formLocateurId">
              <Form.Label>Locateur ID (facultatif)</Form.Label>
              <Form.Control as="select" value={locateurId} onChange={(e) => setLocateurId(e.target.value)}>
                <option value="">Sélectionnez un Locateur (facultatif)</option>
                {locateurs.map((locateur) => (
                  <option key={locateur.id} value={locateur.id}>
                    {locateur.id}-{locateur.nom}
                  </option>
                ))}
            </Form.Control>
</Form.Group>


          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddAppartement}>
              Add Appartement
            </Button>
          </Modal.Footer>
        </Modal>

        {selectedAppartement && (
          <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
            <Modal.Header closeButton>
              <Modal.Title>Update Appartement</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId="formNumero">
                <Form.Label>Apartment Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Apartment Number"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formProprietaireId">
                <Form.Label>Propriétaire ID</Form.Label>
                <Form.Control as="select" value={proprietaireId} onChange={(e) => setProprietaireId(e.target.value)}>
                  <option value="">Select Proprietaire</option>
                  {proprietaires.map((proprietaire) => (
                    <option key={proprietaire.id} value={proprietaire.id}>
                      {proprietaire.id}-{proprietaire.nom}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formMeubleId">
                <Form.Label>Meuble ID</Form.Label>
                <Form.Control as="select" value={meubleId} onChange={(e) => setMeubleId(e.target.value)}>
                  <option value="">Select Meuble</option>
                  {meubles.map((meuble) => (
                    <option key={meuble.id} value={meuble.id}>
                      {meuble.id}-{meuble.nom}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formLocateurId">
                <Form.Label>Locateur ID</Form.Label>
                <Form.Control as="select" value={locateurId} onChange={(e) => setLocateurId(e.target.value)}>
                  <option value="">Select Locateur</option>
                  {locateurs.map((locateur) => (
                    <option key={locateur.id} value={locateur.id}>
                      {locateur.id}-{locateur.nom}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseUpdateModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdateAppartement}>
                Update Appartement
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Container>
    </div>
  );
}
