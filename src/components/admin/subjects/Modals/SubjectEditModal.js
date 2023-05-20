import axios from "axios";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { hideAlert, showAlert } from "../../../../redux/AlertSlice";
import { loaderStart, loaderStop } from "../../../../redux/LoaderSlice";
import { logout } from "../../../../redux/AuthSlice";

const SubjectEditModal = ({
  show,
  setShow,
  data,
  setEditSubjectData,
  onSubjectDeletedOrUpdated,
}) => {
  const [name, setName] = useState(data.name);
  const [desc, setDesc] = useState(data.desc);
  const [grade, setGrade] = useState(data.gradeDetails);
  const [selectedTeacher, setSelectedTeacher] = useState(data.teacher._id);

  const [teachersList, setTeachersList] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loaderStart());
    axios
      .get(`${process.env.REACT_APP_BACKEND}/users?type=teacher`, {
        headers: {
          token: `Bearer ${
            JSON.parse(localStorage.getItem("user")).accessToken
          }`,
        },
      })
      .then((res) => {
        return setTeachersList(res.data);
      })
      .catch((err) => {
        if (err.response.status === 403) {
          logout();
        }
        console.log(err);
      });
    dispatch(loaderStop());
  }, [dispatch]);

  const handleClose = () => {
    setShow(false);
    setEditSubjectData({});
  };

  const handleTeacherChange = (e) => {
    setSelectedTeacher(e.target.value);
  };

  const handleSubmit = async () => {
    const { createdAt, updatedAt, __v, ...payloadData } = data;
    const updatedData = {
      ...payloadData,
      name: name,
      desc: desc,
      gradeDetails: grade,
      teacher: selectedTeacher,
    };
    console.log(updatedData);
    dispatch(loaderStart());

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND}/subjects/${data._id}`,
        updatedData,
        {
          headers: {
            token: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        }
      );
      if (res.status === 200) {
        dispatch(
          showAlert({
            type: "success",
            message: `Updated Subject ${res?.data?.name}`,
          })
        );
        setTimeout(() => {
          dispatch(hideAlert());
        }, 1000);
        setShow(false);
        setEditSubjectData({});
        onSubjectDeletedOrUpdated();
      }
    } catch (err) {
      dispatch(showAlert({ type: "danger", message: err }));
      setTimeout(() => {
        dispatch(hideAlert());
      }, 1000);
    }
    dispatch(loaderStop());
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div class="mb-3">
            <label>Description</label>
            <input
              type="text"
              value={desc}
              className="form-control"
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div class="mb-3">
            <label>Grade</label>
            <input
              type="text"
              value={grade}
              className="form-control"
              onChange={(e) => setGrade(e.target.value)}
            />
          </div>
          <div class="mb-3">
            <label htmlFor="teacher">Teacher</label>
            <select
              name="teacher"
              id="teacher"
              className="form-control"
              value={selectedTeacher}
              onChange={(e) => handleTeacherChange(e)}
            >
              {teachersList.map((item) => (
                <option value={item._id} key={item._id}>
                  {item.name + " | " + item.email}
                </option>
              ))}
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SubjectEditModal;
