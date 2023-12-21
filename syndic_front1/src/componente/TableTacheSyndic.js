import React, { useState, useEffect } from 'react';

const TableTacheSyndic = (props) => {
  const { email } = props;
  const [tasks, setTasks] = useState([]);
  const [syndicId, setSyndicId] = useState(null);
  const [syndicName, setSyndicName] = useState('');

  useEffect(() => {
    // Fetch all syndics data
    fetch('http://localhost:8080/syndics/all')
      .then(response => response.json())
      .then(data => {
        // Find the syndic with a matching email
        const syndicWithEmail = data.find(syndic => syndic.email === email);
        if (syndicWithEmail) {
          // If a syndic with the provided email exists, set its ID and name
          setSyndicId(syndicWithEmail.id);
          setSyndicName(syndicWithEmail.nom); // Set the syndic's name
        } else {
          // Handle the case where no syndic is found for the email
          console.log('Syndic not found for the provided email.');
        }
      });
  }, [email]);

  useEffect(() => {
    // Fetch tasks data for the selected syndic
    if (syndicId !== null) {
      fetch(`http://localhost:8080/taches/bySyndic/${syndicId}`)
        .then(response => response.json())
        .then(data => setTasks(data));
    }
  }, [syndicId]);

  return (
    <div className="container mt-4">
      <h2   >List Tache : {syndicName}</h2> {/* Display Syndic's name */}
      <div style={{ maxHeight: '600px', overflowY: 'scroll' }}>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Description</th>
            <th>Date Start</th>
            <th>Date End</th>
            <th>Gardien</th>
            <th>State</th>
          </tr>
        </thead>
        
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.description}</td>
              <td>{task.datedebut}</td>
              <td>{task.datedefin}</td>
              <td>{syndicName}</td> {/* Display Syndic Name */}
              <td>{task.etat}</td>
            </tr>
          ))}
        </tbody>
        
      </table>
      </div>
    </div>
  );
};

export default TableTacheSyndic;
