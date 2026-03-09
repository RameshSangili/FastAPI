import { useState } from "react";
import "./widget.css";

export default function LoanApplication({ onBack }) {
  const [loading, setLoading] = useState(true);

  const handleIframeLoad = () => {
    // Give it a moment for Pega to initialize
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="loan-app-page">
      {/* HEADER */}
      <header className="bank-header">
        <div className="logo">🏦 MyBank</div>
        <nav>
          <span onClick={onBack} className="back-link">← Back to Home</span>
          <span>Accounts</span>
          <span>Credit Cards</span>
          <span>Loans</span>
          <span>Mortgages</span>
          <span>Investing</span>
          <span>Support</span>
        </nav>
      </header>

      {/* LOAN APP HERO */}
      <section className="loan-hero">
        <div className="loan-hero-content">
          <h1>Personal Loan Application</h1>
          <p>Get the funds you need with competitive rates and quick approval</p>
          
          <div className="loan-features">
            <div className="loan-feature">
              <span className="check">✓</span>
              <span>Competitive Interest Rates</span>
            </div>
            <div className="loan-feature">
              <span className="check">✓</span>
              <span>Flexible Repayment Terms</span>
            </div>
            <div className="loan-feature">
              <span className="check">✓</span>
              <span>Quick Approval Process</span>
            </div>
            <div className="loan-feature">
              <span className="check">✓</span>
              <span>No Hidden Fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* LOAN APPLICATION FORM */}
      <section className="loan-form-section">
        <div className="loan-form-container">
          <div className="form-header">
            <h2>Start Your Application</h2>
            <p>Complete the form below to begin your loan application journey</p>
          </div>

          <div className="pega-embed-container">
            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading loan application form...</p>
              </div>
            )}
            
            {/* Load the standalone HTML file in iframe */}
            <iframe
              src="/pega-embed.html"
              title="Loan Application Form"
              className="pega-iframe"
              onLoad={handleIframeLoad}
              style={{ 
                display: loading ? 'none' : 'block',
                width: '100%',
                height: '900px',
                border: 'none'
              }}
              allow="clipboard-read; clipboard-write"
            />
          </div>

          <div className="form-footer">
            <p className="privacy-note">
              🔒 Your information is secure and encrypted. We respect your privacy.
            </p>
          </div>
        </div>
      </section>

      {/* LOAN INFO */}
      <section className="loan-info">
        <h2>Why Choose MyBank Personal Loans?</h2>
        
        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon">💵</div>
            <h3>Borrow $1,000 - $50,000</h3>
            <p>Flexible loan amounts to meet your needs</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">📅</div>
            <h3>1-7 Year Terms</h3>
            <p>Choose a repayment schedule that works for you</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">⚡</div>
            <h3>Same-Day Approval</h3>
            <p>Get approved and funded quickly</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">📊</div>
            <h3>Rates from 6.99%</h3>
            <p>Competitive rates based on creditworthiness</p>
          </div>
        </div>

        <div className="loan-uses">
          <h3>Common Uses for Personal Loans</h3>
          <ul>
            <li>✓ Debt consolidation</li>
            <li>✓ Home improvements</li>
            <li>✓ Medical expenses</li>
            <li>✓ Major purchases</li>
            <li>✓ Wedding expenses</li>
            <li>✓ Vacation funding</li>
            <li>✓ Emergency expenses</li>
            <li>✓ Education costs</li>
          </ul>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About MyBank</h4>
            <p>Leading financial institution committed to your success</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Contact Us</li>
              <li>Careers</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>1-800-MYBANK-1</p>
            <p>support@mybank.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 MyBank. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}