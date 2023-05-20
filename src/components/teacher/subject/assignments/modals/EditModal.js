import axios from "axios";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { loaderStart, loaderStop } from "../../../../../redux/LoaderSlice";
import { hideAlert, showAlert } from "../../../../../redux/AlertSlice";

const EditModal = ({
  show,
  setShow,
  data,
  maxMark,
  assignment,
  setReload,
  onGridReady,
}) => {
  const [grades, setGrades] = useState(data.obtainedGrade);
  const [status, setStatus] = useState(data.submissionStatus);

  const assgnStatus = [0, 1, 2, 3];
  const dispatch = useDispatch();

  const handleClose = () => {
    setShow(false);
    setGrades("");
    setStatus("");
  };

  const assgnStatusText = [
    "Not submitted",
    "Submitted",
    "Reviewed",
    "Rejected",
  ];

  //   console.log(assignment, {
  //     grade: Number(grades),
  //     submissionStatus: Number(status),
  //   });

  const handleSubmit = async () => {
    let body = {
      studentObjectId: data._id,
      grade: Number(grades),
      submissionStatus: Number(status),
    };
    if (Number(grades) > maxMark) {
      dispatch(
        showAlert({
          type: "warning",
          message: "Grades can not be more than max grade",
        })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 1000);
      return;
    }
    dispatch(loaderStart());
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND}/assignments/${assignment}/studentData`,
        body,
        {
          headers: {
            token: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        }
      );
      dispatch(showAlert({ type: "success", message: "Updated successfully" }));
      setTimeout(() => {
        dispatch(hideAlert());
      }, 1000);
    } catch (err) {
      console.log(err);
    }
    setReload(true);
    onGridReady();
    setShow(false);
    dispatch(loaderStop());
  };
  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header>{data?.studentId?.name} Grades</Modal.Header>
      <Modal.Body>
        <div className="student-assgn-edit-modal">
          <div>{data?.name}</div>
          <div>
            <div className="mb-3">
              <label>Grades</label>
              <input
                type="number"
                value={grades}
                onChange={(e) => setGrades(e.target.value)}
                min="0"
                className="form-control"
                max={maxMark}
              />
              <i>Max marks: {maxMark}</i>
            </div>
            <div className="mb-3">
              <label>Status</label>
              <select
                name="cars"
                id="cars"
                className="form-control"
                defaultValue={data.submissionStatus}
                onChange={(e) => setStatus(e.target.value)}
              >
                {assgnStatus?.map((item) => (
                  <option key={item} value={item}>
                    {assgnStatusText[item]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;
