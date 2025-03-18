import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [participantNumber, setParticipantNumber] = useState(1);
  const [age, setAge] = useState(18);
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [trust, setTrust] = useState('');

  // Handle number input changes with range constraints
  const handleParticipantChange = (e) => {
    const value = Math.max(0, Math.min(100, Number(e.target.value)));
    setParticipantNumber(value);
  };

  const handleAgeChange = (e) => {
    const value = Math.max(18, Math.min(100, Number(e.target.value)));
    setAge(value);
  };

  // Handle mousewheel events for number inputs
  const handleParticipantWheel = (e) => {
    e.preventDefault();
    const increment = e.deltaY < 0 ? 1 : -1;
    setParticipantNumber(prev => Math.max(0, Math.min(100, prev + increment)));
  };

  const handleAgeWheel = (e) => {
    e.preventDefault();
    const increment = e.deltaY < 0 ? 1 : -1;
    setAge(prev => Math.max(18, Math.min(100, prev + increment)));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Your existing submission logic
    console.log({
      participantNumber,
      age,
      education,
      experience,
      trust
    });
  };

  return (
    <div className="login-container">
      <h2>Login to Survey</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="participantNumber">Participant Number</label>
          <div className="number-spinner">
            <input
              id="participantNumber"
              type="number"
              min="0"
              max="100"
              value={participantNumber}
              onChange={handleParticipantChange}
              onWheel={handleParticipantWheel}
            />
          </div>
          <span className="input-hint">Use mouse wheel to select (0-100)</span>
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <div className="number-spinner">
            <input
              id="age"
              type="number"
              min="18"
              max="100"
              value={age}
              onChange={handleAgeChange}
              onWheel={handleAgeWheel}
            />
          </div>
          <span className="input-hint">Use mouse wheel to select (18-100)</span>
        </div>

        <div className="form-group">
          <label htmlFor="education">Education Background</label>
          <select 
            id="education"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
          >
            <option value="">Select Education Background</option>
            <option value="highschool">High School</option>
            <option value="bachelor">Bachelor's Degree</option>
            <option value="master">Master's Degree</option>
            <option value="phd">PhD</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="experience">Experience with AI/LLM tools</label>
          <select 
            id="experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          >
            <option value="">Select Experience with AI/LLM tools</option>
            <option value="none">No Experience</option>
            <option value="basic">Basic</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="trust">How much trust would you generally put on AI-generated responses in the daily use?</label>
          <select 
            id="trust"
            value={trust}
            onChange={(e) => setTrust(e.target.value)}
          >
            <option value="">Select Trust Level</option>
            <option value="low">Very Low</option>
            <option value="somewhat-low">Somewhat Low</option>
            <option value="moderate">Moderate</option>
            <option value="somewhat-high">Somewhat High</option>
            <option value="high">Very High</option>
          </select>
        </div>

        <button type="submit" className="login">Login</button>
      </form>
    </div>
  );
}

export default Login;
