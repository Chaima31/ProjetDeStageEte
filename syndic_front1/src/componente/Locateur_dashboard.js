import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { addMonths } from 'date-fns';
import Table from 'react-bootstrap/Table';
import AnnouncementComponent from './AnnouncementList';
import ListAnnonce from './ListAnnonce';
import CreateReclamation from './CreateReclamation';

function DashboardLocateur(props) {
  const [locateur, setLocateur] = useState(null);
  const [appartements, setAppartements] = useState([]);
  const [error, setError] = useState(null);
  const [allPayments, setAllPayments] = useState([]);

  const fetchPaiementsForAppartement = async (appartement) => {
    
    try {
      const response = await fetch(`http://localhost:8080/paiements/by-appartement/${appartement.id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const paiementsData = await response.json();

      // Filter out duplicate payments by checking the payment id
      setAllPayments((prevPayments) => {
        const uniquePaiementsData = paiementsData.filter(paiementData =>
          !prevPayments.some(prevPaiement => prevPaiement.id === paiementData.id)
        );
        return [...prevPayments, ...uniquePaiementsData];
      });
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const email = props.email;
    
    fetch(`http://localhost:8080/locateurs/byEmail/${email}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setLocateur(data);
        console.log("data"+data);

        fetch(`http://localhost:8080/appartements/by-locateur/${data.id}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((appartementsData) => {
            setAppartements(appartementsData);
          })
          .catch((appartementsError) => {
            setError(appartementsError.message);
          });
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [props.email]);

  useEffect(() => {
    appartements.forEach((appartement) => {
      fetchPaiementsForAppartement(appartement);
    });
  }, [appartements]);

  return (

   

    <div className="container mt-12  ">
      <h1 className="text-center bg-dark p-2 text-light">Locateur Dashboard</h1>
     
      <div className="row">
        <div className="col-md-3 ">
          
        <div className="card  p-4 text-light bg-dark shake ">
                    <div className="rounded profile-info  ">
                      <div>
                        <h3 >
                          <i className="bi bi-person-lines-fill"></i> Profile:
                        </h3>
                      </div>
                      {error ? (
                        <p>Error: {error}</p>
                      ) : locateur ? (
                        <div>
                          <p>
                            <strong>
                              <i className="bi bi-envelope-at"></i>
                            </strong>{' '}
                            {locateur.email}
                          </p>
                          <p>
                            <strong>
                              <i className="bi bi-person"></i>
                            </strong>{' '}
                            {locateur.nom} {locateur.prenom}
                          </p>
                          <p>
                            <strong>
                              <i className="bi bi-telephone-forward"></i>
                            </strong>{' '}
                            +212 {locateur.tele}
                          </p>
                          <p>
                            <strong>
                              <i className="bi bi-border-width"></i>
                            </strong>{' '}
                            {locateur.type}
                          </p>
                          <p>
                            <strong>
                              <i className="bi bi-cash-coin"></i>
                            </strong>{' '}
                            {locateur.depense}
                          </p>
                          <Button
                            className="mt-2 mb-3"
                            variant="outline-light"
                            onClick={() => window.location.reload()}
                          >
                            Log Out
                          </Button>
                        </div>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </div>
                  </div>

        </div>
       

        <div className="col-md-9  container ">
       
          <h3 className="t2 p-2 bg-dark text-light  ">Appartement</h3>
          <div className='Card shake'>
          <Table striped bordered hover >
            <thead>
              <tr>
                <th>Appartement N°</th>
                <th>Meuble</th>
                <th>Proprietaire Nom</th>
                <th>Proprietaire Email</th>
                <th>Proprietaire Tele</th>
              </tr>
            </thead>
            <tbody>
              {appartements.map((appartement) => (
                <tr key={appartement.id}>
                  <td>{appartement.numero}</td>
                  <td>{appartement.meuble.nom}</td>
                  <td>{appartement.proprietaire.nom} {appartement.proprietaire.prenom}</td>
                  <td>{appartement.proprietaire.email}</td>
                  <td>+212 {appartement.proprietaire.tele}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          </div>
           <div className=' shake'>
           <AnnouncementComponent locateurId={locateur ? locateur.id : null} />
           </div>
         
           <div className='card bg-dark rounded p-2 shake'>
          
            <CreateReclamation locateurId={locateur } />
          </div>

           
        </div>
        
      </div>
      <h2 className="t2 p-2 mt-4 text-light bg-dark shake">Annonce List</h2>
       <ListAnnonce email={locateur ? locateur.email : null} />

       <div className="row">
  <div className="col-md- mt-2 ">
    <h2 className="t2 p-2 text-light bg-dark">Paiements List</h2>
    <div className="shake" style={{ maxHeight: '300px', overflowY: 'scroll' }}> {/* Add the scrollable div */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th className='text-primary'>Id</th>
            <th className='text-primary'>Montant</th>
            <th className='text-primary'>Trimestre</th>
          </tr>
        </thead>
        <tbody>
          {allPayments.map((paiement) => (
            <tr key={paiement.id}>
              <td>{paiement.id}</td>
              <td>{paiement.montant}</td>
              <td> {new Date(paiement.trimestre).toLocaleDateString()} - {addMonths(new Date(paiement.trimestre), 3).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  </div>
</div>
    </div>
  );
}

export default DashboardLocateur;
