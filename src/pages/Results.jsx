// src/pages/Results.jsx
import React from 'react';
import { usePersonality } from '../context/PersonalityContext';
import PersonalityType from '../components/PersonalityType';
import ResultCard from '../components/ResultCard';
import personalityData from "../assets/data/personalityData.js";
import { useNavigate } from 'react-router-dom';
import BigFiveChart from '../components/charts/BigFiveChart';
import html2pdf from 'html2pdf.js';

const Results = () => {
  const { answers, quizType, resetQuiz } = usePersonality();
  const navigate = useNavigate();

  const score = answers.reduce((a, b) => a + b, 0);
  const personality = personalityData[quizType]?.find((p) => score >= p.min && score <= p.max);

  const downloadPDF = () => {
    const element = document.getElementById('results-content');
    html2pdf().from(element).save('personality-results.pdf');
  };

 
  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      <div id="results-content">
        <h1 className="text-2xl font-bold mb-4">Your Results</h1>
        {personality && (
          <>
            <PersonalityType type={personality.type} />
      
        <ResultCard title={personality.type} description={personality.description} Strength={personality.Strength}
        strength={personality.strength} Weakness={personality.Weakness} weakness={personality.weakness}
        Imporvement={personality.Imporvement} imporvement={personality.imporvement} 
         />
          </>
        )}

        <div className="mt-6">
          {quizType === 'bigfive' && <BigFiveChart />}
          
        
        </div>
      </div>
      <br />

      <div className="mt-6 flex justify-leftS gap-4 flex-wrap">

        <button
          onClick={downloadPDF}
          className="bg-green-600 text-white px-4 py-2 rounded-xl"
        >
          Download as PDF
        </button>
        
        <button
          onClick={() => {
            resetQuiz();
            navigate('/home');
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl"
        >
          Take Another Quiz
        </button>
        <button
          onClick={() => navigate('/Feedback')}
          className="bg-sky-600 text-white px-4 py-2 rounded-xl"
        >
          Feedback
        </button>

      </div>
    </div>
  );
};

export default Results;