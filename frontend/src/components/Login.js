import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [participantNumber, setParticipantNumber] = useState('');
  const [age, setAge] = useState('');
  const [education, setEducation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (participantNumber && age && education) {
      onLogin({ participantNumber, age, education });
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login to Survey</h2>
        <input
          type="number"
          placeholder="Participant Number"
          value={participantNumber}
          onChange={(e) => setParticipantNumber(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Education Background"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          required
        />
        <button type="submit">Start Survey</button>
      </form>
    </div>
  );
}

export default Login;