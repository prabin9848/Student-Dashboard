import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "./StudentLogin.css";

const StudentLogin = ({ setPage, setCurrentUser }) => {
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
      setCurrentUser({ email: result.user.email, role: "student" });
      setPage("studentDashboard");
    } catch (err) {
      setError("Invalid email or password.");
    }
    setLoading(false);
  };

  return (
    <div className="sl-root">
      

      {/* Login Card */}
      <div className="sl-center">
        <div className="sl-card">
          <h1 className="sl-title">STUDENT LOGIN</h1>
          <p className="sl-sub">Enter your credentials to continue</p>

          <div className="sl-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <div className="sl-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          {error && <div className="sl-error">{error}</div>}

          <button className="sl-btn" onClick={handleLogin} disabled={loading}>
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

export default StudentLogin;