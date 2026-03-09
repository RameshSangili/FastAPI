
import { useState } from "react";
import { submitEmployerInfo } from "./pegaService";

export default function EmployerInfoForm({ data, caseData, onNext, onPrevious, setCaseData }) {
  const [formData, setFormData] = useState({
    EmploymentStatus: data.EmploymentStatus || "Full-time",
    EmployerName: data.EmployerName || "ABC Corporation",
    EmployerAddress: data.EmployerAddress || "123 Main Street, Anytown USA",
    EmployerPhoneNumber: data.EmployerPhoneNumber || "1234567890",
    EmployerContactName: data.EmployerContactName || "John Doe"
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
      const assignmentId = caseData.data.data.caseInfo.assignments[0].ID;
      console.log("Submitting employer info to assignment:", assignmentId);
      console.log("Using ETag:", caseData.etag);
      
      const response = await submitEmployerInfo(assignmentId, formData, caseData.etag);
      
      // Update case data with new etag
      setCaseData({
        data: response.data,
        etag: response.etag
      });
      
      console.log("Employer info submitted successfully");
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
        <h2 className="form-title">Employment Information</h2>
        <p className="form-subtitle">Tell us about your current employment</p>
      </div>

      <form onSubmit={handleSubmit} className="loan-form">
        <div className="form-grid">
          <div className="form-group full-width">
            <label htmlFor="EmploymentStatus">Employment Status *</label>
            <select
              id="EmploymentStatus"
              name="EmploymentStatus"
              value={formData.EmploymentStatus}
              onChange={handleChange}
              required
            >
              <option value="">Select status</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label htmlFor="EmployerName">Employer Name *</label>
            <input
              type="text"
              id="EmployerName"
              name="EmployerName"
              value={formData.EmployerName}
              onChange={handleChange}
              required
              placeholder="ABC Corporation"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="EmployerAddress">Employer Address *</label>
            <input
              type="text"
              id="EmployerAddress"
              name="EmployerAddress"
              value={formData.EmployerAddress}
              onChange={handleChange}
              required
              placeholder="123 Main Street, Anytown USA"
            />
          </div>

          <div className="form-group">
            <label htmlFor="EmployerPhoneNumber">Employer Phone *</label>
            <input
              type="tel"
              id="EmployerPhoneNumber"
              name="EmployerPhoneNumber"
              value={formData.EmployerPhoneNumber}
              onChange={handleChange}
              required
              placeholder="1234567890"
            />
          </div>

          <div className="form-group">
            <label htmlFor="EmployerContactName">Contact Person *</label>
            <input
              type="text"
              id="EmployerContactName"
              name="EmployerContactName"
              value={formData.EmployerContactName}
              onChange={handleChange}
              required
              placeholder="Jane Smith"
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

