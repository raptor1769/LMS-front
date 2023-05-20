import { useDispatch } from "react-redux";
import AdminHome from "../../components/admin/Home";
import StudentHome from "../../components/student/Home";
import TeacherHome from "../../components/teacher/Home";
import { showAlert } from "../../redux/AlertSlice";
import "./Home.scss";

const Home = () => {
  const role = JSON.parse(localStorage.getItem("user"))?.role;
  const isVerified = JSON.parse(localStorage.getItem("user"))?.verified;

  const dispatch = useDispatch();
  setTimeout(() => {
    if (!isVerified) {
      dispatch(
        showAlert({
          type: "warning",
          message:
            role === "admin"
              ? "Account not verified, contact existing admin"
              : role === "student"
              ? "Account not verified, contact your teacher"
              : "Account not verified, contact admin",
        })
      );
    }
  }, 1000);

  switch (role) {
    case "admin":
      return <>{isVerified && <AdminHome />}</>;
    case "student":
      return <>{isVerified && <StudentHome />}</>;
    case "teacher":
      return <>{isVerified && <TeacherHome />}</>;
    default:
      return null;
  }
};

export default Home;
