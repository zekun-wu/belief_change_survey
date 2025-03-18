import React, { useState } from 'react';
import Login from './components/Login';
import IntroPage from './components/IntroPage';
import Survey from './components/Survey';
import EndPage from './components/EndPage';
import './styles/App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [participantNumber, setParticipantNumber] = useState('');
  const [age, setAge] = useState('');
  const [education, setEducation] = useState('');
  const [isSurveyCompleted, setSurveyCompleted] = useState(false);

  const handleLogin = (data) => {
    console.log('Participant Number:', data.participantNumber);
    setParticipantNumber(data.participantNumber);
    setAge(data.age);
    setEducation(data.education);
    setIsLoggedIn(true);
    setShowIntro(true);
  };

  const handleStartSurvey = () => {
    setShowIntro(false);
  };

  // This function will be called from Survey component after all answers are submitted
  const handleSurveyComplete = async (answers) => {
    try {
      // Submit the final answers to the backend
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001'}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantNumber,
          age,
          education,
          answers
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save responses');
      }

      // If successful, set survey as completed
      setSurveyCompleted(true);
    } catch (error) {
      console.error('Error saving responses:', error);
      alert('There was an error saving your responses. Please try again.');
    }
  };

  return (
    <div className="app-wrapper">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : showIntro ? (
        <IntroPage onStartSurvey={handleStartSurvey} />
      ) : isSurveyCompleted ? (
        <EndPage />
      ) : (
        <Survey
          participantNumber={participantNumber}
          age={age}
          education={education}
          onComplete={handleSurveyComplete}
        />
      )}
    </div>
  );
}

export default App;