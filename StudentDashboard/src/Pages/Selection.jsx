import './Selection.css';

const Selection = ({ setPage }) => {
  return (
    <div className="sel-root">
      <div className="sel-content">
        <div className="sel-header">
          <h1>Welcome to Student Dashboard</h1>
          <p>Select your role to continue</p>
        </div>

        <div className="sel-cards">
          <div className="sel-card" onClick={() => setPage("studentLogin")}>
            <div className="sel-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2>Student</h2>
            <p>Access your courses and announcements</p>
          </div>

          <div className="sel-card" onClick={() => setPage("teacherLogin")}>
            <div className="sel-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a7 7 0 0 0-7-7H5a7 7 0 0 0-7 7v2" />
                <circle cx="12" cy="9" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h2>Teacher</h2>
            <p>Manage courses and post announcements</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Selection;
