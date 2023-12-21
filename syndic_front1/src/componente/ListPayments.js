import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addMonths } from 'date-fns';

export default function Payments() {
    const [payments, setPayments] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [montant, setMontant] = useState('');
    const [trimestre, setTrimestre] = useState(new Date());
    const [appartement, setAppartement] = useState('');
    const [appartements, setAppartements] = useState([]);

    useEffect(() => {
        fetchPayments();
        fetchAppartements();
    }, []);

    const fetchPayments = () => {
        axios
            .get('http://localhost:8080/paiements/all')
            .then((response) => {
                setPayments(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const fetchAppartements = () => {
        axios
            .get('http://localhost:8080/appartements/all')
            .then((response) => {
                setAppartements(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleAddPayment = () => {
        if (!montant || !trimestre || !appartement) {
            alert('Please fill in all fields.');
            return;
        }

        const newPayment = {
            montant: Number(montant),
            trimestre: trimestre.toISOString(),
            appartement: {
                id: Number(appartement),
            },
        };

        axios
            .post('http://localhost:8080/paiements/save', newPayment)
            .then(() => {
                fetchPayments();
                setMontant('');
                setTrimestre(new Date());
                setAppartement('');
                handleCloseAddModal();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleUpdatePayment = () => {
        if (!montant || !trimestre || !appartement) {
            alert('Please fill in all fields.');
            return;
        }

        const updatedPayment = {
            id: selectedPayment.id,
            montant: Number(montant),
            trimestre: trimestre.toISOString(),
            appartement: {
                id: Number(appartement),
            },
        };

        axios
            .put(`http://localhost:8080/paiements/${selectedPayment.id}`, updatedPayment)
            .then(() => {
                fetchPayments();
                setMontant('');
                setTrimestre(new Date());
                setAppartement('');
                handleCloseUpdateModal();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleDeletePayment = (id) => {
        axios
            .delete(`http://localhost:8080/paiements/${id}`)
            .then(() => {
                fetchPayments();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleCloseAddModal = () => setShowAddModal(false);
    const handleShowAddModal = () => setShowAddModal(true);

    const handleCloseUpdateModal = () => setShowUpdateModal(false);
    const handleShowUpdateModal = (payment) => {
        setSelectedPayment(payment);
        setMontant(payment.montant);
        setTrimestre(new Date(payment.trimestre));
        setAppartement(payment.appartement.id);
        setShowUpdateModal(true);
    };

    const containerStyle = {
        backgroundImage: 'url(/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
    };

    const datePickerStyle = {
        width: '100%', // Personnalisez la largeur du DatePicker ici
    };

    return (
        <div style={containerStyle}>
            <h1 className="text-center bg-dark text-light">Payments</h1>
            <Container className="mt-4">
                <Button variant="primary" onClick={handleShowAddModal}>
                    Add Payment
                </Button>
                <div style={{ maxHeight: '600px', overflowY: 'scroll' }}>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Trimestre</th>
                                <th>Appartement N° </th>
                                <th>Meuble </th>
                                <th>Locateur </th>
                                <th>Montant</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment.id}>
                                    <td>{payment.id}</td>
                                    <td>
                                        {new Date(payment.trimestre).toLocaleDateString()} - {addMonths(new Date(payment.trimestre), 3).toLocaleDateString()}
                                    </td>
                                    <td>N° {payment.appartement.numero}</td>
                                    <td>
                                        {payment.appartement.meuble ? `Bloc ${payment.appartement.meuble.nom}` : 'Meuble inconnu'}
                                    </td>
                                    <td>
                                        {payment.appartement.locateur ? `${payment.appartement.locateur.nom} ${payment.appartement.locateur.prenom}` : 'Locateur inconnu'}
                                    </td>
                                    <td>{payment.montant}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            onClick={() => handleShowUpdateModal(payment)}
                                        >
                                            Edit
                                        </Button>
                                        
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                <Modal show={showAddModal} onHide={handleCloseAddModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Payment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="formTrimestre">
                            <Form.Label>Trimestre</Form.Label>
                            <DatePicker
                                selected={trimestre}
                                onChange={(date) => setTrimestre(date)}
                                style={datePickerStyle}
                            />
                        </Form.Group>
                        <Form.Group controlId="formAppartementId">
                            <Form.Label>Appartement</Form.Label>
                            <Form.Control
                                as="select"
                                value={appartement}
                                onChange={(e) => setAppartement(e.target.value)}
                            >
                                <option value="">Select Appartement</option>
                                {appartements.map((appartement) => (
                                    <option key={appartement.id} value={appartement.id}>
                                        {appartement.id}     Numero: {appartement.numero}    Bloc: {appartement.meuble.nom}    locateur: {appartement.locateur.nom} {appartement.locateur.prenom}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formMontant">
                            <Form.Label>Montant</Form.Label>
                            <Form.Control
                                as="select"
                                value={montant}
                                onChange={(e) => setMontant(e.target.value)}
                            >
                                <option value="">Select Montant</option>
                                <option value="250">250</option>
                                <option value="300">300</option>
                            </Form.Control>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseAddModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleAddPayment}>
                            Add Payment
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formTrimestre">
                        <Form.Label>Trimestre</Form.Label>
                        <DatePicker
                            selected={trimestre}
                            onChange={(date) => setTrimestre(date)}
                            style={datePickerStyle}
                        />
                        </Form.Group>
                        <Form.Group controlId="formAppartementId">
                            <Form.Label>Appartement</Form.Label>
                            <Form.Control
                                as="select"
                                value={appartement}
                                onChange={(e) => setAppartement(e.target.value)}
                            >
                                <option value="">Select Appartement</option>
                                {appartements.map((appartement) => (
                                    <option key={appartement.id} value={appartement.id}>
                                        {appartement.id}     Numero: {appartement.numero}    Bloc: {appartement.meuble.nom}    locateur: {appartement.locateur.nom} {appartement.locateur.prenom}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formMontant">
                            <Form.Label>Montant</Form.Label>
                            <Form.Control
                                as="select"
                                value={montant}
                                onChange={(e) => setMontant(e.target.value)}
                            >
                                <option value="">Select Montant</option>
                                <option value="250">250</option>
                                <option value="300">300</option>
                            </Form.Control>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseUpdateModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleUpdatePayment}>
                            Update Payment
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
}
