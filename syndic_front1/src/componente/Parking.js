import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import { AppartementContext } from './AppartementContext'; // Use a relative path

const Parking = () => {
  const { appartements } = useContext(AppartementContext);
  console.log('appartement data :'+ {appartements})

  return (
    <div>
      <h2>Parking</h2>
      
      {appartements.map((item, index) => (
        
        <Card key={index} className="my-3">
          <Card.Body>
            <Card.Title>Card {index + 1}</Card.Title>
            <Card.Text>
              Meuble Nom: {item.meubleNom}<br />
              Appartement Numero: {item.appartement.numero}<br />
              Locateur Nom: {item.locateur.nom}<br /> {/* Display locateur nom */}
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default Parking;
