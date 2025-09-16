import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import "animate.css";

import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SystemAdminDash from "./pages/SystemAdminDash";
import NormalUserDash from "./pages/NormalUserDash";
import StoreOwnerDash from "./pages/StoreOwnerDash";

import {
  FaLinkedin, FaGithub, FaEnvelope, FaInstagram
} from "react-icons/fa";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

function Home() {
  return (
    <div className="home">
      <img
        src={`${process.env.PUBLIC_URL}/Welcome.svg`}
        alt="Welcome Banner"
        className="home-header-image"
      />
      <h2 className="animate__animated animate__fadeInDown">
        Welcome to StoreRank!
      </h2>
      <p className="animate__animated animate__fadeInUp animate__delay-1s">
        You must be logged in to access the platform features.
      </p>
    </div>
  );
}

function About() {
  return (
    <div className="about page-container">
      <h2>About StoreRank</h2>
      <img
        src={`${process.env.PUBLIC_URL}/About.svg`}
        alt="About StoreRank"
        className="about-banner-image"
      />
      <div className="blur-container">
        <p>
          StoreRank is a web application designed to help users discover and rate
          stores based on real customer feedback. The platform supports three
          types of users:
        </p>
        <ul>
          <li>
            <strong>System Administrator</strong> — manages users and stores,
            monitors ratings, and has full dashboard access.
          </li>
          <li>
            <strong>Normal User</strong> — can register, log in, browse stores,
            submit ratings (1 to 5), and update their own ratings.
          </li>
          <li>
            <strong>Store Owner</strong> — can view ratings for their store and
            track customer feedback through their dashboard.
          </li>
        </ul>
        <p>The application ensures:</p>
        <ul>
          <li>A single login system with role-based access.</li>
          <li>User-friendly search & filter for stores.</li>
          <li>Strong form validations for secure and accurate data entry.</li>
          <li>Organized dashboards for admins and store owners.</li>
        </ul>
        <p>
          StoreRank’s mission is to create a transparent and reliable platform
          where customers’ voices help shape better store experiences.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <nav className="navbar">
            <h1>StoreRank</h1>
            <div className="navbar-links">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/login">Login</Link>
            </div>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/about-us" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <SystemAdminDash />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <NormalUserDash />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/store-owner"
                element={
                  <ProtectedRoute allowedRoles={["owner"]}>
                    <StoreOwnerDash />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          <footer className="footer">
            <p>© {new Date().getFullYear()} StoreRank. All rights reserved.</p>
            <p>
              Developed by <strong>Niranjan Umesh Mali</strong>
            </p>
            <div className="footer-links">
              <Link to="/privacy-policy">Privacy Policy</Link> |{" "}
              <Link to="/terms-of-service">Terms of Service</Link> |{" "}
              <Link to="/about-us">About Us</Link>
            </div>
            <div className="footer-socials">
              <a
                href="https://www.linkedin.com/in/niranjan-mali-297b2427a"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://github.com/Mali-Niranjan"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </a>
              <a href="mailto:cyclic666w@gmail.com" aria-label="Email">
                <FaEnvelope size={20} />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}
