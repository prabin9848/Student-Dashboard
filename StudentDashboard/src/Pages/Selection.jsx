import './Selection.css';
import studentImg from '../assets/student_.png';
import teacherImg from '../assets/image.png';

const Selection = ({ setPage }) => {
  return (
    <div className="sel-root">
      <div className="sel-half sel-student" onClick={() => setPage("studentLogin")}>
        <img src={studentImg} alt="Student" className="sel-img" />
        <p className="sel-label">STUDENT</p>
      </div>
      <div className="sel-half sel-teacher" onClick={() => setPage("teacherLogin")}>
        <img src={teacherImg} alt="Teacher" className="sel-img" />
        <p className="sel-label">TEACHER</p>
      </div>
    </div>
  );
};

export default Selection;