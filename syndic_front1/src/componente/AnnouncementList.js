import React, { Component } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { Alert } from 'react-bootstrap';

class AnnouncementComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            announcements: [],
            locateurId: props.locateurId,
            showAlert: false,
        };
    }

    componentDidMount() {
        this.connectWebSocket();
    }

    connectWebSocket() {
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socket);

        const connectCallback = () => {
            console.log('WebSocket connection opened'); // Debug log
            
            stompClient.subscribe('/topic/announcements', (message) => {
                console.log('Received message:', message); // Debug log

                const announcement = JSON.parse(message.body);

                if (announcement.locateur.some((locateur) => locateur.id === this.state.locateurId)) {
                    if (!this.state.announcements.some((existingAnnouncement) => existingAnnouncement.id === announcement.id)) {
                        console.log('New announcement:', announcement); // Debug log
                        
                        this.setState(
                            (prevState) => ({
                                announcements: [...prevState.announcements, announcement],
                                showAlert: true,  // Show the alert when a new announcement is received
                            }),
                            () => {
                                console.log('State after update:', this.state); // Debug log
                            }
                        );
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
        console.log('handleAlertClose called'); // Debug log
        this.setState({ showAlert: true });
    };

    render() {
        console.log('Rendering with showAlert:', this.showAlert); // Debug log

        return (
            <div className="render">
                {this.state.showAlert && (
                    <Alert variant="info" dismissible onClose={this.handleAlertClose}>
                        <h3 className="text-danger">Nouvelle announcement N° {this.state.announcements[this.state.announcements.length - 1]?.id} Reload Annonce List :</h3>
                        <p className="text-dark">{this.state.announcements[this.state.announcements.length - 1]?.message}</p>
                    </Alert>
                )}
            </div>
        );
    }
}

export default AnnouncementComponent;
