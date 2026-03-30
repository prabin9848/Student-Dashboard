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
            <div className="sel-card-icon">👨‍🎓</div>
            <h2>Student</h2>
            <p>Access your courses and announcements</p>
          </div>

          <div className="sel-card" onClick={() => setPage("teacherLogin")}>
            <div className="sel-card-icon">👩‍🏫</div>
            <h2>Teacher</h2>
            <p>Manage courses and post announcements</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Selection;
