import React, { useEffect, useState, useCallback } from 'react';

function ListAnnonce(props) {
  const [annonces, setAnnonces] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = useCallback(() => {
    fetch(`http://localhost:8080/annonces/by-locateur/${props.email}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setAnnonces(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [props.email]);

  useEffect(() => {
    fetchData(); // Initial data fetch when the component mounts
  }, [props.email, fetchData]);

  const handleReload = () => {
    fetchData(); // Fetch data again when the "Reload" button is clicked
  };

  const handleDownload = (id) => {
    window.open(`http://localhost:8080/annonces/download/${id}`);
  };

  

  return (
    <div className="card">
      <div className="d-flex justify-content-between pl-2">
        <button className="btn btn-primary p-2" onClick={handleReload}>
          Reload
        </button>
      </div>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <div style={{ maxHeight: `300px`, overflowY: 'scroll' }}>
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="text-primary">ID</th>
                <th className="text-primary">Message</th>
                <th className="text-primary">File</th>
                <th className="text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {annonces.map((annonce) => (
                <tr key={annonce.id}>
                  <td>{annonce.id}</td>
                  <td>{annonce.message}</td>
                  <td>{annonce.filenam}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleDownload(annonce.id)}
                    >
                      Download
                    </button>
                  </td>
                
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ListAnnonce;
