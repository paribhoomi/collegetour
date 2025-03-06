import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CampusMap from '../components/Map/CampusMap';
import EventList from '../components/Events/EventList';
import { useAuth } from '../hooks/useAuth';
import './pageStyles.css';



const Home = () => {
  const { user } = useAuth();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching featured events
    setTimeout(() => {
      setFeaturedEvents([
        { id: 1, title: 'Campus Open Day', date: '2025-03-15', location: 'Main Quad' },
        { id: 2, title: 'Student Orientation', date: '2025-03-20', location: 'Student Center' },
        { id: 3, title: 'Faculty Meet & Greet', date: '2025-03-22', location: 'Alumni Hall' }
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Discover Your Future Campus</h1>
          <p>Explore facilities, events, and everything our campus has to offer</p>
          {!user && (
            <div className="cta-buttons">
              <Link to="/login" className="btn btn-primary">Login</Link>
              <Link to="/register" className="btn btn-secondary">Register</Link>
            </div>
          )}
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon map-icon"></div>
          <h3>Interactive Campus Map</h3>
          <p>Explore our campus with an interactive map that helps you navigate to important locations.</p>
          <Link to="/map" className="feature-link">Explore Map</Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon events-icon"></div>
          <h3>Upcoming Events</h3>
          <p>Stay updated with the latest campus events, workshops, and activities.</p>
          <Link to="/events" className="feature-link">View Events</Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon facilities-icon"></div>
          <h3>Campus Facilities</h3>
          <p>Discover various facilities available on campus including libraries, labs, and recreational areas.</p>
          <Link to="/facilities" className="feature-link">Find Facilities</Link>
        </div>
      </div>

      <div className="map-preview-section">
        <h2>Campus at a Glance</h2>
        <div className="map-container">
          <CampusMap preview={true} />
        </div>
      </div>

      <div className="events-section">
        <h2>Featured Events</h2>
        {isLoading ? (
          <div className="loading-spinner">Loading events...</div>
        ) : (
          <EventList events={featuredEvents} preview={true} />
        )}
        <Link to="/events" className="view-all-link">View All Events</Link>
      </div>

      <div className="testimonial-section">
        <h2>What Students Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <p>"The campus tour app made my orientation week so much easier! I found all my classes without getting lost."</p>
            <div className="student-info">
              <div className="student-avatar"></div>
              <span>Jessica T., Freshman</span>
            </div>
          </div>
          <div className="testimonial-card">
            <p>"As a transfer student, I appreciated how easy it was to find events and connect with campus life."</p>
            <div className="student-info">
              <div className="student-avatar"></div>
              <span>Miguel R., Junior</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;