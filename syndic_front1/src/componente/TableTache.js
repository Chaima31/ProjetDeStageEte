import React, { useState, useEffect } from 'react';

const TableTache = () => {
  const [tasks, setTasks] = useState([]);
  const [syndics, setSyndics] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/taches/all')
      .then(response => response.json())
      .then(data => setTasks(data));

    // Fetch syndics data
    fetch('http://localhost:8080/syndics/all')
      .then(response => response.json())
      .then(data => setSyndics(data));
  }, []);

 

  const deleteTask = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
  
    if (!confirmed) {
      return; // If the user cancels the deletion, do nothing
    }
  
    // Send a DELETE request to delete the task by ID
    fetch(`http://localhost:8080/taches/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.status === 200) {
          // If the task is successfully deleted, remove it from the state
          setTasks(tasks.filter(task => task.id !== id));
        }
      })
      .catch(error => {
        console.error('Error deleting task:', error);
      });
  };
  
  const findSyndicName = (syndicId) => {
    const foundSyndic = syndics.find(syndic => syndic.id === syndicId);
    return foundSyndic ? foundSyndic.nom : 'Unknown Syndic';
  };

  return (
    <div className="container mt-4">
      <h3 className=" mt-4 text-dark">Tache List </h3>
      <div style={{ maxHeight: '600px', overflowY: 'scroll' }}>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Description</th>
            <th>Date Start</th>
            <th>Date End</th>
            <th>Gardien</th>
            <th>State</th>
            <th>Action</th>
          </tr>
        </thead>
        
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.description}</td>
              <td>{task.datedebut}</td>
              <td>{task.datedefin}</td>
              <td>{findSyndicName(task.syndic_id)}</td>
              <td>{task.etat}</td>
              <td>
               
                <span style={{ marginLeft: '3px' }} />
                <button
                  className="btn btn-danger"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        
      </table>
      </div>
    </div>
  );
};

export default TableTache;
