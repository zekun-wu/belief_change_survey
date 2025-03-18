import React from 'react';
import './IntroPage.css';

function IntroPage({ onStartSurvey }) {
  return (
    <div className="intro-container">
      <h2>Welcome to the Study!</h2>
      <p>
        Thank you for participating! In this study, you'll engage with AI-generated information to evaluate various statements. There are two types of tasks:
      </p>
      <ul>
        <li><strong>Fact-Checking Tasks:</strong> Assess claims based on factual accuracy with AI-generated responses.</li>
        <li><strong>Opinion Evaluation Tasks:</strong> Evaluate subjective statements with opinions provided by AI.</li>
      </ul>
      <p>
        You'll complete a total of 24 tasks (12 fact-checking and 12 opinion evaluation). The tasks may appear in random order. You’ll have opportunities to take short breaks during the study.
      </p>

      <h3>What You'll Do in Each Task</h3>
      <ol>
        <li><strong>Initial Judgment:</strong> Provide your initial opinion about the statement.</li>
        <li><strong>Initial Confidence/Certainty:</strong> Indicate how confident or certainty you feel about your initial judgment.</li>
        <li><strong>AI Information:</strong> Review additional context or evidence from the AI.</li>
        <li><strong>Trust in AI Response:</strong> Indicate how much you trust the AI-generated response.</li>
        <li><strong>Final Judgment:</strong> Confirm or revise your initial judgment based on the AI's response.</li>
        <li><strong>Final Confidence/Certainty:</strong> Indicate your confidence/certainty level after reviewing the AI’s response.</li>
      </ol>

      <h3>Breaks</h3>
      <p>
        Short breaks will be available throughout. Please do not refresh or close your browser window during the study.
      </p>

      <button onClick={onStartSurvey}>Start Survey</button>
    </div>
  );
}

export default IntroPage;
