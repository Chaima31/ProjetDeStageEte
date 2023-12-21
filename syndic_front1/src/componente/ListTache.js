import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



export default function TacheList() {
  const [taches, setTaches] = useState([]);
  const [syndics, setSyndics] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTache, setSelectedTache] = useState(null);
  const [description, setDescription] = useState('');
  const [datedebut, setDatedebut] = useState('');
  const [datedefin, setDatedefin] = useState('');
  const [selectedSyndic, setSelectedSyndic] = useState('');
  const [etat, setEtat] = useState('no termine');

  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => setShowAddModal(true);

  const handleCloseUpdateModal = () => setShowUpdateModal(false);
  const handleShowUpdateModal = (tache) => {  
    setSelectedTache(tache);
    setDescription(tache.description);
    setDatedebut(tache.datedebut);
    setDatedefin(tache.datedefin);
    setSelectedSyndic(tache.syndic_id);
    setEtat(tache.etat);
    setShowUpdateModal(true);
  };

  useEffect(() => {
    fetchTaches();
    fetchSyndics();
  }, []);

  const fetchTaches = () => {
    axios.get("http://localhost:8080/taches/all")
      .then((response) => {
        setTaches(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchSyndics = () => {
    axios.get("http://localhost:8080/syndics/all")
      .then((response) => {
        setSyndics(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAddTache = () => {
    if (!description || !datedebut || !datedefin || !selectedSyndic) {
      alert('Please fill in all required fields.');
      return;
    }

    const newTache = {
      description: description,
      datedebut: datedebut,
      datedefin: datedefin,
      syndic_id: selectedSyndic,
      etat: "no termine",
    };
    console.log("datedebut:", datedebut);
console.log("datedefin:", datedefin);


    axios.post("http://localhost:8080/taches/save", newTache)
      .then(() => {
        fetchTaches();
        setDescription('');
        setDatedebut('');
        setDatedefin('');
        setSelectedSyndic('');
        setEtat('no termine');
        handleCloseAddModal();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleUpdateTache = () => {
    if (!description || !datedebut || !datedefin || !selectedSyndic) {
      alert('Please fill in all required fields.');
      return;
    }

    const updatedTache = {
      id: selectedTache.id,
      description: description,
      datedebut: datedebut,
      datedefin: datedefin,
      syndic_id: selectedSyndic,
      etat: etat,
    };
    console.log(datedebut);
    console.log(datedefin);

    axios.put(`http://localhost:8080/taches/${selectedTache.id}`, updatedTache)
      .then(() => {
        fetchTaches();
        setDescription('');
        setDatedebut('');
        setDatedefin('');
        setSelectedSyndic('');
        setEtat('no termine');
        handleCloseUpdateModal();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeleteTache = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (confirmDelete) {
      axios.delete(`http://localhost:8080/taches/${id}`)
        .then(() => {
          fetchTaches();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const findSyndicName = (syndicId) => {
    const foundSyndic = syndics.find((syndic) => syndic.id === syndicId);
    return foundSyndic ? foundSyndic.nom : 'Unknown Syndic';
  };

  const containerStyle = {
    backgroundImage: 'url(/background.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
  };
  
  

  return (
    <div style={containerStyle}>
      <h1 className="text-center bg-dark text-light">Tâches</h1>
      <Container className="mt-4">
        <Button variant="primary" onClick={handleShowAddModal}>
          Add Tâche
        </Button>
        <div style={{ maxHeight: '600px', overflowY: 'scroll' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Date Début</th>
              <th>Date Fin</th>
              <th>Gardien</th>
              <th>État</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {taches.map((tache) => (
              <tr key={tache.id}>
                <td>{tache.id}</td>
                <td>{tache.description}</td>
                <td>{tache.datedebut}</td>
                <td>{tache.datedefin}</td>
                <td>{findSyndicName(tache.syndic_id)}</td>
                <td>{tache.etat}</td>
                <td>
                  <Button variant="primary" size="sm" onClick={() => handleShowUpdateModal(tache)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteTache(tache.id)}>
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
            <Modal.Title>Add Tâche</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formDatedebut">
              <Form.Label>Date Début</Form.Label>
              <DatePicker
             selected={datedebut}
             onChange={(date) => setDatedebut(date)}
             dateFormat="yyyy-MM-dd" // You can adjust the date format as needed
              />

            </Form.Group>
            <Form.Group controlId="formDatedefin">
              <Form.Label>Date Fin</Form.Label>
              <DatePicker
              selected={datedefin}
              onChange={(date) => setDatedefin(date)}
             dateFormat="yyyy-MM-dd" // You can adjust the date format as needed
             />

            </Form.Group>
            <Form.Group controlId="formSyndic">
              <Form.Label>Gardien</Form.Label>
              <Form.Control
                as="select"
                value={selectedSyndic}
                onChange={(e) => setSelectedSyndic(e.target.value)}
              >
                <option value="">Select Gardien</option>
                {syndics.map((syndic_id) => (
                  <option key={syndic_id.id} value={syndic_id.id}>
                    {syndic_id.id}-{syndic_id.nom}</option>
                ))}
              </Form.Control>
            </Form.Group>
          
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddTache}>
              Add Tâche
            </Button>
          </Modal.Footer>
        </Modal>

        {selectedTache && (
         <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
         <Modal.Header closeButton>
           <Modal.Title>Update Tâche</Modal.Title>
         </Modal.Header>
         <Modal.Body>
           <Form.Group controlId="formDescription">
             <Form.Label>Description</Form.Label>
             <Form.Control
               type="text"
               placeholder="Description"
               value={description}
               onChange={(e) => setDescription(e.target.value)}
             />
           </Form.Group>
         
           <Form.Group controlId="formDatedebut">
              <Form.Label>Date Début</Form.Label>
             
             
               <Form.Control
               type="text"
               placeholder="formDatedebut"
               value={datedebut}
               onChange={(e) => setDatedebut(e.target.value)}
             />
            
            </Form.Group>
            <Form.Group controlId="formDatedefin">
              <Form.Label>Date Fin</Form.Label>
             
             
               <Form.Control
               type="text"
               placeholder="formDatedefin"
               value={datedefin}
               onChange={(e) => setDatedefin(e.target.value)}
             />
            
            </Form.Group>
           <Form.Group controlId="formSyndic">
             <Form.Label>Gardien</Form.Label>
             <Form.Control
               as="select"
               value={selectedSyndic}
               onChange={(e) => setSelectedSyndic(e.target.value)}
             >
               <option value="">Select Syndic</option>
               {syndics.map((syndic_id) => (
                 <option key={syndic_id.id} value={syndic_id.id}>
                  {syndic_id.id}-{syndic_id.nom}
                 </option>
               ))}
             </Form.Control>
           </Form.Group>
           <Form.Group controlId="formEtat">
              <Form.Label>Montant</Form.Label>
              <Form.Control
                as="select"
                value={etat}
                onChange={(e) => setEtat(e.target.value)}
              >
                <option value="">Select Etat</option>
                <option value="no termine">no termine</option>
                <option value="termine">termine</option>
              </Form.Control>
            </Form.Group>
         </Modal.Body>
         <Modal.Footer>
           <Button variant="secondary" onClick={handleCloseUpdateModal}>
             Cancel
           </Button>
           <Button variant="primary" onClick={handleUpdateTache}>
             Update Tâche
           </Button>
         </Modal.Footer>
       </Modal>
        )}

      </Container>
    </div>
  );
}
