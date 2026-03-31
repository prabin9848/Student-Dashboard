import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./StudentDashboard.css";

const StudentDashboard = ({ setPage, currentUser }) => {
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not a student
    if (currentUser && currentUser.role !== "student") {
      setPage("selection");
      return;
    }

    const qCourses = query(collection(db, "courses"), orderBy("createdAt", "desc"));
    const unsubCourses = onSnapshot(qCourses, (snap) => {
      setCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    const qAnnouncements = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const unsubAnnouncements = onSnapshot(qAnnouncements, (snap) => {
      setAnnouncements(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubCourses();
      unsubAnnouncements();
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setPage("selection");
  };


  if (loading) {
    return (
      <div className="sd-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="sd-root">
      {/* Sidebar */}
      <aside className="sd-sidebar">
        <div className="sd-sidebar-header">
          <span className="sd-sidebar-logo">Student Portal</span>
        </div>
        <nav className="sd-sidebar-nav">
          <button
            className={`sd-sidebar-link ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            <span className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            Home
          </button>
          <button
            className={`sd-sidebar-link ${activeTab === "courses" ? "active" : ""}`}
            onClick={() => setActiveTab("courses")}
          >
            <span className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </span>
            My Courses
          </button>
          <button
            className={`sd-sidebar-link ${activeTab === "announcements" ? "active" : ""}`}
            onClick={() => setActiveTab("announcements")}
          >
            <span className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </span>
            Announcements
          </button>
          <button
            className={`sd-sidebar-link ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <span className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            Profile
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="sd-main">
        {/* Top Navbar */}
        <header className="sd-navbar">
          <h1 className="sd-navbar-title">
            {activeTab === "home" && "Dashboard"}
            {activeTab === "courses" && "My Courses"}
            {activeTab === "announcements" && "Announcements"}
            {activeTab === "profile" && "My Profile"}
          </h1>
          <div className="sd-navbar-right">
            <span className="sd-navbar-user">{currentUser?.email}</span>
            <button className="sd-navbar-logout" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        {/* Content Area */}
        <div className="sd-content">
          {/* Home Tab */}
          {activeTab === "home" && (
            <div className="sd-home">
              <div className="sd-stats-grid">
                <div className="sd-stat-card">
                  <div className="sd-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </div>
                  <div className="sd-stat-info">
                    <span className="sd-stat-value">{courses.length}</span>
                    <span className="sd-stat-label">Total Courses</span>
                  </div>
                </div>
                <div className="sd-stat-card">
                  <div className="sd-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </div>
                  <div className="sd-stat-info">
                    <span className="sd-stat-value">{announcements.length}</span>
                    <span className="sd-stat-label">Announcements</span>
                  </div>
                </div>
              </div>

              <div className="sd-section">
                <h2 className="sd-section-title">Recent Announcements</h2>
                {announcements.length === 0 ? (
                  <div className="sd-empty">No announcements yet.</div>
                ) : (
                  announcements.slice(0, 3).map((a) => (
                    <div className="sd-card" key={a.id}>
                      <div className="sd-card-header">
                        <h3>{a.title}</h3>
                        <span className="sd-badge">New</span>
                      </div>
                      <p className="sd-card-text">{a.message}</p>
                      <span className="sd-card-date">{a.createdAt?.toDate().toLocaleDateString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className="sd-section">
              {courses.length === 0 ? (
                <div className="sd-empty">
                  <div className="sd-empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </div>
                  <p>No courses available yet.</p>
                  <span>Check back later for updates.</span>
                </div>
              ) : (
                <div className="sd-courses-grid">
                  {courses.map((c) => (
                    <div className="sd-course-card" key={c.id}>
                      <div className="sd-course-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                      </div>
                      <h3>{c.title}</h3>
                      <p className="sd-course-desc">{c.description}</p>
                      <div className="sd-course-footer">
                        <span className="sd-course-status">Active</span>
                        <span className="sd-course-teacher">Instructor</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === "announcements" && (
            <div className="sd-section">
              {announcements.length === 0 ? (
                <div className="sd-empty">
                  <div className="sd-empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </div>
                  <p>No announcements yet.</p>
                  <span>Check back later for updates.</span>
                </div>
              ) : (
                announcements.map((a) => (
                  <div className="sd-card" key={a.id}>
                    <div className="sd-card-header">
                      <h3>{a.title}</h3>
                      <span className="sd-badge">Announcement</span>
                    </div>
                    <p className="sd-card-text">{a.message}</p>
                    <span className="sd-card-date">
                      {a.createdAt?.toDate().toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="sd-profile">
              <div className="sd-profile-card">
                <div className="sd-profile-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h2>Student Profile</h2>
                <div className="sd-profile-info">
                  <div className="sd-profile-field">
                    <label>Email</label>
                    <p>{currentUser?.email}</p>
                  </div>
                  <div className="sd-profile-field">
                    <label>Role</label>
                    <p>Student</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
