import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const MeublesComponent = () => {
  const [meubles, setMeubles] = useState([]);
  const [appartementsByMeuble, setAppartementsByMeuble] = useState({});
  const [syndics, setSyndics] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const responseMeubles = await axios.get('http://localhost:8080/meubles/all');
        setMeubles(responseMeubles.data);

        const responseSyndics = await axios.get('http://localhost:8080/syndics/all');
        setSyndics(responseSyndics.data);

        const appartementsByMeubleData = {};

        for (const meuble of responseMeubles.data) {
          const responseAppartements = await axios.get(`http://localhost:8080/appartements/by-meuble/${meuble.id}`);
          appartementsByMeubleData[meuble.id] = responseAppartements.data;
        }

        setAppartementsByMeuble(appartementsByMeubleData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const getSyndicNameById = (id) => {
    const syndic = syndics.find(syndic => syndic.id === id);
    return syndic ? syndic.nom : '';
  };

  const containerStyle2 = {
    backgroundImage: 'linear-gradient(to bottom, rgba(173, 216, 230, 0.0), rgba(173, 216, 230, 0.4)), url(/your-background-image.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100%',
    padding: '20px', // Add some padding to the component
    borderRadius: '10px', // Add rounded corners
    transition: 'background-color 0.1s ease', // Add transition for background-color
  };
  

  const cardHoverStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Lighter background when hovering
  };

  const [hoveredCard, setHoveredCard] = useState(null);

  const handleCardMouseEnter = (index) => {
    setHoveredCard(index);
  };

  const handleCardMouseLeave = () => {
    setHoveredCard(null);
  };

  return (
    <div className="container mt-2">
      <div className="row">
        <h1 className="text-dark" >Meuble list</h1>
        {meubles.map((meuble, index) => (
          <div
            key={meuble.id}
            className="col-md-3 mb-3"
           
            onMouseEnter={() => handleCardMouseEnter(index)}
            onMouseLeave={handleCardMouseLeave}
          >
            <div className="card "  style={hoveredCard === index ? { ...containerStyle2, ...cardHoverStyle } : containerStyle2}>
              <div className="card-body ">
                <h4 className="card-title"><i className=" bi bi-building  text-primary"></i> {`Bloc ${meuble.nom}`}</h4>
                <ul className="list-group border rounded-pill border border-4">
                  <li className="list-group-item ">
                    <h5 className="card-title">
                      <i className="bi bi-person-workspace text-primary"></i>
                      {` De Jour :  ${getSyndicNameById(meuble.syndic_day_Id)}`}
                    </h5>
                    <h5 className="card-title">
                      <i className="bi bi-person-workspace text-primary"></i>
                      {` De Nuit :  ${getSyndicNameById(meuble.syndic_night_Id)}`}
                    </h5>
                  </li>
                </ul>
                <ul className="list-group mt-4 ml-3 border  border-4  border border-warning ">
                {appartementsByMeuble[meuble.id]?.map(appartement => (
                  <li key={appartement.id} className="list-group-item">
                    <h4><i className="bi bi-house text-warning"></i> {` ${appartement.numero}`} </h4>
                    <div><i className="bi bi-person-vcard-fill text-primary"></i> {appartement.proprietaire?.nom ? `Pr : ${appartement.proprietaire.nom}` : 'Propriétaire inconnu'}</div>
                    <div><i className="bi bi-person text-primary"></i> {appartement.locateur?.nom ? `Lo : ${appartement.locateur.nom} ${appartement.locateur.prenom}` : 'Locateur inconnu'}</div>
                    <div><i className="bi bi-telephone-forward-fill text-primary"></i> {appartement.locateur?.tele ? `Lo : +212${appartement.locateur.tele}` : 'Téléphone inconnu'}</div>
                    <div><i className="bi bi-envelope-at-fill text-primary"></i>{appartement.locateur?.email ? `Lo: ${appartement.locateur.email}` : 'Email inconnu'}</div>
                  </li>
                ))}

                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeublesComponent;
