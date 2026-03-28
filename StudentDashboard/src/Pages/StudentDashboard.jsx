import { useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import "./StudentDashboard.css";

const StudentDashboard = ({ setPage, currentUser }) => {
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [activeTab, setActiveTab] = useState("courses");

  useEffect(() => {
    const q = query(collection(db, "courses"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setAnnouncements(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="sd-root">
      {/* Navbar */}
      <nav className="sd-nav">
        <span className="sd-nav-logo">🐼 Student Portal</span>
        <div className="sd-nav-links">
          <button
            className={`sd-nav-link ${activeTab === "courses" ? "active" : ""}`}
            onClick={() => setActiveTab("courses")}
          >
            📚 Courses
          </button>
          <button
            className={`sd-nav-link ${activeTab === "announcements" ? "active" : ""}`}
            onClick={() => setActiveTab("announcements")}
          >
            📢 Announcements
          </button>
        </div>
        <div className="sd-nav-right">
          <span className="sd-nav-user">{currentUser?.email}</span>
          <button className="sd-nav-logout" onClick={() => setPage("selection")}>Logout</button>
        </div>
      </nav>

      {/* Body */}
      <div className="sd-body">
        <div className="sd-greeting">
          <h1>Welcome back! 👋</h1>
          <p>Here's what your teacher has shared with you.</p>
        </div>

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div className="sd-section">
            <h2 className="sd-section-title">📚 Your Courses</h2>
            {courses.length === 0 ? (
              <div className="sd-empty">No courses yet. Check back later!</div>
            ) : (
              courses.map((c) => (
                <div className="sd-card" key={c.id}>
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === "announcements" && (
          <div className="sd-section">
            <h2 className="sd-section-title">📢 Announcements</h2>
            {announcements.length === 0 ? (
              <div className="sd-empty">No announcements yet.</div>
            ) : (
              announcements.map((a) => (
                <div className="sd-card" key={a.id}>
                  <h3>{a.title}</h3>
                  <p>{a.message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;