import axios from "axios";
import { Button, Modal, Tab, Tabs } from "react-bootstrap";
import { useDispatch } from "react-redux";
import useLogout from "../../../../custom/logout/Logout";
import { hideAlert, showAlert } from "../../../../redux/AlertSlice";
import { loaderStart, loaderStop } from "../../../../redux/LoaderSlice";
import { useEffect, useState } from "react";
import StundentsGrid from "./gridData/StundentsGrid";
import AddStundentsGrid from "./gridData/AddStudents";

const SubjectDetailsModal = ({ show, setShow, data, setDetailsData }) => {
  const [subjectData, setSubjectData] = useState();
  const [updateStudents, setUpdateStudents] = useState(false);

  const [deleteButtonState, setDeleteButtonState] = useState(true);
  const [deleteStudentsId, setDeleteStudentsId] = useState([]);

  const [addStudentsButtonState, setAddStudentsButtonState] = useState(true);
  const [addStudentsId, setAddStudentsId] = useState([]);

  const [activeTabKey, setActiveTabKey] = useState("students");

  const dispatch = useDispatch();
  const logout = useLogout("Session");

  useEffect(() => {
    const getSubjectData = async () => {
      dispatch(loaderStart());
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND}/subjects/${data}`,
          {
            headers: {
              token: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
              }`,
            },
          }
        );

        setSubjectData(res?.data);
      } catch (err) {
        if (err.response.status === 403) {
          logout();
        } else {
          dispatch(showAlert({ type: "warning", message: err.response.data }));
          setTimeout(() => {
            dispatch(hideAlert());
          }, 1000);
        }
      }
      dispatch(loaderStop());
    };
    if (data) {
      getSubjectData();
    }
  }, [dispatch, data, logout, updateStudents]);

  const handleClose = () => {
    setShow(false);
    setDetailsData({});
    setSubjectData();
    setDeleteStudentsId([]);
    setAddStudentsId([]);
    setDeleteButtonState(true);
    setAddStudentsButtonState(true);
  };

  const deleteStudents = async () => {
    dispatch(loaderStart());
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND}/subjects/${data}/remove-students`,
        {
          studentsId: deleteStudentsId,
        },
        {
          headers: {
            token: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        }
      );
      dispatch(showAlert({ type: "success", message: res.data.message }));
      setTimeout(() => {
        dispatch(hideAlert());
      }, 1000);
      handleClose();
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(loaderStop());
    }
  };

  const addStudents = async () => {
    dispatch(loaderStart());
    // console.log(addStudentsId);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND}/subjects/${data}/add-students`,
        {
          studentsId: addStudentsId,
        },
        {
          headers: {
            token: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        }
      );
      dispatch(showAlert({ type: "success", message: res.data.message }));
      setTimeout(() => {
        dispatch(hideAlert());
      }, 1000);
      handleClose();
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(loaderStop());
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
        className="subject-details-modal"
      >
        <Modal.Header>
          <Modal.Title className="subject-details-title">
            {subjectData && (
              <>
                <div className="subject-details-name">{subjectData.name}</div>
                <div className="subject-details-grade">
                  {subjectData.gradeDetails}
                </div>
                <div className="subject-details-professor">
                  {subjectData.teacher.name} || {subjectData.teacher.email}
                </div>
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            activeKey={activeTabKey}
            id="controlled-tab-example"
            onSelect={(k) => setActiveTabKey(k)}
            className="mb-3"
          >
            {subjectData && (
              <Tab eventKey="students" title="Students">
                <StundentsGrid
                  data={subjectData}
                  setUpdateStudents={setUpdateStudents}
                  setDeleteButtonState={setDeleteButtonState}
                  setDeleteStudentsId={setDeleteStudentsId}
                />
              </Tab>
            )}
            <Tab eventKey="addStudents" title="Add Students">
              <AddStundentsGrid
                data={subjectData}
                setAddStudentsButtonState={setAddStudentsButtonState}
                setAddStudentsId={setAddStudentsId}
              />
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {activeTabKey === "students" ? (
            <Button
              variant="danger"
              disabled={deleteButtonState}
              onClick={deleteStudents}
            >
              Delete Selected
            </Button>
          ) : activeTabKey === "addStudents" ? (
            <Button
              variant="success"
              disabled={addStudentsButtonState}
              onClick={addStudents}
            >
              Add Selected
            </Button>
          ) : activeTabKey === "recordings" ? (
            <Button
              variant="success"
              disabled={true}
              onClick={() => {
                console.log("hi");
              }}
            >
              Add Recordings
            </Button>
          ) : null}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SubjectDetailsModal;
