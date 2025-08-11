// frontend/src/components/StepButtons.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetExamEligibilityQuery, useStartExamMutation } from '../store/rtkApi';
import './StepButtons.css';

const StepButtons: React.FC = () => {
  const { data, isLoading, isError } = useGetExamEligibilityQuery();
  const [startExam, { isLoading: isStarting }] = useStartExamMutation();
  const navigate = useNavigate();

  if (isLoading) return null;
  if (isError) return null;

  const completed: number[] = data?.completedSteps || [];

  const handleStart = async (step: number) => {
    try {
      await startExam(step).unwrap(); // optional server call
      // navigate to existing exam route which will load questions for that step
      navigate(`/exam/${step}`);
    } catch (err) {
      console.error('Could not start exam', err);
      alert('Could not start exam. Try again.');
    }
  };

  return (
    <div className="step-buttons-wrap">
      {/* Start Step 2 */}
      {data?.eligibleForStep2 && !completed.includes(2) && (
        <button
          className="step-btn"
          onClick={() => handleStart(2)}
          disabled={isStarting}
        >
          {isStarting ? 'Starting...' : 'Start Step 2'}
        </button>
      )}

      {/* Start Step 3 */}
      {data?.eligibleForStep3 && !completed.includes(3) && (
        <button
          className="step-btn step-btn-3"
          onClick={() => handleStart(3)}
          disabled={isStarting}
        >
          {isStarting ? 'Starting...' : 'Start Step 3'}
        </button>
      )}
    </div>
  );
};

export default StepButtons;
