import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "./TeacherLogin.css";

const TeacherLogin = ({ setPage, setCurrentUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return setError("Please fill in all fields.");
    setLoading(true);
    setError("");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser({ email: result.user.email, role: "teacher" });
      setPage("teacherDashboard");
    } catch (err) {
      setError("Invalid email or password.");
    }
    setLoading(false);
  };

  return (
    <div className="tl-root">

      {/* Login Card */}
      <div className="tl-center">
        <div className="tl-card">
          <h1 className="tl-title">TEACHER LOGIN</h1>
          <p className="tl-sub">Welcome back, Sensei</p>

          <div className="tl-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <div className="tl-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          

          {error && <div className="tl-error">{error}</div>}

          <button className="tl-btn" onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "LOGIN"}
          </button>
          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <button className="tl-nav-back" onClick={() => setPage("selection")}>← Back</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;