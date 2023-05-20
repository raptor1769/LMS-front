import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.scss";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loaderStart, loaderStop } from "../../redux/LoaderSlice";
import useLogout from "../../custom/logout/Logout";

const TeacherHome = () => {
  const [subjectDetails, setSubjectDetails] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = useLogout();

  const user = JSON.parse(localStorage.getItem("user"));

  const getSubjectData = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND}/userSubjects/${user._id}/subjects`,
        {
          headers: {
            token: `Bearer ${user.accessToken}`,
          },
        }
      );
      setSubjectDetails(res.data);
    } catch (err) {
      if (err.response.status === 403) {
        logout();
      }
      console.log(err);
    }
  }, [user.accessToken, user._id, setSubjectDetails, logout]);

  useEffect(() => {
    dispatch(loaderStart());
    getSubjectData();
    dispatch(loaderStop());
  }, [dispatch, getSubjectData]);

  const handleSubjectClick = useCallback(
    (subject) => {
      navigate(`./subject=${subject.name}`, { state: { subject } });
    },
    [navigate]
  );

  return (
    <div className="teacher-home">
      <div className="subjects-container">
        {subjectDetails?.map((item, index) => {
          return (
            <div className="px-2 mb-3 col-3" key={index}>
              <div class="cards" onClick={() => handleSubjectClick(item)}>
                <div class="face face1">
                  <div class="content">
                    <h2 class="card__heading">{item?.name}</h2>
                    <p class="card__para">{item?.desc}</p>
                  </div>
                </div>
                <div class="face face2">
                  <h2>{item?.name}</h2>
                  <span>{item?.gradeDetails}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherHome;
