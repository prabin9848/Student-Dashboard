import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Selection from "./Pages/Selection";
import StudentLogin from "./Pages/StudentLogin";
import TeacherLogin from "./Pages/TeacherLogin";
import StudentDashboard from "./Pages/StudentDashboard";
import TeacherDashboard from "./Pages/TeacherDashboard";
import "./index.css";

export default function App() {
  const [page, setPage] = useState("selection");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setCurrentUser(null);
        setPage("selection");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {page === "selection" && <Selection setPage={setPage} />}
      {page === "studentLogin" && <StudentLogin setPage={setPage} setCurrentUser={setCurrentUser} />}
      {page === "teacherLogin" && <TeacherLogin setPage={setPage} setCurrentUser={setCurrentUser} />}
      {page === "studentDashboard" && <StudentDashboard setPage={setPage} currentUser={currentUser} />}
      {page === "teacherDashboard" && <TeacherDashboard setPage={setPage} currentUser={currentUser} />}
    </>
  );
}