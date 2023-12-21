import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MeublesComponent from './Meuble_Appa';
import TableTacheSyndic from './TableTacheSyndic';



const containerStyle = {
  backgroundImage: 'url(/background.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100%',
};

const containerStyle2 = {
  background: 'rgba(255, 255, 255, 0.2)', // Background with 20% opacity (glass-like)
  minHeight: '100%',
};

// Rename your component to start with an uppercase letter
const SyndicDashboard = (props) => {
  const { email } = props;
  const [counts, setCounts] = useState({
    syndics: 0,
    proprietaires: 0,
    appartements: 0,
    meubles: 0,
    paiements: 0,
    tache: 0,
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
          axios.get('http://localhost:8080/taches/count'),
        ]);

        const [syndics, proprietaires, appartements, meubles, paiements, tache] = response.map((res) => res.data);

        setCounts({
          syndics,
          proprietaires,
          appartements,
          meubles,
          paiements,
          tache,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    
    <div style={containerStyle}>
      <nav className="navbar navbar-dark bg-dark margin-Left-5 ">
        <span className="navbar-brand mb-0 h1">
          {' '}
          <h4>
            <i className="bi bi-border-style">  Gardien Dashboard</i>
          </h4>
        </span>
      </nav>
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-2">
            <div className="card  text-light shake " style={{ backgroundColor: "#186F65" }}> {/* Apply the 'shake' class */}
              <div className="card-body">
                <h4 className="card-text">Gardien</h4>
                <h2 className="card-title">
                  <i className="bi bi-person-workspace"></i> {counts.syndics}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card  text-white shake" style={{ backgroundColor: "#BCA37F " }}> {/* Apply the 'shake' class */}
              <div className="card-body">
                <h4 className="card-text">Proprietaires</h4>
                <h2 className="card-title">
                  <i className="bi bi-person-vcard-fill"></i> {counts.proprietaires}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card  text-white shake" style={{ backgroundColor: "#B4B4B3  " }}> {/* Apply the 'shake' class */}
              <div className="card-body">
                <h4 className="card-text">Appartements</h4>
                <h2 className="card-title">
                  <i className="bi bi-house"></i> {counts.appartements}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card  text-white shake" style={{ backgroundColor: "#26577C " }}> {/* Apply the 'shake' class */}
              <div className="card-body">
                <h4 className="card-text">Meubles</h4>
                <h2 className="card-title">
                  {' '}
                  <i className="bi bi-building"></i> {counts.meubles}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card  text-white shake" style={{ backgroundColor: "#113946  " }}> {/* Apply the 'shake' class */}
              <div className="card-body">
                <h4 className="card-text">Paiements</h4>
                <h2 className="card-title">
                  <i className="bi bi-credit-card"></i> {counts.paiements}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card  text-white shake" style={{ backgroundColor: "#B2533E" }}> {/* Apply the 'shake' class */}
              <div className="card-body">
                <h4 className="card-text">Taches</h4>
                <h2 className="card-title">
                  {' '}
                  <i className="bi bi-list-task"></i> {counts.tache}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    <div className="container "  >
<div className="row justify-content-center" >
  <div className="col-md-12">
    <div className="card   mt-4 shake " style={containerStyle2}>
      
      <MeublesComponent/>
    </div>
  </div>
  <div className="container mt-4   " style={containerStyle2} >
<div className="row justify-content-center" style={containerStyle2}>
  <div className="col-md-12">
    <div className="card bg-dark text-light mt-4  shake">
     
      <TableTacheSyndic email={email}/>
    </div>
  </div>
  </div>
  </div>
</div>
</div>


</div>
  );
};

export default SyndicDashboard; // Export with an uppercase name
