import { useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.scss";
import AlertBar from "./components/AlertBar/AlertBar";
import Loader from "./components/Loader/Loader";
import NavBar from "./components/NavBar/NavBar";

import Forms from "./pages/forms/Forms";
import Home from "./pages/home/Home";
import Subject from "./components/teacher/subject/Subject";
import SubjectStudent from "./components/student/subject/Subject";
import { Suspense, lazy } from "react";

function App() {
  const location = useLocation();
  const ErrorPage = lazy(() => import("./pages/error/Error"));

  let token = JSON.parse(localStorage.getItem("user"))?.accessToken;
  let name = JSON.parse(localStorage.getItem("user"))?.name;
  let isLoading = useSelector((state) => state.loader.value);
  let showAlert = useSelector((state) => state.alert);
  const role = JSON.parse(localStorage.getItem("user"))?.role;

  const subjectDetails = location?.state?.subject;

  return (
    <div className="App">
      {isLoading && <Loader />}
      {showAlert.value && (
        <div className="app-alert-bar">
          <AlertBar type={showAlert.type} message={showAlert.message} />
        </div>
      )}
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            token === undefined || token === null || token === "" ? (
              <Forms />
            ) : (
              <Navigate to={`/${name}`} />
            )
          }
        />
        {!(token === undefined || token === null || token === "") && (
          <Route path={`/${name}`} element={<Home />} />
        )}
        {subjectDetails && role === "teacher" && (
          <Route
            path={`/${name}/subject=${subjectDetails.name}`}
            element={<Subject subject={subjectDetails} />}
          />
        )}
        {subjectDetails && role === "student" && (
          <Route
            path={`/${name}/subject=${subjectDetails.name}`}
            element={<SubjectStudent subject={subjectDetails} />}
          />
        )}
        <Route
          path="*"
          element={
            <Suspense fallback={<Loader />}>
              <ErrorPage />
            </Suspense>
          }
        />
      </Routes>

      {/* <Footer /> */}
    </div>
  );
}

export default App;
