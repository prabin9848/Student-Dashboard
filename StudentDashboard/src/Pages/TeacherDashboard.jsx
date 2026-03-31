import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import {
  collection, addDoc, deleteDoc, doc,
  onSnapshot, orderBy, query, serverTimestamp, where
} from "firebase/firestore";
import { auth, db } from "../firebase";
import "./TeacherDashboard.css";

const TeacherDashboard = ({ setPage, currentUser }) => {
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(true);

  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [annoTitle, setAnnoTitle] = useState("");
  const [annoMsg, setAnnoMsg] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    // Redirect if not a teacher
    if (currentUser && currentUser.role !== "teacher") {
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

    // Fetch all students from users collection
    const qStudents = query(collection(db, "users"), where("role", "==", "student"));
    const unsubStudents = onSnapshot(qStudents, (snap) => {
      setStudents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubCourses();
      unsubAnnouncements();
      unsubStudents();
    };
  }, [currentUser, setPage]);

  const handleLogout = async () => {
    await signOut(auth);
    setPage("selection");
  };

  const addCourse = async () => {
    if (!courseTitle.trim()) return;
    setFormLoading(true);
    await addDoc(collection(db, "courses"), {
      title: courseTitle,
      description: courseDesc,
      teacherId: currentUser?.uid,
      teacherEmail: currentUser?.email,
      createdAt: serverTimestamp(),
    });
    setCourseTitle("");
    setCourseDesc("");
    setFormLoading(false);
  };

  const addAnnouncement = async () => {
    if (!annoTitle.trim()) return;
    setFormLoading(true);
    await addDoc(collection(db, "announcements"), {
      title: annoTitle,
      message: annoMsg,
      teacherId: currentUser?.uid,
      teacherEmail: currentUser?.email,
      createdAt: serverTimestamp(),
    });
    setAnnoTitle("");
    setAnnoMsg("");
    setFormLoading(false);
  };

  const deleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      await deleteDoc(doc(db, "courses", id));
    }
  };

  const deleteAnnouncement = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      await deleteDoc(doc(db, "announcements", id));
    }
  };

  if (loading) {
    return (
      <div className="td-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="td-root">
      {/* Sidebar */}
      <aside className="td-sidebar">
        <div className="td-sidebar-header">
          <span className="td-sidebar-logo">Teacher Portal</span>
        </div>
        <nav className="td-sidebar-nav">
          <button
            className={`td-sidebar-link ${activeTab === "home" ? "active" : ""}`}
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
            className={`td-sidebar-link ${activeTab === "courses" ? "active" : ""}`}
            onClick={() => setActiveTab("courses")}
          >
            <span className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </span>
            Manage Courses
          </button>
          <button
            className={`td-sidebar-link ${activeTab === "announce" ? "active" : ""}`}
            onClick={() => setActiveTab("announce")}
          >
            <span className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </span>
            Post Announcement
          </button>
          <button
            className={`td-sidebar-link ${activeTab === "students" ? "active" : ""}`}
            onClick={() => setActiveTab("students")}
          >
            <span className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a7 7 0 0 0-7-7H5a7 7 0 0 0-7 7v2" />
                <circle cx="12" cy="9" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            Students
          </button>
          <button
            className={`td-sidebar-link ${activeTab === "profile" ? "active" : ""}`}
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
      <main className="td-main">
        {/* Top Navbar */}
        <header className="td-navbar">
          <h1 className="td-navbar-title">
            {activeTab === "home" && "Dashboard"}
            {activeTab === "courses" && "Manage Courses"}
            {activeTab === "announce" && "Post Announcement"}
            {activeTab === "students" && "Students"}
            {activeTab === "profile" && "My Profile"}
          </h1>
          <div className="td-navbar-right">
            <span className="td-navbar-user">{currentUser?.email}</span>
            <button className="td-navbar-logout" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        {/* Content Area */}
        <div className="td-content">
          {/* Home Tab */}
          {activeTab === "home" && (
            <div className="td-home">
              <div className="td-stats-grid">
                <div className="td-stat-card">
                  <div className="td-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </div>
                  <div className="td-stat-info">
                    <span className="td-stat-value">{courses.length}</span>
                    <span className="td-stat-label">Total Courses</span>
                  </div>
                </div>
                <div className="td-stat-card">
                  <div className="td-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a7 7 0 0 0-7-7H5a7 7 0 0 0-7 7v2" />
                      <circle cx="12" cy="9" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="td-stat-info">
                    <span className="td-stat-value">{students.length}</span>
                    <span className="td-stat-label">Total Students</span>
                  </div>
                </div>
                <div className="td-stat-card">
                  <div className="td-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </div>
                  <div className="td-stat-info">
                    <span className="td-stat-value">{announcements.length}</span>
                    <span className="td-stat-label">Announcements Posted</span>
                  </div>
                </div>
              </div>

              <div className="td-section">
                <h2 className="td-section-title">Quick Actions</h2>
                <div className="td-quick-actions">
                  <button onClick={() => setActiveTab("courses")}>+ Add Course</button>
                  <button onClick={() => setActiveTab("announce")}>+ Post Announcement</button>
                </div>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className="td-section">
              <h2 className="td-section-title">Add New Course</h2>
              <div className="td-form">
                <div className="td-form-group">
                  <label>Course Title</label>
                  <input
                    type="text"
                    placeholder="Enter course title"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                  />
                </div>
                <div className="td-form-group">
                  <label>Course Description</label>
                  <textarea
                    rows={3}
                    placeholder="Enter course description..."
                    value={courseDesc}
                    onChange={(e) => setCourseDesc(e.target.value)}
                  />
                </div>
                <button className="td-add-btn" onClick={addCourse} disabled={formLoading}>
                  {formLoading ? "Adding..." : "+ Add Course"}
                </button>
              </div>

              <h2 className="td-section-title" style={{ marginTop: "32px" }}>All Courses</h2>
              {courses.length === 0 ? (
                <div className="td-empty">
                  <div className="td-empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </div>
                  <p>No courses yet. Add one above!</p>
                </div>
              ) : (
                <div className="td-courses-list">
                  {courses.map((c) => (
                    <div className="td-card" key={c.id}>
                      <div className="td-card-header">
                        <h3>{c.title}</h3>
                        <button className="td-delete-btn" onClick={() => deleteCourse(c.id)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: "16px", height: "16px", verticalAlign: "middle", marginRight: "6px"}}>
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                          Delete
                        </button>
                      </div>
                      <p className="td-card-desc">{c.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === "announce" && (
            <div className="td-section">
              <h2 className="td-section-title">Post Announcement</h2>
              <div className="td-form">
                <div className="td-form-group">
                  <label>Announcement Title</label>
                  <input
                    type="text"
                    placeholder="Enter announcement title"
                    value={annoTitle}
                    onChange={(e) => setAnnoTitle(e.target.value)}
                  />
                </div>
                <div className="td-form-group">
                  <label>Message</label>
                  <textarea
                    rows={4}
                    placeholder="Enter announcement message..."
                    value={annoMsg}
                    onChange={(e) => setAnnoMsg(e.target.value)}
                  />
                </div>
                <button className="td-add-btn" onClick={addAnnouncement} disabled={formLoading}>
                  {formLoading ? "Posting..." : "+ Post Announcement"}
                </button>
              </div>

              <h2 className="td-section-title" style={{ marginTop: "32px" }}>All Announcements</h2>
              {announcements.length === 0 ? (
                <div className="td-empty">
                  <div className="td-empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </div>
                  <p>No announcements yet.</p>
                </div>
              ) : (
                <div className="td-announcements-list">
                  {announcements.map((a) => (
                    <div className="td-card" key={a.id}>
                      <div className="td-card-header">
                        <h3>{a.title}</h3>
                        <button className="td-delete-btn" onClick={() => deleteAnnouncement(a.id)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: "16px", height: "16px", verticalAlign: "middle", marginRight: "6px"}}>
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                          Delete
                        </button>
                      </div>
                      <p className="td-card-desc">{a.message}</p>
                      <span className="td-card-date">
                        {a.createdAt?.toDate().toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <div className="td-section">
              <h2 className="td-section-title">Registered Students</h2>
              {students.length === 0 ? (
                <div className="td-empty">
                  <div className="td-empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a7 7 0 0 0-7-7H5a7 7 0 0 0-7 7v2" />
                      <circle cx="12" cy="9" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <p>No students registered yet.</p>
                </div>
              ) : (
                <div className="td-students-list">
                  {students.map((student) => (
                    <div className="td-card" key={student.id}>
                      <div className="td-card-header">
                        <h3>{student.email}</h3>
                        <span className="td-badge">Student</span>
                      </div>
                      <p className="td-card-desc">
                        <strong>User ID:</strong> {student.id}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="td-profile">
              <div className="td-profile-card">
                <div className="td-profile-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h2>Teacher Profile</h2>
                <div className="td-profile-info">
                  <div className="td-profile-field">
                    <label>Email</label>
                    <p>{currentUser?.email}</p>
                  </div>
                  <div className="td-profile-field">
                    <label>Role</label>
                    <p>Teacher</p>
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

export default TeacherDashboard;
