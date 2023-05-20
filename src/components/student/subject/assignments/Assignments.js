import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useLogout from "../../../../custom/logout/Logout";
import { loaderStart, loaderStop } from "../../../../redux/LoaderSlice";
import axios from "axios";
import { hideAlert, showAlert } from "../../../../redux/AlertSlice";
import UploadModal from "./modals/UploadModal";
import moment from "moment";
import { Button } from "react-bootstrap";
import Comments from "../../../comments/Comments";
import "./Assignments.scss";

const Assignments = ({ subject }) => {
  const [assignments, setAssignments] = useState([]);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [studentAssignmentData, setStudentAssignmentData] = useState(null);
  const [refresh, setRefresh] = useState(true);
  const [studentRefresh, setStudentRefresh] = useState(true);
  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [deleteData, setDeleteData] = useState({});
  // const [maxGrade, setMaxGrade] = useState(0);
  // const [lastDate, setLastDate] = useState("");

  // const [studentsModal, setStudentsModal] = useState(false);

  const [show, setShow] = useState(false);

  const dispatch = useDispatch();
  const logout = useLogout();

  const assgnStatusText = [
    "Not submitted",
    "Submitted",
    "Reviewed",
    "Rejected",
  ];

  useEffect(() => {
    dispatch(loaderStart());

    const getAssignmentStudentData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND}/assignments/${
            activeAssignment._id
          }/${JSON.parse(localStorage.getItem("user"))._id}`,
          {
            headers: {
              token: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
              }`,
            },
          }
        );
        setStudentAssignmentData(res.data);

        setStudentRefresh(false);
      } catch (err) {
        if (err.response.status === 403) {
          return logout();
        }
        dispatch(showAlert({ type: "warning", message: err.response.data }));
        setTimeout(() => {
          dispatch(hideAlert());
        }, 1000);
      }
    };
    if (activeAssignment) {
      getAssignmentStudentData();
    }
    dispatch(loaderStop());
  }, [dispatch, logout, activeAssignment, refresh]);

  useEffect(() => {
    dispatch(loaderStart());

    const getAssignments = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND}/assignments/${subject._id}`,
          {
            headers: {
              token: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
              }`,
            },
          }
        );
        setAssignments(res.data);
        setActiveAssignment(null);
        setRefresh(false);
      } catch (err) {
        if (err.response.status === 403) {
          return logout();
        }
        dispatch(showAlert({ type: "warning", message: err.response.data }));
        setTimeout(() => {
          dispatch(hideAlert());
        }, 1000);
      }
    };
    if (refresh) {
      getAssignments();
    }
    dispatch(loaderStop());
  }, [dispatch, logout, subject._id, refresh]);

  // console.log(studentAssignmentData, activeAssignment);

  // const deleteAssignment = (data) => {
  //   setDeleteData(data);
  //   setShowDeleteModal(true);
  // };
  // console.log(lastDate);
  // const handleUpdate = async () => {
  //   dispatch(loaderStart());
  //   const body = {
  //     maxGrade: maxGrade,
  //     lastDate: lastDate,
  //   };
  //   try {
  //     await axios.put(`${process.env.REACT_APP_BACKEND}/assignments/${activeAssignment._id}`, body, {
  //       headers: {
  //         token: `Bearer ${
  //           JSON.parse(localStorage.getItem("user")).accessToken
  //         }`,
  //       },
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   setSelectedAssignmentForm(false);
  //   setRefresh(true);
  //   setActiveAssignment(null);
  //   dispatch(loaderStop());
  // };

  return (
    <>
      {activeAssignment && (
        <UploadModal
          show={show}
          setShow={setShow}
          assignment={activeAssignment._id}
          setRefresh={setStudentRefresh}
          refresh={studentRefresh}
          subject={subject.name}
          setActiveAssignment={setActiveAssignment}
        />
      )}

      <div className="recordings-container">
        <div className="recordings-left-section">
          {assignments?.length > 0 && <span>All Assignments</span>}
          <ul className="recordings-list">
            {assignments?.length > 0 ? (
              <>
                {assignments?.map((item) => (
                  <li
                    key={item._id}
                    onClick={() => {
                      setActiveAssignment(item);
                      // setMaxGrade(item?.maxGrade);
                      // setLastDate(moment(item?.lastDate).format("YYYY-MM-DD"));
                    }}
                    className="assignments-list-item"
                  >
                    <span>{item.title}</span>
                  </li>
                ))}
              </>
            ) : (
              <li>No Assignments added</li>
            )}
          </ul>
        </div>
        <div className="recording-right-section">
          {assignments?.length > 0 ? (
            <>
              <div className="recording-video-player">
                {activeAssignment === null ? (
                  <div>Please select Assignment</div>
                ) : (
                  <div className="selected-assignemt">
                    <div className="selected-assignemt-left">
                      <div className="selected-assignment-details">
                        <div className="selected-assignment-title">
                          {activeAssignment.title}
                        </div>
                        <div className="selected-assignment-details">
                          <div className="selected-assignment-lastDate">
                            Last Date:{" "}
                            {moment(activeAssignment?.lastDate).format(
                              "DD-MM-YYYY"
                            )}
                          </div>
                          <div className="selected-assignment-download">
                            <a href={activeAssignment?.assignment} download>
                              Download Assignment
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="selected-assignment-right">
                      <div>
                        Grades: {studentAssignmentData?.obtainedGrade} /
                        {activeAssignment?.maxGrade}
                      </div>
                      <div>
                        Submission Status:{" "}
                        {
                          assgnStatusText[
                            studentAssignmentData?.submissionStatus
                          ]
                        }
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {activeAssignment && (
                <div>
                  <Button
                    variant="info"
                    disabled={
                      !moment(activeAssignment?.lastDate).isAfter(moment()) ||
                      studentAssignmentData?.submissionStatus
                    }
                    title={
                      studentAssignmentData?.submissionStatus !== 0
                        ? "Already submitted"
                        : ""
                    }
                    onClick={() => setShow(true)}
                    className="student-assignment-submit-button"
                  >
                    <i className="bi bi-upload"></i> Submit
                  </Button>
                  {!moment(activeAssignment?.lastDate).isAfter(moment()) && (
                    <div>
                      <i className="bi bi-info-circle"></i>
                      <i>Submission Date passed</i>
                    </div>
                  )}
                </div>
              )}
              {activeAssignment !== null && (
                <div className="recording-comments">
                  <Comments
                    videoOrAssignmentId={activeAssignment._id}
                    type="assignment"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="no-assignments-section">
              <div>No Assignments added</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Assignments;
