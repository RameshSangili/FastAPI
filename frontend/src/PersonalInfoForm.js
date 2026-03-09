import { useState } from "react";
import { createCase, submitPersonalInfo } from "./pegaService";

export default function PersonalInfoForm({ data, caseData, onNext, setCaseData }) {
  const [formData, setFormData] = useState({
    FirstName: data.FirstName || "John",
    LastName: data.LastName || "Doe",
    PhoneNumber: data.PhoneNumber || "1234567890",
    EmailAddress: data.EmailAddress || "john.doe@example.com",
    LoanPurpose: data.LoanPurpose || "Home Improvement",
    LoanAmountRequested: data.LoanAmountRequested || "50000",
    IdentificationNumber: data.IdentificationNumber || "ABC123",
    AnnualIncome: data.AnnualIncome || "75000"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let caseInfo = caseData;
      if (!caseInfo) {
        console.log("Creating new case...");
        const caseResponse = await createCase();
        caseInfo = caseResponse;
        setCaseData(caseInfo);
        console.log("Case created:", caseInfo.data.data.caseInfo.ID);
        console.log("ETag:", caseInfo.etag);
      }

      const assignmentId = caseInfo.data.data.caseInfo.assignments[0].ID;
      console.log("Submitting personal info to assignment:", assignmentId);
      
      const response = await submitPersonalInfo(assignmentId, formData, caseInfo.etag);
      
      // Update case data with new etag
      setCaseData({
        data: response.data,
        etag: response.etag
      });
      
      console.log("Personal info submitted successfully");
      console.log("New ETag:", response.etag);

      onNext(formData);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <div className="form-header-section">
        <h2 className="form-title">Personal Information</h2>
        <p className="form-subtitle">Tell us about yourself to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="loan-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="FirstName">First Name *</label>
            <input
              type="text"
              id="FirstName"
              name="FirstName"
              value={formData.FirstName}
              onChange={handleChange}
              required
              placeholder="John"
            />
          </div>

          <div className="form-group">
            <label htmlFor="LastName">Last Name *</label>
            <input
              type="text"
              id="LastName"
              name="LastName"
              value={formData.LastName}
              onChange={handleChange}
              required
              placeholder="Doe"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="PhoneNumber">Phone Number *</label>
            <input
              type="tel"
              id="PhoneNumber"
              name="PhoneNumber"
              value={formData.PhoneNumber}
              onChange={handleChange}
              required
              placeholder="1234567890"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="EmailAddress">Email Address *</label>
            <input
              type="email"
              id="EmailAddress"
              name="EmailAddress"
              value={formData.EmailAddress}
              onChange={handleChange}
              required
              placeholder="john.doe@example.com"
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

          <div className="form-group">
            <label htmlFor="LoanAmountRequested">Loan Amount ($) *</label>
            <input
              type="number"
              id="LoanAmountRequested"
              name="LoanAmountRequested"
              value={formData.LoanAmountRequested}
              onChange={handleChange}
              required
              placeholder="50000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="IdentificationNumber">ID Number *</label>
            <input
              type="text"
              id="IdentificationNumber"
              name="IdentificationNumber"
              value={formData.IdentificationNumber}
              onChange={handleChange}
              required
              placeholder="ABC123"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="AnnualIncome">Annual Income ($) *</label>
            <input
              type="number"
              id="AnnualIncome"
              name="AnnualIncome"
              value={formData.AnnualIncome}
              onChange={handleChange}
              required
              placeholder="75000"
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
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Processing...
              </>
            ) : (
              "Next →"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}