import { useState } from "react";
import PersonalInfoForm from "./PersonalInfoForm";
import EmployerInfoForm from "./EmployerInfoForm";
import MortgageInfoForm from "./MortgageInfoForm";
import "./LoanFlow.css";

export default function LoanApplicationFlow({ onBack }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [caseData, setCaseData] = useState(null);
  const [formData, setFormData] = useState({
    personal: {},
    employer: {},
    mortgage: {}
  });

  const steps = [
    { title: "Personal Details", component: PersonalInfoForm },
    { title: "Employer Info", component: EmployerInfoForm },
    { title: "Mortgage Data", component: MortgageInfoForm }
  ];

  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = (data) => {
    const stepKeys = ["personal", "employer", "mortgage"];
    setFormData(prev => ({
      ...prev,
      [stepKeys[currentStep]]: data
    }));

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="loan-flow-overlay">
      <div className="loan-flow-container">
        {/* HEADER - Matches Homepage */}
        <header className="flow-header">
          <div className="flow-header-left">
            <button onClick={onBack} className="flow-close-btn" title="Close">
              ✕
            </button>
            <div className="flow-logo">🏦 MyBank</div>
          </div>
          <h1 className="flow-title-main">Personal Loan Application</h1>
        </header>

        {/* PROGRESS BAR */}
        <div className="flow-progress-bar">
          <div className="progress-steps">
            {steps.map((step, index) => (
              <div key={index} className="progress-step-wrapper">
                <div className={`progress-step ${index <= currentStep ? "active" : ""} ${index < currentStep ? "completed" : ""}`}>
                  <div className="step-circle">
                    {index < currentStep ? "✓" : index + 1}
                  </div>
                  <span className="step-label">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`progress-line ${index < currentStep ? "completed" : ""}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FORM BODY */}
        <div className="flow-body">
          <CurrentStepComponent
            data={formData[["personal", "employer", "mortgage"][currentStep]]}
            caseData={caseData}
            onNext={handleNext}
            onPrevious={currentStep > 0 ? handlePrevious : null}
            setCaseData={setCaseData}
          />
        </div>
      </div>
    </div>
  );
}
