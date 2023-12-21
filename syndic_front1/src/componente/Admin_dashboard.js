import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import CreateAnnonce from './CreateAnnonce';
import MeublesComponent from './Meuble_Appa';
import TableTachet from './TableTache';
import 'react-datepicker/dist/react-datepicker.css';
import './Dashboard.css';
import ReclamationWebSocket from './ReclamationWebSocket';
import ReclamationList from './ReclamationList';

const containerStyle = {
  backgroundImage: 'url(/background.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
};

const containerStyle2 = {
  background: 'rgba(255, 255, 255, 0.3)',
  minHeight: '100vh',
  paddingTop: '20px', // Espace en haut pour séparer du haut de la page
};

const Dashboard = () => {
  const [counts, setCounts] = useState({
    syndics: 0,
    proprietaires: 0,
    appartements: 0,
    meubles: 0,
    paiements: 0,
    locateurs: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Promise.all([
          axios.get('http://localhost:8080/syndics/count'),
          axios.get('http://localhost:8080/proprietaires/count'),
          axios.get('http://localhost:8080/appartements/count'),
          axios.get('http://localhost:8080/meubles/count'),
          axios.get('http://localhost:8080/paiements/count'),
          axios.get('http://localhost:8080/locateurs/count'),
        ]);

        const [syndics, proprietaires, appartements, meubles, paiements, locateurs] = response.map(
          (res) => res.data
        );

        setCounts({
          syndics,
          proprietaires,
          appartements,
          meubles,
          paiements,
          locateurs,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const [showCreateAnnonceModal, setShowCreateAnnonceModal] = useState(false);

  const openCreateAnnonceModal = () => {
    setShowCreateAnnonceModal(true);
  };

  const closeCreateAnnonceModal = () => {
    setShowCreateAnnonceModal(false);
  };

  return (
    <div style={containerStyle}>
      <nav className="navbar navbar-dark bg-dark margin-Left-5">
        <span className="navbar-brand mb-0 h1">
          <i className="bi bi-border-style"> Syndic Dashboard</i>
        </span>
      </nav>
      <Container style={containerStyle2}>
        <div className="row">
          <div className="col-md-2">
            <div className="card text-white shake" style={{ backgroundColor: "#186F65" }}>
              <div className="card-body">
                <h4 className="card-text">Gardiens</h4>
                <h2 className="card-title">
                  <i className="bi bi-person-workspace"></i> {counts.syndics}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card text-white shake" style={{ backgroundColor: "#BCA37F" }}>
              <div className="card-body">
                <h4 className="card-text">Proprietaires</h4>
                <h2 className="card-title">
                  <i className="bi bi-person-vcard-fill"></i> {counts.proprietaires}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card text-white shake" style={{ backgroundColor: "#B4B4B3" }}>
              <div className="card-body">
                <h4 className="card-text">Locateurs</h4>
                <h2 className="card-title">
                  <i className="bi bi-person"></i>
                  {counts.locateurs}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card text-white shake" style={{ backgroundColor: "#26577C" }}>
              <div className="card-body">
                <h4 className="card-text">Appartements</h4>
                <h2 className="card-title">
                  <i className="bi bi-house"></i> {counts.appartements}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card text-white shake" style={{ backgroundColor: "#113946" }}>
              <div className="card-body">
                <h4 className="card-text">Meubles</h4>
                <h2 className="card-title">
                  <i className="bi bi-building"></i> {counts.meubles}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card text-white shake" style={{ backgroundColor: "#B2533E" }}>
              <div className="card-body">
                <h4 className="card-text">Paiements</h4>
                <h2 className="card-title">
                  <i className="bi bi-credit-card"></i> {counts.paiements}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-4 shake'>
          <ReclamationWebSocket/>
        </div>
       
        <div className="row justify-content-center  mt-2">
          <div className="col-md-12">
            <div className="card text-light mt-4 shake">
              <Button onClick={openCreateAnnonceModal}  style={{ border:'none',backgroundColor: "#FF8551" }}>
                Create Announcement
              </Button>
              <Modal
                show={showCreateAnnonceModal}
                onHide={closeCreateAnnonceModal}
              >
                <Modal.Header closeButton  style={{backgroundColor: "#FF8551" }}>
                  <Modal.Title className='text-light' >  Create Announce</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                  <CreateAnnonce />
                </Modal.Body>
              </Modal>
            </div>
          </div>
        </div>
        {/* Other components */}
        <div className="row justify-content-center mt-2">
          <div className="col-md-12">
            <div className="card  mt-4 shake" style={containerStyle2}>
              <MeublesComponent />
            </div>
          </div>
        </div>
        <div className="row justify-content-center mt-2 ">
          <div className="col-md-12">
            <div className="card text-light mt-4 shake" style={containerStyle2}>
              <TableTachet />
            </div>
          </div>
        </div>
        <div className="row justify-content-center mt-2 ">
          <div className="col-md-12">
            <div className="card text-dark mt-4  shake" style={containerStyle2}>
               <ReclamationList /> 
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
