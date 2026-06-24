import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="landing">
      <section className="hero">
        <h1>Manage Your Projects<br />with Clarity</h1>
        <p>A clean dashboard to track your work, manage your profile,<br />and stay on top of every project.</p>
        <div className="hero-buttons">
          {user ? (
            <Link to="/dashboard" className="btn-white">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/register" className="btn-white">Get Started Free</Link>
              <Link to="/login" className="btn-outline-white">Sign In</Link>
            </>
          )}
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Dashboard Overview</h3>
          <p>See all your project stats at a glance — active, completed, and in progress.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📁</div>
          <h3>Project Management</h3>
          <p>Create, edit, and track projects with status labels, tech stack, and GitHub links.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">👤</div>
          <h3>User Profile</h3>
          <p>Manage your personal info, bio, and account settings in one place.</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
