import { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * FirebaseSeeder - One-time setup component
 * Creates initial user documents in Firestore users collection
 *
 * USAGE:
 * 1. Add <FirebaseSeeder /> to App.jsx temporarily
 * 2. Run the app and check console for results
 * 3. Remove <FirebaseSeeder /> after successful seeding
 */

export default function FirebaseSeeder() {
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const seedUsers = async () => {
      try {
        // Teacher user document
        const teacherRef = doc(db, "users", "D16bv51vF2Ty4iWnGNOfWLnL3ge2");
        await setDoc(teacherRef, {
          email: "teacher@school.com",
          role: "teacher",
          createdAt: new Date().toISOString(),
        }, { merge: true });

        // Student user document
        // TODO: Replace with actual student UID from Firebase Auth
        const studentUid = "ulaCZ7OJeeY5nbxCxRBVOixi"; // Update this with full UID
        const studentRef = doc(db, "users", studentUid);
        await setDoc(studentRef, {
          email: "student@school.com",
          role: "student",
          createdAt: new Date().toISOString(),
        }, { merge: true });

        setStatus("success");
        console.log("✅ Firebase seeding completed successfully!");
        console.log("Created users:");
        console.log("  - Teacher: teacher@school.com (UID: D16bv51vF2Ty4iWnGNOfWLnL3ge2)");
        console.log(`  - Student: student@school.com (UID: ${studentUid})`);
      } catch (error) {
        setStatus("error");
        console.error("❌ Firebase seeding failed:", error);
      }
    };

    seedUsers();
  }, []);

  return (
    <div style={{
      padding: "20px",
      background: status === "success" ? "#DCFCE7" : status === "error" ? "#FEE2E2" : "#FEF3C7",
      borderBottom: "1px solid #E2E8F0",
      fontSize: "14px",
    }}>
      <strong>Firebase Seeder: </strong>
      {status === "pending" && "Seeding users..."}
      {status === "success" && "✅ Users seeded successfully! Check console for details."}
      {status === "error" && "❌ Seeding failed. Check console for error."}
    </div>
  );
}
