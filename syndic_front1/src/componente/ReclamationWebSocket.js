import React, { Component } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { Alert } from 'react-bootstrap';

class ReclamationWebSocket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reclamations: [],
      locateurId: props.locateurId,
      showAlert: false,
    };
  }

  componentDidMount() {
    this.connectWebSocket();
    console.log("connected web socket")
  }

  connectWebSocket() {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);

    const connectCallback = () => {
      stompClient.subscribe('/topic/reclamations', (message) => {
        const reclamation = JSON.parse(message.body);

        if (reclamation.locateurId === this.state.locateurId) {
          if (!this.state.reclamations.some((existingReclamation) => existingReclamation.id === reclamation.id)) {
            this.setState((prevState) => ({
              reclamations: [...prevState.reclamations, reclamation],
              showAlert: true,
            }));
          }
        }
      });
    };

    const errorCallback = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
      errorCallback('Connection closed');
    };

    stompClient.connect({}, connectCallback, errorCallback);
  }

  handleAlertClose = () => {
    this.setState({ showAlert: false });
  };

  render() {
    return (
      <div className="render">
        {this.state.showAlert && (
          <Alert variant="info" dismissible onClose={this.handleAlertClose}>
            <h3 className="text-danger">Nouvelle réclamation N°{this.state.reclamations[this.state.reclamations.length - 1]?.id} - Reload la liste des réclamations  :</h3>
            <p className="text-dark">{this.state.reclamations[this.state.reclamations.length - 1]?.message}</p>
          </Alert>
        )}
      </div>
    );
  }
}

export default ReclamationWebSocket;
