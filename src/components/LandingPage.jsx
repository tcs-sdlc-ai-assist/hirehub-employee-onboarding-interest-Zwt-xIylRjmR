import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <>
      <section className="landing-hero">
        <div className="hero">
          <h1>Welcome to HireHub</h1>
          <p>
            Join an innovative team that's shaping the future. Express your interest
            and take the first step toward an exciting career with us.
          </p>
          <Link to="/apply" className="btn btn-primary">
            Express Your Interest
          </Link>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Join Us?</h2>
        <div className="feature-cards features-grid">
          <div className="feature-card">
            <div className="feature-card-icon">🚀</div>
            <h3>Innovation</h3>
            <p>
              Work on cutting-edge projects that push boundaries and challenge the
              status quo. We embrace new ideas and creative solutions.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">📈</div>
            <h3>Growth</h3>
            <p>
              Accelerate your career with mentorship programs, learning opportunities,
              and a clear path for professional development.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">🤝</div>
            <h3>Culture</h3>
            <p>
              Be part of a diverse, inclusive, and collaborative workplace where every
              voice is heard and valued.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">🌍</div>
            <h3>Impact</h3>
            <p>
              Make a meaningful difference through projects that positively impact
              communities and industries worldwide.
            </p>
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <div className="bottom-cta">
          <h2>Ready to Start Your Journey?</h2>
          <p>
            Take the first step toward a rewarding career. Submit your interest and
            our team will be in touch.
          </p>
          <Link to="/apply" className="btn btn-primary">
            Apply Now
          </Link>
        </div>
      </section>
    </>
  );
}

export default LandingPage;