import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

export default function ListMeuble() {
  const [meubles, setMeubles] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedMeuble, setSelectedMeuble] = useState(null);
  const [nom, setNom] = useState('');
  const [syndic_day_id, setSyndicDayId] = useState('');
  const [syndic_night_id, setSyndicNightId] = useState('');
  const [syndicDayOptions, setSyndicDayOptions] = useState([]);
  const [syndicNightOptions, setSyndicNightOptions] = useState([]);

  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => {
    fetchSyndics();
    setShowAddModal(true);
  };

  const handleCloseUpdateModal = () => setShowUpdateModal(false);
  const handleShowUpdateModal = (meuble) => {
    setSelectedMeuble(meuble);
    setNom(meuble.nom);
    setSyndicDayId(meuble.syndic_day_id);
    setSyndicNightId(meuble.syndic_night_id);
    setShowUpdateModal(true);
  };

  useEffect(() => {
    fetchMeubles();
    fetchSyndics();
  }, []);

  const fetchMeubles = () => {
    axios.get("http://localhost:8080/meubles/all")
      .then((response) => {
        setMeubles(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchSyndics = () => {
    axios.get("http://localhost:8080/syndics/all")
      .then((response) => {
        const filteredSyndicDay = response.data.filter(syndic => syndic.statut_day === "day");
        const filteredSyndicNight = response.data.filter(syndic => syndic.statut_day === "night");
        setSyndicDayOptions(filteredSyndicDay);
        setSyndicNightOptions(filteredSyndicNight);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAddMeuble = () => {
    if (!nom || !syndic_day_id || !syndic_night_id) {
      alert('Please fill in all required fields.');
      return;
    }

    const newMeuble = {
      nom: nom,
      syndic_day_Id: syndic_day_id,
      syndic_night_Id: syndic_night_id,
    };

    axios.post("http://localhost:8080/meubles/save", newMeuble)
      .then(() => {
        fetchMeubles();
        setNom('');
        setSyndicDayId('');
        setSyndicNightId('');
        handleCloseAddModal();
        window.location.reload(); // Reload the page
      })
      .catch((error) => {
        console.error(error);
      });
      
  };
  

  const handleDeleteMeuble = (id) => {
    axios.delete(`http://localhost:8080/meubles/delete/${id}`)
      .then(() => {
        fetchMeubles();
      })
      .catch((error) => {
        console.error(error);
        alert("This Meuble is not empty and cannot be deleted.");
      });
  };

  const handleUpdateMeuble = () => {
    if (!nom || !syndic_day_id || !syndic_night_id) {
      alert('Please fill in all required fields.');
      return;
    }

    const updatedMeuble = {
      id: selectedMeuble.id,
      nom: nom,
      syndic_day_Id: syndic_day_id,
      syndic_night_Id: syndic_night_id,
    };
// HHHHHHHHHHHHHHHHHHHHHHH
    axios.put(`http://localhost:8080/meubles/${selectedMeuble.id}`, updatedMeuble)
      .then(() => {
        fetchMeubles();
        setNom('');
        setSyndicDayId('');
        setSyndicNightId('');
        handleCloseUpdateModal();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1 className="text-center bg-dark text-light">Meubles</h1>
      <Container className="mt-4">
      
          <div class="alert alert-warning" role="alert">
            <i class="bi bi-exclamation-triangle"></i> Avant  de  créer  un  meuble  ,  vous devez  ajouter  un  gardien  de  nuit  et  de  jour , merci  <i class="bi bi-emoji-smile"></i> .
          </div>
        

        <Button variant="primary" onClick={handleShowAddModal}>
          Add Meuble
        </Button>
        <div style={{ maxHeight: '500px', overflowY: 'scroll' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom Bloc</th>
              <th>Gardien Day </th>
              <th>Gardien Night </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {meubles.map((meuble) => (
              <tr key={meuble.id}>
                <td>{meuble.id}</td>
                <td>{meuble.nom}</td>
                
                <td>
                {syndicDayOptions.find((syndic) => syndic.id === meuble.syndic_day_Id)?.nom || '-'}
              </td>
              <td>
                {syndicNightOptions.find((syndic) => syndic.id === meuble.syndic_night_Id)?.nom || '-'}
              </td>
              <td>
                  <Button variant="primary" size="sm" onClick={() => handleShowUpdateModal(meuble)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteMeuble(meuble.id)}>
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
            <Modal.Title>Add Meuble</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formNom">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formSyndicDayId">
              <Form.Label>Gardien Day ID</Form.Label>
              <Form.Control
                as="select"
                value={syndic_day_id}
                onChange={(e) => setSyndicDayId(e.target.value)}
              >
                <option value="">Select a Gardien Day </option>
                {syndicDayOptions.map((syndic) => (
                  <option key={syndic.id} value={syndic.id}>
                    {syndic.id}  -{syndic.nom} 
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formSyndicNightId">
              <Form.Label>Gardien Night ID</Form.Label>
              <Form.Control
                as="select"
                value={syndic_night_id}
                onChange={(e) => setSyndicNightId(e.target.value)}
              >
                <option value="">Select a Gardien Night ID</option>
                {syndicNightOptions.map((syndic) => (
                  <option key={syndic.id} value={syndic.id}>
                   {syndic.id}  -{syndic.nom} 
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddMeuble}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        {selectedMeuble && (
          <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
            <Modal.Header closeButton>
              <Modal.Title>Update Meuble</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId="formNom">
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formSyndicDayId">
                <Form.Label>Gardien Day ID</Form.Label>
                <Form.Control
                  as="select"
                  value={syndic_day_id}
                  onChange={(e) => setSyndicDayId(e.target.value)}
                >
                  <option value="">Select a Gardien Day </option>
                  {syndicDayOptions.map((syndic) => (
                    <option key={syndic.id} value={syndic.id}>
                      {syndic.id}  -{syndic.nom} 
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formSyndicNightId">
                <Form.Label>Gardien Night ID</Form.Label>
                <Form.Control
                  as="select"
                  value={syndic_night_id}
                  onChange={(e) => setSyndicNightId(e.target.value)}
                >
                  <option value="">Select a Gardien Night ID</option>
                  {syndicNightOptions.map((syndic) => (
                    <option key={syndic.id} value={syndic.id}>
                      {syndic.id}  -{syndic.nom} 
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseUpdateModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdateMeuble}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Container>
    </div>
  );
}
