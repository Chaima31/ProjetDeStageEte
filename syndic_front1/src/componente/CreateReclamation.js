import React, { Component } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class CreateReclamation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      reclamationSent: false,
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
   
    try {
      const { message } = this.state;
      const { locateurId } = this.props;

      // Check if locateurId is not null before making the API call
      if (locateurId !== null) {
        const reclamationData = {
          message,
          locateur: locateurId
        };

        const response = await axios.post('http://localhost:8080/reclamations/save', reclamationData);

        console.log('Reclamation created:', response.data);

        // Optionally, reset form fields after successful submission
        this.setState({
          message: '',
          reclamationSent: true,
        });

        // Automatically close the success message after 3 seconds
        setTimeout(() => {
          this.setState({ reclamationSent: false });
        }, 3000);
      } else {
        console.error('locateurId is null. Unable to create reclamation.');
      }
    } catch (error) {
      console.error('Error creating reclamation:', error);
    }
  };

  render() {
    const { reclamationSent } = this.state;

    return (
      <div>
        {reclamationSent && <p className='text-success'>La Reclamation a été envoyée.</p>}
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Label className="text-light">Reclamation Message:</Form.Label>
            <Form.Control
              type="text"
              id="message"
              name="message"
              value={this.state.message}
              onChange={this.handleInputChange}
              required
            />
          </Form.Group>
          <Button className='mt-1' type="submit">Create</Button>
        </Form>
      </div>
    );
  }
}

export default CreateReclamation;
