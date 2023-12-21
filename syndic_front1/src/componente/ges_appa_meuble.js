import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListMeuble from './ListMeuble';
import Appartements from './Appartements';

const containerStyle = {
  backgroundImage: 'url(/background.jpg)', // Use the background image from the public directory
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
};

function GesAppaMeuble(props) {
  return (
    <div>
      <div style={containerStyle} className="py-6">
        <div className="container mt-4">
          <div className="row">
            <div className="col-md-6">
              <ListMeuble />
            </div>
            <div className="col-md-6">
              <Appartements />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GesAppaMeuble;
