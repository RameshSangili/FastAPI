

import { useState } from "react";
import { submitMortgageInfo } from "./pegaService";

export default function MortgageInfoForm({ data, caseData, onPrevious }) {
  const [formData, setFormData] = useState({
    CurrentMortgages: data.CurrentMortgages || "1 active mortgage",
    MortgageBalances: data.MortgageBalances || "125000.50",
    PaymentHistory: data.PaymentHistory || "On time, no late payments",
    LoanPurpose: data.LoanPurpose || "Home Improvement"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const assignmentId = caseData.data.data.caseInfo.assignments[0].ID;
      console.log("Submitting mortgage info to assignment:", assignmentId);
      console.log("Using ETag:", caseData.etag);
      
      await submitMortgageInfo(assignmentId, formData, caseData.etag);
      console.log("Mortgage info submitted successfully");

      setSuccess(true);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="form-card success-card">
        <div className="success-icon">✓</div>
        <h2 className="success-title">Application Submitted!</h2>
        <p className="success-message">
          Your loan application has been successfully submitted. 
          <br/>
          Case ID: <strong>{caseData.data.data.caseInfo.ID}</strong>
        </p>
        <p className="success-submessage">
          We'll review your application and contact you within 2-3 business days.
        </p>
        <button className="btn-primary" onClick={() => window.location.reload()}>
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <div className="form-card">
      <div className="form-header-section">
        <h2 className="form-title">Mortgage Information</h2>
        <p className="form-subtitle">Final step - tell us about your current mortgages</p>
      </div>

      <form onSubmit={handleSubmit} className="loan-form">
        <div className="form-grid">
          <div className="form-group full-width">
            <label htmlFor="CurrentMortgages">Current Mortgages *</label>
            <input
              type="text"
              id="CurrentMortgages"
              name="CurrentMortgages"
              value={formData.CurrentMortgages}
              onChange={handleChange}
              required
              placeholder="1 active mortgage"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="MortgageBalances">Mortgage Balance ($) *</label>
            <input
              type="number"
              step="0.01"
              id="MortgageBalances"
              name="MortgageBalances"
              value={formData.MortgageBalances}
              onChange={handleChange}
              required
              placeholder="125000.50"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="PaymentHistory">Payment History *</label>
            <textarea
              id="PaymentHistory"
              name="PaymentHistory"
              value={formData.PaymentHistory}
              onChange={handleChange}
              required
              placeholder="On-time payments for the past 24 months"
              rows="3"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="LoanPurpose">Loan Purpose *</label>
            <input
              type="text"
              id="LoanPurpose"
              name="LoanPurpose"
              value={formData.LoanPurpose}
              onChange={handleChange}
              required
              placeholder="Home Improvement"
            />
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠</span>
            {error}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onPrevious}
          >
            ← Previous
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
