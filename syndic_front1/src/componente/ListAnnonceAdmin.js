import React, { useEffect, useState, useCallback } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

function ListAnnonceAdmine() {
  const [annonces, setAnnonces] = useState([]);

  const fetchData = useCallback(() => {
    fetch('http://localhost:8080/annonces/all')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setAnnonces(data);
      });
  }, []);

  useEffect(() => {
    fetchData(); // Initial data fetch when the component mounts
  }, [fetchData]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this announcement?');

    if (confirmDelete) {
      fetch(`http://localhost:8080/annonces/${id}`, {
        method: 'DELETE',
      })
        .then(() => {
          // Refresh the list of announcements after deletion
          fetchData();
        })
        .catch((error) => {
          console.error('Error deleting announcement:', error);
        });
    }
  };

  const containerStyle = {
    backgroundImage: 'url(/background.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
  };

  return (
    <div style={containerStyle}>
     
      <Container className="mt-6">
      <h1 className="text-center bg-dark text-light mt-4">Annonce List</h1>
      <div style={{ maxHeight: '600px', overflowY: 'scroll' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th className="text-primary">ID</th>
              <th className="text-primary">Message</th>
              <th className="text-primary">File</th>
              <th className="text-primary">Delete</th>
            </tr>
          </thead>
          <tbody>
            {annonces.map((annonce) => (
              <tr key={annonce.id}>
                <td>{annonce.id}</td>
                <td>{annonce.message}</td>
                <td>{annonce.filenam}</td>
                <td>
                  <Button variant="danger" onClick={() => handleDelete(annonce.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div>
      </Container>
    </div>
  );
}

export default ListAnnonceAdmine;
