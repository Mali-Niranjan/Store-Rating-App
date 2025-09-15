import React from "react";
import "./TermsOfServicePage.css";

export default function TermsOfServicePage() {
  return (
    <div className="page-container">
      <h2>Terms of Service</h2>
      <div className="blur-container">
        <p>
          Welcome to StoreRank. These Terms of Service govern your use of our web application designed to help users discover and rate stores.
        </p>
        <h3>Use of the Platform</h3>
        <p>
          By accessing or using StoreRank, you agree to comply with all applicable laws and regulations. You acknowledge that your participation is voluntary and you must provide accurate information during registration.
        </p>
        <h3>User Accounts</h3>
        <p>
          Users must register an account to access platform features. You are responsible for safeguarding your login credentials and agree not to share them.
        </p>
        <h3>User Content and Ratings</h3>
        <p>
          Users may submit ratings and feedback for stores. You agree to provide honest, truthful, and respectful reviews and to not post offensive or illegal content.
        </p>
        
        <h3>Limitation of Liability</h3>
        <p>
          StoreRank does not guarantee the accuracy of user-submitted ratings and is not liable for any damages resulting from your use of the platform.
        </p>
        <h3>Changes to Terms</h3>
        <p>
          We may update these Terms of Service at any time. Continued use of the platform after updates constitutes acceptance of the new terms.
        </p>
        <h3>Contact Us</h3>
        <p>
          For questions regarding these Terms of Service, please contact us at <a href="mailto:support@storerank.com">support@storerank.com</a>.
        </p>
      </div>
    </div>
  );
}
