import React, { Component } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class CreateAnnonce extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      file: null,
      selectedLocateurIds: [], // Maintain an array of selected Locateur IDs
      locateurs: [],
      announcementSent: false,
      selectAllLocateurs: false, // New state property for "Select All" checkbox
    };
  }

  async fetchLocateurs() {
    try {
      const response = await axios.get('http://localhost:8080/locateurs/all');
      this.setState({ locateurs: response.data });
    } catch (error) {
      console.error('Error fetching locateurs:', error);
    }
  }

  componentDidMount() {
    this.fetchLocateurs();
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleFileChange = (e) => {
    const file = e.target.files[0];
    this.setState({ file });
  };

  handleLocateurChange = (e) => {
    const { value } = e.target;
    this.setState((prevState) => {
      const selectedLocateurIds = [...prevState.selectedLocateurIds];

      if (selectedLocateurIds.includes(value)) {
        // If the ID is already in the array, remove it
        const index = selectedLocateurIds.indexOf(value);
        selectedLocateurIds.splice(index, 1);
      } else {
        // If the ID is not in the array, add it
        selectedLocateurIds.push(value);
      }

      return { selectedLocateurIds };
    });
  };

  handleSelectAllChange = (e) => {
    const { checked } = e.target;
    this.setState({
      selectAllLocateurs: checked,
      selectedLocateurIds: checked ? this.state.locateurs.map(locateur => locateur.id) : [],
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('file', this.state.file);
      formData.append('message', this.state.message);

      // Append each selectedLocateurId to the formData
      this.state.selectedLocateurIds.forEach((locateurId) => {
        formData.append('locateurIds', locateurId);
      });

      const response = await axios.post('http://localhost:8080/annonces/save', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Announcement created:', response.data);

      // Optionally, reset form fields after successful submission
      this.setState({
        message: '',
        file: null,
        selectedLocateurIds: [],
        announcementSent: true,  // Clear the selected Locateur IDs
      });
      // Automatically close the success message after 3 seconds
      setTimeout(() => {
        this.setState({ announcementSent: false });
      }, 3000);
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  render() {
    const { locateurs, selectedLocateurIds, announcementSent, selectAllLocateurs } = this.state;

    return (
      <div>
        {announcementSent && <p className='text-success'>L'annonce a été envoyée.</p>}
        <Form onSubmit={this.handleSubmit} encType="multipart/form-data">
         

          <Form.Group>
            <Form.Label className=" h4 text-dark">Message:</Form.Label>
            <Form.Control
              as="textarea"
              id="message"
              name="message"
              value={this.state.message}
              onChange={this.handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className="col h4 text-dark">File:</Form.Label>
            <Form.Control
             
              type="file"
              id="file"
              name="file"
              onChange={this.handleFileChange}
              required
            />
          </Form.Group>

          {/* Add checkboxes for selecting Locateurs */}
          <Form.Group>
          <Form.Label className='h4'>Locateurs:</Form.Label>
            <h5 className='text-primary'><Form.Check
              type="checkbox"
              id="select-all-locateurs"
              label="Select All "
              checked={selectAllLocateurs}
              onChange={this.handleSelectAllChange}
            />
            </h5>
          </Form.Group>
          <Form.Group>
           
            {locateurs.map((locateur) => (
              <div className="form-check" key={locateur.id}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`locateur-${locateur.id}`}
                  value={locateur.id}
                  checked={selectedLocateurIds.includes(locateur.id)}
                  onChange={this.handleLocateurChange}
                />
                <Form.Label
                  className="form-check-label"
                  htmlFor={`locateur-${locateur.id}`}
                >
                  {locateur.nom} {locateur.prenom}
                </Form.Label>
              </div>
            ))}
          </Form.Group>

          <Button type="submit">Envoyée</Button>
        </Form>
      </div>
    );
  }
}

export default CreateAnnonce;
