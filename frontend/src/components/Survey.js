import React, { useState, useEffect } from 'react';
import './Survey.css';

function Survey({ participantNumber, age, education, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [isAITyping, setIsAITyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isAIRequested, setIsAIRequested] = useState(false);
  const [supportCounter, setSupportCounter] = useState(0);
  const [againstCounter, setAgainstCounter] = useState(0);
  const [commentToShow, setCommentToShow] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  // Fetch questions from backend
  useEffect(() => {
    console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);
    fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001'}/questions/${participantNumber}`)
      .then(response => {
        if (!response.ok) throw new Error('Invalid participant number');
        return response.json();
      })
      .then(data => {
        setQuestions(data);
        setAnswers(data.map(() => [null, null, null, null, null])); // 5 steps now
        setError(null);
      })
      .catch(error => setError(error.message));
  }, [participantNumber]);

  // Reset AI state when step changes
  useEffect(() => {
    if (currentStep !== 2) {
      setIsAIRequested(false);
      setTypedText('');
      setIsAITyping(false);
    }
  }, [currentStep]);

  // Handle AI typing effect
  useEffect(() => {
    if (currentStep === 2 && isAIRequested && questions.length > 0) {
      const currentElement = questions[currentElementIndex];
      let aiText;
      
      if (currentElement.type === 1) {
        aiText = currentElement.answer;
      } else if (currentElement.type === 2) {
        const commentIndex = commentToShow[currentElementIndex];
        aiText = commentIndex === 1 ? currentElement.comment1 : currentElement.comment2;
      }

      if (typeof aiText !== 'string' || aiText.length === 0) {
        console.error('No valid AI text to display:', aiText);
        setTypedText('');
        setIsAITyping(false);
        return;
      }

      setTypedText('');
      setIsAITyping(true);
      let index = 0;
      const typingInterval = setInterval(() => {
        if (index < aiText.length) {
          setTypedText(aiText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typingInterval);
          setIsAITyping(false);
        }
      }, 50);

      return () => clearInterval(typingInterval);
    }
  }, [isAIRequested, currentStep, questions, currentElementIndex, commentToShow]);

  // Initialize commentToShow array
  useEffect(() => {
    if (questions.length > 0) {
      setCommentToShow(Array(questions.length).fill(0));
    }
  }, [questions]);

  const getQuestion = (step, element) => {
    if (!element) return null;
    
    const { type } = element;
    switch (step) {
      case 0:
        return {
          text: type === 1 ? "Do you think this claim is True or False?" : "Do you agree or disagree with this claim?",
          options: type === 1 ? ["True", "False"] : ["Agree", "Disagree"]
        };
      case 1:
        return {
          text: "How certain are you about your choice?",
          options: [
            "1 - Not at all",
            "2 - Slightly",
            "3 - Moderately",
            "4 - Very much",
            "5 - Absolutely"
          ]
        };
      case 2:
        return {
          text: type === 1 
            ? "After checking the AI response, do you think this claim is True or False?" 
            : "After checking the AI comment, do you agree or disagree with this claim?",
          options: type === 1 ? ["True", "False"] : ["Agree", "Disagree"]
        };
      case 3:
        return {
          text: "How confident are you in the AI's response?",
          options: [
            "1 - Not at all",
            "2 - Slightly",
            "3 - Moderately",
            "4 - Very much",
            "5 - Completely"
          ]
        };
      case 4:
        return {
          text: "To what extent do you trust the AI-generated information in helping you verify this factual claim?",
          options: [
            "1 - Not at all",
            "2 - Slightly",
            "3 - Moderately ",
            "4 - Very much",
            "5 - Completely"
          ]
        };
      default:
        return null;
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = async () => {
    if (selectedOption === null) {
      alert('Please select an option before proceeding');
      return;
    }

    const newAnswers = [...answers];
    newAnswers[currentElementIndex][currentStep] = selectedOption;
    setAnswers(newAnswers);

    // Handle comment selection for type 2 questions
    if (currentStep === 0 && questions[currentElementIndex].type === 2) {
      if (selectedOption === "Agree") {
        const commentIndex = supportCounter % 2 === 0 ? 1 : 2;
        setCommentToShow(prev => {
          const newCommentToShow = [...prev];
          newCommentToShow[currentElementIndex] = commentIndex;
          return newCommentToShow;
        });
        setSupportCounter(prev => prev + 1);
      } else if (selectedOption === "Disagree") {
        const commentIndex = againstCounter % 2 === 0 ? 1 : 2;
        setCommentToShow(prev => {
          const newCommentToShow = [...prev];
          newCommentToShow[currentElementIndex] = commentIndex;
          return newCommentToShow;
        });
        setAgainstCounter(prev => prev + 1);
      }
    }

    // When all questions are completed
    if (currentStep === 4 && currentElementIndex === questions.length - 1) {
      // Call the onComplete prop with all answers
      onComplete(newAnswers);
    } else if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else if (currentElementIndex < questions.length - 1) {
      setCurrentElementIndex(currentElementIndex + 1);
      setCurrentStep(0);
    }

    setSelectedOption(null);
  };

  const handleAIRequest = () => {
    setIsAIRequested(true);
  };

  if (error) return <div>{error}</div>;
  if (!questions || questions.length === 0) return <div>Loading questions...</div>;

  const currentElement = questions[currentElementIndex];
  const currentQuestion = getQuestion(currentStep, currentElement);

  if (!currentQuestion) return <div>Loading question...</div>;

  return (
    <div className="survey-container">
      <div className="claim-section">
        <h2>Claim {currentElementIndex + 1}: {currentElement.claim}</h2>
      </div>

      {currentStep === 2 && currentElement.type === 1 && (
        <div className="question-section">
          <p><strong>Relevant Question:</strong> {currentElement.question}</p>
        </div>
      )}

      {currentStep === 2 && !isAIRequested && (
        <button onClick={handleAIRequest} className="ai-button">
          Ask AI for suggestion
        </button>
      )}

      {currentStep === 2 && isAIRequested && (
        <div className="ai-section">
          <p>
            <strong>
              {currentElement.type === 1 ? "AI Response:" : "AI Comment:"}
            </strong>
          </p>
          <p>{typedText}</p>
        </div>
      )}

      {(currentStep !== 2 || (currentStep === 2 && isAIRequested && !isAITyping)) && (
        <>
          <div className="question-section">
            <p>{currentQuestion.text}</p>
          </div>
          <div className="options-section">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                className={selectedOption === option ? 'selected' : ''}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="next-button-container">
            <button 
              className="next-button"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </>
      )}

      {currentStep === 2 && isAIRequested && isAITyping && (
        <div>AI is generating response...</div>
      )}
    </div>
  );
}

export default Survey;