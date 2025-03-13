import React, { useState } from 'react';
import Login from './components/Login';
import IntroPage from './components/IntroPage';
import Survey from './components/Survey';
import './styles/App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [participantNumber, setParticipantNumber] = useState('');
  const [age, setAge] = useState('');
  const [education, setEducation] = useState('');

  const handleLogin = (data) => {
    console.log('Participant Number:', data.participantNumber); // Debug
    setParticipantNumber(data.participantNumber);
    setAge(data.age);
    setEducation(data.education);
    setIsLoggedIn(true);
    setShowIntro(true);
  };

  const handleStartSurvey = () => {
    setShowIntro(false);
  };

  return (
    <div className="app-wrapper">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : showIntro ? (
        <IntroPage onStartSurvey={handleStartSurvey} />
      ) : (
        <Survey
          participantNumber={participantNumber}
          age={age}
          education={education}
        />
      )}
    </div>
  );
}

export default App;