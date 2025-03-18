import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [participantNumber, setParticipantNumber] = useState('');
  const [age, setAge] = useState('');
  const [education, setEducation] = useState('');
  const [aiExperience, setAiExperience] = useState('');
  const [aiTrust, setAiTrust] = useState('');

  const educationOptions = [
    "Less than High School",
    "High School Diploma or Equivalent",
    "Some College (no degree)",
    "Associate's Degree",
    "Bachelor's Degree or higher"
  ];

  const aiExperienceOptions = [
    "Never used AI/LLM tools",
    "Rarely (few times a year)",
    "Occasionally (monthly)",
    "Regularly (weekly)",
    "Frequently (daily)"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (participantNumber && age && education && aiExperience && aiTrust) {
      onLogin({ participantNumber, age, education, aiExperience, aiTrust });
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
        <select
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          required
        >
          <option value="">Select Education Background</option>
          {educationOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
        <select
          value={aiExperience}
          onChange={(e) => setAiExperience(e.target.value)}
          required
        >
          <option value="">Select Experience with AI/LLM tools</option>
          {aiExperienceOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
        <select
          value={aiTrust}
          onChange={(e) => setAiTrust(e.target.value)}
          required
        >
          <option value="">How much trust would you generally put on AI-generated responses in the daily use?</option>
          <option value="low">Rarely trust (always verify independently)</option>
          <option value="somewhat low">Occasionally trust (usually verify)</option>
          <option value="medium">Moderate trust (verify sometimes)</option>
          <option value="somewhat high">Often trust (minimal verification)</option>
          <option value="high">Almost always trust (no verification needed)</option>
        </select>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
