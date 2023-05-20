import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import useLogout from "../../../../custom/logout/Logout";
import { hideAlert, showAlert } from "../../../../redux/AlertSlice";
import { loaderStart, loaderStop } from "../../../../redux/LoaderSlice";
import { useEffect, useRef, useState } from "react";

const AddSubjectModal = ({ show, setShow, onSubjectDeletedOrUpdated }) => {
  const dispatch = useDispatch();
  const logout = useLogout("Session");

  const [subjectData, setSubjectData] = useState({
    name: "",
    gradeDetails: "",
    desc: "",
    teacher: "",
  });
  const [teachersList, setTeachersList] = useState([]);

  const teacherRef = useRef();

  useEffect(() => {
    dispatch(loaderStart());
    axios
      .get("users?type=teacher", {
        headers: {
          token: `Bearer ${
            JSON.parse(localStorage.getItem("user")).accessToken
          }`,
        },
      })
      .then((res) => {
        return setTeachersList(res?.data);
      })
      .catch((err) => {
        if (err.response.status === 403) {
          logout();
        }
        console.log(err);
      });
    dispatch(loaderStop());
  }, [dispatch, logout]);

  const handleClose = () => {
    setShow(false);
    setSubjectData({
      name: "",
      gradeDetails: "",
      desc: "",
      teacher: "",
    });
  };

  const addSubject = () => {
    if (subjectData.name.length < 3) {
      dispatch(
        showAlert({
          type: "warning",
          message: `Subject name should be greater than 3 letters`,
        })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 1000);
      return;
    }
    if (subjectData.desc.length === 0) {
      dispatch(
        showAlert({
          type: "warning",
          message: `Subject description should not be empty`,
        })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 1000);
      return;
    }
    if (subjectData.gradeDetails.length === 0) {
      dispatch(
        showAlert({
          type: "warning",
          message: `Gradedetails should not be empty`,
        })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 1000);
      return;
    }
    if (teacherRef.current.value === "0") {
      dispatch(
        showAlert({
          type: "warning",
          message: `Select a teacher from dropdown`,
        })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 1000);
      return;
    }
    createSubject(subjectData);
  };

  const createSubject = async (data) => {
    dispatch(loaderStart());
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND}/subjects/addSubject`,
        data,
        {
          headers: {
            token: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        }
      );
      dispatch(
        showAlert({ type: "success", message: `Subject created successfully` })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 1000);
      handleClose();
      onSubjectDeletedOrUpdated();
    } catch (err) {
      dispatch(showAlert({ type: "warning", message: err.response.data }));
      setTimeout(() => {
        dispatch(hideAlert());
      }, 1000);
      handleClose();
      onSubjectDeletedOrUpdated();
    }
    dispatch(loaderStop());
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Subject</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div class="mb-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={subjectData.name}
            onChange={(e) =>
              setSubjectData({ ...subjectData, name: e.target.value })
            }
          />
        </div>
        <div class="mb-3">
          <label>Description</label>
          <input
            type="text"
            className="form-control"
            value={subjectData.desc}
            onChange={(e) =>
              setSubjectData({ ...subjectData, desc: e.target.value })
            }
          />
        </div>
        <div class="mb-3">
          <label>Grade</label>
          <input
            type="text"
            className="form-control"
            value={subjectData.gradeDetails}
            onChange={(e) =>
              setSubjectData({ ...subjectData, gradeDetails: e.target.value })
            }
          />
        </div>
        <div class="mb-3">
          <label htmlFor="teacher">Teacher</label>
          <select
            name="teacher"
            id="teacher"
            className="form-control"
            ref={teacherRef}
            value={subjectData.teacher}
            onChange={(e) =>
              setSubjectData({ ...subjectData, teacher: e.target.value })
            }
          >
            <option value={0}>Select Teacher</option>
            {teachersList.map((item) => (
              <option value={item._id} key={item._id}>
                {item.name + " | " + item.email}
              </option>
            ))}
          </select>
        </div>
        <div>
          <i className="bi bi-info-circle"></i>
          <i>
            {" "}
            Click on the subject name in the main grid after adding subject to
            add or remove students.
          </i>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="success" onClick={addSubject}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddSubjectModal;
