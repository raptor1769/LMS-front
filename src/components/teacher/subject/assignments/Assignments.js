import { useEffect, useState } from "react";
import "./Assignments.scss";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { loaderStart, loaderStop } from "../../../../redux/LoaderSlice";
import axios from "axios";
import useLogout from "../../../../custom/logout/Logout";
import { hideAlert, showAlert } from "../../../../redux/AlertSlice";
import UploadModal from "./modals/UploadModal";
import Comments from "../../../comments/Comments";
import DeleteModal from "./modals/DeleteModal";
import moment from "moment";
import StudentsModal from "./modals/StudentsModal";

const Assignments = ({ subject }) => {
  const [assignments, setAssignments] = useState([]);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [refresh, setRefresh] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteData, setDeleteData] = useState({});
  const [selectedAssignmentForm, setSelectedAssignmentForm] = useState(false);
  const [maxGrade, setMaxGrade] = useState(0);
  const [lastDate, setLastDate] = useState("");

  const [studentsModal, setStudentsModal] = useState(false);

  const [show, setShow] = useState(false);

  const dispatch = useDispatch();
  const logout = useLogout();

  useEffect(() => {
    dispatch(loaderStart());

    const getAssignments = async () => {
      // setAssignments([]);
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

  const deleteAssignment = (data) => {
    setDeleteData(data);
    setShowDeleteModal(true);
  };
  // console.log(lastDate);
  // const handleUpdate = async () => {
  //   dispatch(loaderStart());
  //   const body = {
  //     maxGrade: maxGrade,
  //     lastDate: lastDate,
  //   };
  //   try {
  //     await axios.put(
  //       `${process.env.REACT_APP_BACKEND}/assignments/${activeAssignment._id}`,
  //       body,
  //       {
  //         headers: {
  //           token: `Bearer ${
  //             JSON.parse(localStorage.getItem("user")).accessToken
  //           }`,
  //         },
  //       }
  //     );
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   setSelectedAssignmentForm(false);
  //   setRefresh(true);
  //   setActiveAssignment(null);
  //   dispatch(loaderStop());
  // };

  return (
    <div className="teacher-assignments">
      <UploadModal
        show={show}
        setShow={setShow}
        subject={subject}
        setRefresh={setRefresh}
      />
      <DeleteModal
        show={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        data={deleteData}
        setDeleteData={setDeleteData}
        setRefresh={setRefresh}
      />
      {activeAssignment !== null && studentsModal && (
        <StudentsModal
          show={studentsModal}
          setShow={setStudentsModal}
          data={activeAssignment._id}
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
                      setMaxGrade(item?.maxGrade);
                      setLastDate(moment(item?.lastDate).format("YYYY-MM-DD"));
                    }}
                    className="assignments-list-item"
                  >
                    <span>{item.title}</span>
                    <span>
                      <i
                        className="bi bi-trash3"
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => deleteAssignment(item)}
                      ></i>
                    </span>
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
                      <div
                        className="selected-assignment-student-details"
                        onClick={() => setStudentsModal(true)}
                      >
                        <span>Student Submission Details</span>
                        <span>
                          <i className="bi bi-box-arrow-up-right"></i>
                        </span>
                      </div>
                    </div>

                    {/* <div className="selected-assignment-right">
                      {!selectedAssignmentForm ? (
                        <div
                          className="selected-assignment-edit"
                          onClick={() => setSelectedAssignmentForm(true)}
                        >
                          <i
                            className="bi bi-pencil-fill"
                            style={{ cursor: "pointer" }}
                          ></i>
                          <span>Edit</span>
                        </div>
                      ) : (
                        <div style={{ zIndex: "3000" }}>
                          <div>
                            <label
                              htmlFor="assignment-maxGrade"
                              className="assignment-maxGrade-label"
                            >
                              Max Grades :{" "}
                            </label>
                            <input
                              type="number"
                              placeholder="Enter Max Grades"
                              id="assignment-maxGrade"
                              className="assignment-maxGrade"
                              value={maxGrade}
                              min={0}
                              onChange={(e) => setMaxGrade(e.target.value)}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="assignment-lastDate"
                              className="assignment-lastDate-label"
                            >
                              Last Date :{" "}
                            </label>
                            <input
                              type="date"
                              placeholder="Enter Last Date"
                              id="assignment-lastDate"
                              className="assignment-lastDate"
                              value={lastDate}
                              onChange={(e) => {
                                setLastDate(e.target.value);
                                console.log(e.target.value);
                              }}
                            />
                          </div>
                          <div>
                            <Button
                              variant="secondary"
                              onClick={() => setSelectedAssignmentForm(false)}
                            >
                              Close
                            </Button>
                            <Button
                              variant="success"
                              onClick={() => handleUpdate()}
                            >
                              Update
                            </Button>
                          </div>
                        </div>
                        ""
                      )}
                    </div> */}
                  </div>
                  // ""
                )}
              </div>
              <div onClick={() => setShow(true)} className="mt-3">
                <Button variant="info" className="btn btn-primary">
                  <i className="bi bi-plus"></i> Add Assignment
                </Button>
              </div>
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
            <div className="no-assignments-section my-3">
              <div onClick={() => setShow(true)}>
                <Button variant="info" className="btn btn-primary">
                  <i className="bi bi-plus"></i> Add Assignment
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assignments;
