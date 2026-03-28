import { useState, useEffect } from "react";
import {
  collection, addDoc, deleteDoc, doc,
  onSnapshot, orderBy, query, serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";
import "./TeacherDashboard.css";

const TeacherDashboard = ({ setPage, currentUser }) => {
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [activeTab, setActiveTab] = useState("courses");

  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [annoTitle, setAnnoTitle] = useState("");
  const [annoMsg, setAnnoMsg] = useState("");
  const [loading, setLoading] = useState(false);

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

  const addCourse = async () => {
    if (!courseTitle.trim()) return;
    setLoading(true);
    await addDoc(collection(db, "courses"), {
      title: courseTitle,
      description: courseDesc,
      createdAt: serverTimestamp(),
    });
    setCourseTitle("");
    setCourseDesc("");
    setLoading(false);
  };

  const addAnnouncement = async () => {
    if (!annoTitle.trim()) return;
    setLoading(true);
    await addDoc(collection(db, "announcements"), {
      title: annoTitle,
      message: annoMsg,
      createdAt: serverTimestamp(),
    });
    setAnnoTitle("");
    setAnnoMsg("");
    setLoading(false);
  };

  const deleteCourse = async (id) => await deleteDoc(doc(db, "courses", id));
  const deleteAnnouncement = async (id) => await deleteDoc(doc(db, "announcements", id));

  return (
    <div className="td-root">
      {/* Navbar */}
      <nav className="td-nav">
        <span className="td-nav-logo">🐢 Teacher Portal</span>
        <div className="td-nav-links">
          <button
            className={`td-nav-link ${activeTab === "courses" ? "active" : ""}`}
            onClick={() => setActiveTab("courses")}
          >
            📚 Courses
          </button>
          <button
            className={`td-nav-link ${activeTab === "announcements" ? "active" : ""}`}
            onClick={() => setActiveTab("announcements")}
          >
            📢 Announcements
          </button>
        </div>
        <div className="td-nav-right">
          <span className="td-nav-user">{currentUser?.email}</span>
          <button className="td-nav-logout" onClick={() => setPage("selection")}>Logout</button>
        </div>
      </nav>

      {/* Body */}
      <div className="td-body">
        <div className="td-greeting">
          <h1>Manage Classes 🎓</h1>
          <p>Students see your updates in real time.</p>
        </div>

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div className="td-section">
            <h2 className="td-section-title">📚 Add New Course</h2>
            <div className="td-form">
              <input
                placeholder="Course title"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
              />
              <textarea
                rows={3}
                placeholder="Course description..."
                value={courseDesc}
                onChange={(e) => setCourseDesc(e.target.value)}
              />
              <button className="td-add-btn" onClick={addCourse} disabled={loading}>
                + Add Course
              </button>
            </div>

            <h2 className="td-section-title" style={{ marginTop: "32px" }}>All Courses</h2>
            {courses.length === 0 ? (
              <div className="td-empty">No courses yet. Add one above!</div>
            ) : (
              courses.map((c) => (
                <div className="td-card" key={c.id}>
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                  <button className="td-delete-btn" onClick={() => deleteCourse(c.id)}>🗑 Delete</button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === "announcements" && (
          <div className="td-section">
            <h2 className="td-section-title">📢 Post Announcement</h2>
            <div className="td-form">
              <input
                placeholder="Announcement title"
                value={annoTitle}
                onChange={(e) => setAnnoTitle(e.target.value)}
              />
              <textarea
                rows={3}
                placeholder="Announcement message..."
                value={annoMsg}
                onChange={(e) => setAnnoMsg(e.target.value)}
              />
              <button className="td-add-btn" onClick={addAnnouncement} disabled={loading}>
                + Post Announcement
              </button>
            </div>

            <h2 className="td-section-title" style={{ marginTop: "32px" }}>All Announcements</h2>
            {announcements.length === 0 ? (
              <div className="td-empty">No announcements yet.</div>
            ) : (
              announcements.map((a) => (
                <div className="td-card" key={a.id}>
                  <h3>{a.title}</h3>
                  <p>{a.message}</p>
                  <button className="td-delete-btn" onClick={() => deleteAnnouncement(a.id)}>🗑 Delete</button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;