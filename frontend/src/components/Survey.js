import React, { useState, useEffect } from 'react';
import './Survey.css';

function Survey({ participantNumber, age, education }) {
  const [questions, setQuestions] = useState([]);
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [isAITyping, setIsAITyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isAIRequested, setIsAIRequested] = useState(false); // Tracks if AI suggestion is requested
  const [supportCounter, setSupportCounter] = useState(0);
  const [againstCounter, setAgainstCounter] = useState(0);
  const [commentToShow, setCommentToShow] = useState([]);

  // Fetch questions based on participantNumber
  useEffect(() => {
    console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/questions/${participantNumber}`)
      .then(response => {
        if (!response.ok) throw new Error('Invalid participant number');
        return response.json();
      })
      .then(data => {
        setQuestions(data);
        setAnswers(data.map(() => [null, null, null, null]));
        setError(null);
      })
      .catch(error => setError(error.message));
  }, [participantNumber]);

  // Reset AI-related state when currentStep changes
  useEffect(() => {
    if (currentStep !== 2) {
      setIsAIRequested(false);
      setTypedText('');
      setIsAITyping(false);
    }
  }, [currentStep]);

  // Handle the typing effect when AI is requested
  useEffect(() => {
    if (currentStep === 2 && isAIRequested && questions.length > 0) {
      const currentElement = questions[currentElementIndex];
      let aiText;
  
      // Handle type 1 and type 2 differently
      if (currentElement.type === 1) {
        aiText = currentElement.answer; // Use the single answer for type 1
      } else if (currentElement.type === 2) {
        const commentIndex = commentToShow[currentElementIndex];
        aiText = commentIndex === 1 ? currentElement.comment1 : currentElement.comment2;
      }
  
      // Validate the text
      if (typeof aiText !== 'string' || aiText.length === 0) {
        console.error('No valid AI text to display:', aiText);
        setTypedText('');
        setIsAITyping(false);
        return;
      }
  
      // Start typing effect
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
  
  useEffect(() => {
    if (questions.length > 0) {
      setCommentToShow(Array(questions.length).fill(0));
    }
  }, [questions]);

  // useEffect(() => {
  //   if (currentStep === 2 && questions.length > 0) {
  //     const currentElement = questions[currentElementIndex];
  //     const aiText = currentElement.type === 1 ? currentElement.answer : currentElement.comment;
  
  //     // Validate aiText
  //     if (typeof aiText !== 'string' || aiText.length === 0) {
  //       console.error('aiText is not a valid string:', aiText);
  //       setTypedText(''); // Reset to empty if invalid
  //       setIsAITyping(false);
  //       return;
  //     }
  
  //     console.log('aiText:', aiText); // Debug the input
  
  //     setTypedText(''); // Reset typed text
  //     setIsAITyping(true);
  
  //     let index = 0;
  //     const typingInterval = setInterval(() => {
  //       if (index < aiText.length) {
  //         // Set the full substring up to the current index
  //         setTypedText(aiText.slice(0, index + 1));
  //         index++;
  //       } else {
  //         clearInterval(typingInterval);
  //         setIsAITyping(false);
  //       }
  //     }, 50);
  
  //     // Cleanup to prevent overlapping intervals
  //     return () => clearInterval(typingInterval);
  //   }
  // }, [currentStep, questions, currentElementIndex]);

  // Define the current question based on step and element type
  const getQuestion = (step, element) => {
    const { type } = element;
    if (step === 0) {
      return {
        text: type === 1 ? "Do you think this claim is True or False?" : "Do you support or against this claim?",
        options: type === 1 ? ["True", "False"] : ["Support", "Against"]
      };
    } else if (step === 1) {
      return {
        text: "How certain are you about your choice? (1 = Not at all certain, 5 = Absolutely certain)",
        options: ["1: Not at all certain", "2: Slightly certain", "3: Moderately certain", "4: Very certain", "5: Absolutely certain"]
      };
    } else if (step === 2) {
      return {
        text: type === 1 
          ? "After checking the AI response, do you think this claim is True or False?" 
          : "After checking the AI comment, do you support or against this claim?",
        options: type === 1 ? ["True", "False"] : ["Support", "Against"]
      };
    } else if (step === 3) {
      return {
        text: type === 1 
          ? "After checking the AI response, how certain are you about your choice? (1 = Not at all certain, 5 = Absolutely certain)" 
          : "After checking the AI comment, how certain are you about your choice? (1 = Not at all certain, 5 = Absolutely certain)",
        options: ["1: Not at all certain", "2: Slightly certain", "3: Moderately certain", "4: Very certain", "5: Absolutely certain"]
      };
    }
  };

  // Early returns for error and loading states
  if (error) return <div>{error}</div>;
  if (questions.length === 0) return <div>Loading...</div>;

  const currentElement = questions[currentElementIndex];
  const currentQuestion = getQuestion(currentStep, currentElement);

  // Handle user answers and survey progression
  const handleAnswer = (selectedOption) => {
    const newAnswers = [...answers];
    newAnswers[currentElementIndex][currentStep] = selectedOption;
    setAnswers(newAnswers);
  
    // Get the current question
    const currentElement = questions[currentElementIndex];
  
    // For type 2 questions in step 0, decide which comment to show
    if (currentStep === 0 && currentElement.type === 2) {
      if (selectedOption === "Support") {
        const commentIndex = supportCounter % 2 === 0 ? 1 : 2; // Alternate: 1, 2, 1, 2...
        setCommentToShow((prev) => {
          const newCommentToShow = [...prev];
          newCommentToShow[currentElementIndex] = commentIndex;
          return newCommentToShow;
        });
        setSupportCounter((prev) => prev + 1);
      } else if (selectedOption === "Against") {
        const commentIndex = againstCounter % 2 === 0 ? 1 : 2; // Alternate: 1, 2, 1, 2...
        setCommentToShow((prev) => {
          const newCommentToShow = [...prev];
          newCommentToShow[currentElementIndex] = commentIndex;
          return newCommentToShow;
        });
        setAgainstCounter((prev) => prev + 1);
      }
    }
  
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (currentElementIndex < questions.length - 1) {
      setCurrentElementIndex(currentElementIndex + 1);
      setCurrentStep(0);
    } else {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantNumber, age, education, answers: newAnswers }),
      })
        .then(response => response.text())
        .then(data => {
          console.log('Success:', data);
          alert('Survey submitted successfully!');
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Failed to submit survey.');
        });
    }
  };

  // Handle AI suggestion request
  const handleAIRequest = () => {
    setIsAIRequested(true); // Trigger the typing effect
  };

  return (
    <div className="survey-container">
      {/* Always show the claim */}
      <div className="claim-section">
        <h2>Claim {currentElement.claim_number}: {currentElement.claim}</h2>
      </div>
  
      {/* Step 2: Show relevant question for type 1 */}
      {currentStep === 2 && currentElement.type === 1 && (
        <div className="question-section">
          <p><strong>Relevant Question:</strong> {currentElement.question}</p>
        </div>
      )}
  
      {/* Step 2: Show "Ask AI for suggestion" button if AI not yet requested */}
      {currentStep === 2 && !isAIRequested && (
        <button onClick={handleAIRequest}>Ask AI for suggestion</button>
      )}
  
      {/* Step 2: Show AI response/comment with typing effect after request */}
      {currentStep === 2 && isAIRequested && (
        <div className="ai-section">
        <p>
          <strong>
            {currentElement.type === 1 ? "AI Response:" : `AI Comment:`}
          </strong>
        </p>
          <p>{typedText}</p>
        </div>
      )}
      {/* Show survey question and options for all steps except step 2 until AI typing is done */}
      {(currentStep !== 2 || (currentStep === 2 && isAIRequested && !isAITyping)) && (
        <>
          <div className="question-section">
            <p>{currentQuestion.text}</p>
          </div>
          <div className="options-section">
            {currentQuestion.options.map((option) => (
              <button key={option} onClick={() => handleAnswer(option)}>
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Survey;