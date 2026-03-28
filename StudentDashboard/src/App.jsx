import { useState } from "react";
import Selection from "./Pages/Selection";
import StudentLogin from "./Pages/StudentLogin";
import TeacherLogin from "./Pages/TeacherLogin";
import StudentDashboard from "./Pages/StudentDashboard";
import TeacherDashboard from "./Pages/TeacherDashboard";
import "./index.css";

export default function App() {
  const [page, setPage] = useState("selection");
  const [currentUser, setCurrentUser] = useState(null);


  if (page === "selection") {
    return <Selection setPage={setPage} />;
  }

  if (page === "studentLogin") {
    return <StudentLogin setPage={setPage} setCurrentUser={setCurrentUser} />;
  }

  if (page === "teacherLogin") {
    return <TeacherLogin setPage={setPage} setCurrentUser={setCurrentUser} />;
  }

  if (page === "studentDashboard") {
    return <StudentDashboard setPage={setPage} currentUser={currentUser} />;
  }

  if (page === "teacherDashboard") {
    return <TeacherDashboard setPage={setPage} currentUser={currentUser} />;
  }
}