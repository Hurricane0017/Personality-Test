import React, { useEffect, useState } from 'react';
import { usePersonality } from '../context/PersonalityContext';
import Question from '../components/Question';
import ProgressBar from '../components/ProgressBar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const Quiz = () => {
  const { currentQuestion, questions, setCurrentQuestion } = usePersonality();
  const [userAnswers, setUserAnswers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!questions || questions.length === 0) {
        navigate('/');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [questions, navigate]);

  const handleAnswer = async (selectionData) => {
    const { optionTexts } = selectionData;

    const newAnswer = {
      questionId: questions[currentQuestion].id || currentQuestion,
      questionText: questions[currentQuestion].text,
      selectedOptions: optionTexts,
    };

    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = newAnswer;

      if (currentQuestion === questions.length - 1 || currentQuestion % 3 === 0) {
        setTimeout(() => {
          saveAnswersToSupabase(newAnswers.filter(Boolean));
        }, 0);
      }

      return newAnswers;
    });

    if (currentQuestion === questions.length - 1) {
      setTimeout(() => navigate('/results'), 80);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const saveAnswersToSupabase = async (answers = userAnswers) => {
    try {
      setIsSaving(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session || !session.user) {
        console.log('No active session found');
        return;
      }

      const userId = session.user.id;

      const formattedAnswers = answers.filter(Boolean).map(answer => ({
        questionId: answer.questionId,
        questionText: answer.questionText,
        selectedOptions: answer.selectedOptions
      }));

      const { error } = await supabase
        .from('userinfo')
        .update({
          selected_options: formattedAnswers,
        })
        .eq('id', userId);

      if (error) {
        console.error('Error saving answers:', error);
      } else {
        console.log('Saved answers successfully');
      }
    } catch (error) {
      console.error('Failed to save answers:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500 text-lg">
        Loading quiz...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <ProgressBar current={currentQuestion + 1} total={questions.length} />
      <Question
        question={questions[currentQuestion]}
        onAnswer={handleAnswer}
        selectedOptions={userAnswers[currentQuestion]?.selectedIndices || []}
        onBack={goBack}
        showBack={currentQuestion > 0}
        isLastQuestion={currentQuestion === questions.length - 1}
        isFirstQuestion={currentQuestion === 0}
        isSaving={isSaving}
      />
    </div>
  );
};

export default Quiz;