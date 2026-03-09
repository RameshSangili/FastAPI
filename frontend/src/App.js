import { useState } from "react";
import LoanApplicationFlow from "./LoanApplicationFlow";
import Chat from "./Chat";
import "./widget.css";

export default function App() {
  const [showLoanApp, setShowLoanApp] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  if (showLoanApp) {
    return <LoanApplicationFlow onBack={() => setShowLoanApp(false)} />;
  }

  return (
    <div>
      {/* TOP NAV */}
      <header className="bank-header">
        <div className="logo">🏦 MyBank</div>
        <nav>
          <span>Accounts</span>
          <span>Credit Cards</span>
          <span>Loans</span>
          <span>Mortgages</span>
          <span>Investing</span>
          <span>Support</span>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <h1>Banking Made Simple</h1>
        <p>Apply, track and manage your finances in one place.</p>
        <button className="primary-btn">Open an Account</button>
      </section>

      {/* FEATURES SECTION */}
      <section className="features">
        <h2>Welcome to MyBank Personal Banking</h2>
        <p className="subtitle">Explore products and services designed for your financial success</p>
        
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Find a chequing account</h3>
            <p>For daily spending, making bill payments and more</p>
            <button className="feature-link">Learn more →</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🐷</div>
            <h3>Find a savings account</h3>
            <p>Accounts to help you grow your savings</p>
            <button className="feature-link">Learn more →</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💵</div>
            <h3>Find a credit card</h3>
            <p>Credit cards offer a host of benefits and features</p>
            <button className="feature-link">Learn more →</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏠</div>
            <h3>Explore mortgage options</h3>
            <p>Get specialized advice to help with your home ownership journey</p>
            <button className="feature-link">Learn more →</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Personal investing</h3>
            <p>Registered plans and investments to help you reach your goals</p>
            <button className="feature-link">Learn more →</button>
          </div>

          <div className="feature-card highlight">
            <div className="feature-icon">💰</div>
            <h3>Personal Loans</h3>
            <p>Get the funds you need with competitive rates and flexible terms</p>
            <button 
              className="feature-cta"
              onClick={() => setShowLoanApp(true)}
            >
              Apply for Personal Loan →
            </button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Invest and trade online</h3>
            <p>Direct Investing - innovative tools for self-directed investors</p>
            <button className="feature-link">Learn more →</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👔</div>
            <h3>Personalized wealth advice</h3>
            <p>Goals-based planning and advice with a Wealth Advisor</p>
            <button className="feature-link">Learn more →</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Today's rates</h3>
            <p>Current rates for borrowing & investing products</p>
            <button className="feature-link">View rates →</button>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="benefits">
        <h2>Why Choose MyBank?</h2>
        <div className="benefits-grid">
          <div className="benefit">
            <div className="benefit-icon">🔒</div>
            <h3>Secure & Safe</h3>
            <p>Your money is protected with industry-leading security</p>
          </div>
          <div className="benefit">
            <div className="benefit-icon">📱</div>
            <h3>Mobile Banking</h3>
            <p>Bank anywhere, anytime with our award-winning app</p>
          </div>
          <div className="benefit">
            <div className="benefit-icon">💬</div>
            <h3>24/7 Support</h3>
            <p>Our team is always here to help you succeed</p>
          </div>
          <div className="benefit">
            <div className="benefit-icon">⚡</div>
            <h3>Quick Approvals</h3>
            <p>Get approved for loans and credit in minutes</p>
          </div>
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

      {/* CHAT WIDGET */}
      <Chat visible={chatOpen} onClose={() => setChatOpen(false)} />

      {/* CHAT LAUNCHER */}
      <button
        className="widget-launcher"
        onClick={() => setChatOpen(!chatOpen)}
        aria-label={chatOpen ? "Close chat" : "Open chat"}
      >
        💬
      </button>
    </div>
  );
}
