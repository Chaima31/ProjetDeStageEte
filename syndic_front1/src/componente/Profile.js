import React, { Component } from 'react';

import Button from 'react-bootstrap/Button'; 

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proprietaire: null,
      apartments: [], // Initialize an empty array for apartments
      error: null,
    };
  }

  componentDidMount() {
    const { email } = this.props;

    // Fetch the profile information
    fetch(`http://localhost:8080/proprietaires/by-email/${email}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ proprietaire: data });

        // After fetching the profile, fetch the list of apartments using proprietaire.id
        this.fetchApartments(data.id);
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  }

  // Function to fetch the list of apartments
  fetchApartments(id_proprietaire) {
    fetch(`http://localhost:8080/proprietaires/by-proprietaire/${id_proprietaire}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Assuming data is an array of apartments, update the state
        this.setState({ apartments: data });
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  }

  render() {
    const { proprietaire, apartments, error } = this.state;

    if (error) {
      return <div>Error: {error}</div>;
    }

    if (!proprietaire) {
      return <div>Loading...</div>;
    }

    return (
      <div className="container-fluid ">
        <h1 className="text-center bg-dark p-2 text-light">Proprietaire Dashboard</h1>
        <div className="row">
          {/* Profile Column */}
          <div className="col-md-3 ">
          <div className="   card  p-4 text-light bg-dark ">
              <div className="rounded profile-info ">
                <div>
                  <h3>
                    <i className="bi bi-person-lines-fill"></i> Profile:
                  </h3>
                </div>
                <p>
                  <strong>
                    <i className="bi bi-envelope-at"></i>
                  </strong>{' '}
                  {proprietaire.email}
                </p>
                <p>
                  <strong>
                    <i className="bi bi-person"></i>
                  </strong>{' '}
                  {proprietaire.nom} {proprietaire.prenom}
                </p>
                <p>
                  <strong>
                    <i className="bi bi-telephone-forward"></i>
                  </strong>{' '}
                  +212 {proprietaire.tele}
                </p>
                <Button
                  className="mt-10px mb-5px"
                  variant="outline-light"
                  onClick={() => window.location.reload()}
                >
                  Log Out
                </Button>
              </div>
            </div>

          </div>

          {/* Apartments Column */}
          <div className="col-md-9 text-center">
            <div className="apartments-list text-center">
              <h2 className="t1 text-light bg-dark">Appartements list</h2>
              <table className="table table-striped ">
                <thead>
                  <tr className="text-primary">
                    <th>Appartement N°:</th>
                    <th>Meuble Bloc</th>
                    <th>Locateur Nom</th>
                    <th>Tele de Locateur</th>
                    <th>Email de Locateur</th>
                  </tr>
                </thead>
                <tbody>
                  {apartments.map((apartment) => (
                    <tr key={apartment.id}>
                      <td>{apartment.numero}</td>
                      <td>{apartment.meuble.nom}</td>
                      <td>{apartment.locateur.nom} {apartment.locateur.prenom}</td>
                      <td>+212 {apartment.locateur.tele}</td>
                      <td>{apartment.locateur.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;