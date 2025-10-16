import { useState } from 'react';
import './utility.css';

const steps = ['Product', 'Design', 'Mockups', 'Details', 'Pricing'];

const Stepper = () => {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="stepper">
      {steps.map((label, index) => {
        const isCompleted = index <= currentStep;
        return (
          <div
            key={index}
            className={`step ${isCompleted ? 'active' : ''}`}
            onClick={() => setCurrentStep(index)}
          >
            <div className="circle">
              <div className="dot" />
            </div>
            <span className="label">{label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
