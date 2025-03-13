import React from 'react';
import './IntroPage.css'; // Import the CSS file

function IntroPage({ onStartSurvey }) {
  return (
    <div className="intro-container">
      <h1>Welcome to the Study on AI-Assisted Fact-Checking</h1>
      <p>Thank you for participating! In this study, you will evaluate factual claims by making judgments both before and after seeing AI-generated information.</p>
      
      <h2>What You Will Do</h2>
      <ol>
        <li><strong>Evaluate a claim</strong> – Decide whether it is True or False (or a third option as Partially True, if available).</li>
        <li><strong>Rate your confidence</strong> – Indicate how certain you are about your choice.</li>
        <li><strong>View an AI-generated response</strong> – The AI will provide additional context or evidence.</li>
        <li><strong>Make a final judgment</strong> – You can keep or revise your decision.</li>
        <li><strong>Rate your confidence again</strong> – Indicate how certain you are after seeing the AI’s response.</li>
      </ol>
      
      <h2>Important Note</h2>
      <p>There is no “I don’t know” option in this study. If you are unsure about a claim, simply make a random selection before viewing the AI response. Then, in the following question, you can indicate your certainty level—choosing the lowest certainty if you have no knowledge about the claim.</p>
      
      <p>Please take your time and answer as thoughtfully as possible. Let’s begin!</p>
      
      <button onClick={onStartSurvey}>Start Survey</button>
    </div>
  );
}

export default IntroPage;