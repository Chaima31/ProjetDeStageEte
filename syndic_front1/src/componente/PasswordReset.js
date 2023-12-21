import React, { useState } from 'react';
import axios from 'axios';

function PasswordReset() {
  const [email, setEmail] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isSending, setIsSending] = useState(false); // State to track email sending

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleResetPassword = () => {
    if (email) {
      setIsSending(true); // Set sending state to true when starting to send email
      // Make an API request to the backend to send the password reset email
      axios.post(`http://localhost:8080/Personnes/resetPassword/${email}`)
        .then((response) => {
          setIsSending(false); // Set sending state to false on response
          if (response.status === 200) {
            setResponseMessage('Password reset email sent successfully, check your email.');
          } else {
            setResponseMessage('Error sending password reset email.');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          setIsSending(false); // Set sending state to false on error
          setResponseMessage('Error sending password reset email.');
        });
    } else {
      setResponseMessage('Please enter a valid email address.');
    }
  };

  return (
    <div className="container">
      <div className="col-md-12">
        <h4 className="text-center text-primary mb-2">Entrez votre email :</h4>
        <div className="row form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="text-center">
          <button
            className="btn btn-primary mt-2"
            onClick={handleResetPassword}
            disabled={isSending} // Disable the button while sending
          >
            {isSending ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="visually-hidden">Sending...</span>
              </>
            ) : 'Reset Password'}
          </button>
        </div>
        {responseMessage && (
          <div className="mt-3 text-center text-warning">{responseMessage}</div>
        )}
      </div>
    </div>
  );
}

export default PasswordReset;
