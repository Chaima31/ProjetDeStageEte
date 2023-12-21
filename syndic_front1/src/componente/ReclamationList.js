import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

function ReclamationList() {
  const [reclamations, setReclamations] = useState([]);
  const [locateurs, setLocateurs] = useState({});

  useEffect(() => {
    fetchReclamations();
    fetchLocateurs();
  }, []);

  const fetchReclamations = () => {
    axios.get("http://localhost:8080/reclamations/all")
      .then((response) => {
        setReclamations(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchLocateurs = () => {
    axios.get("http://localhost:8080/locateurs/all")
      .then((response) => {
        const locateursData = {};
        response.data.forEach((locateur) => {
          locateursData[locateur.id] = locateur;
        });
        setLocateurs(locateursData);
      })
      .catch((error) => {
        console.error("Error fetching locateurs:", error);
      });
  };

  const handleDeleteReclamation = (id) => {
    if (window.confirm("Are you sure you want to delete this reclamation?")) {
      axios.delete(`http://localhost:8080/reclamations/${id}`)
        .then(() => {
          fetchReclamations(); // Refresh the reclamation list after deletion
        })
        .catch((error) => {
          console.error("Error deleting reclamation:", error);
        });
    }
  };

  const handleReloadReclamations = () => {
    fetchReclamations(); // Reload the reclamation list
  };

  return (
    <Container>
      <h3 className=" mt-4">Reclamation List</h3>
      <Button variant="primary" onClick={handleReloadReclamations}>Reload</Button>{' '}
      <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Message</th>
              <th>Locateur Information</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reclamations.map((reclamation) => (
              <tr key={reclamation.id}>
                <td>{reclamation.id}</td>
                <td>{reclamation.message}</td>
                <td>
                  <ul>
                    <li>Email: {reclamation.locateur.email}</li>
                    <li>Name: {reclamation.locateur.nom} {reclamation.locateur.prenom}</li>
                    <li>Telephone: {reclamation.locateur.tele}</li>
                  </ul>
                </td>
                <td>
                  <Button variant="danger" onClick={() => handleDeleteReclamation(reclamation.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

export default ReclamationList;
