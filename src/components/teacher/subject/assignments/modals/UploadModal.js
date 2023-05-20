import { useCallback, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import axios from "axios";
import moment from "moment";
import { hideAlert, showAlert } from "../../../../../redux/AlertSlice";
import { loaderStart, loaderStop } from "../../../../../redux/LoaderSlice";
import useLogout from "../../../../../custom/logout/Logout";

const UploadModal = ({ show, setShow, subject, setRefresh }) => {
  const [selectedFile, setSelectedFile] = useState([]);
  const [fileUploadUrl, setFileUploadUrl] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [maxGrade, setMaxGrade] = useState(0);
  const [lastDate, setLastDate] = useState(moment().format("YYYY-MM-DD"));

  const dispatch = useDispatch();
  const logout = useLogout();

  const handleClose = useCallback(() => {
    setShow(false);
    setTitle("");
    setDesc("");
    setMaxGrade(0);
    setLastDate(moment().format("YYYY-MM-DD"));
    setFileUploadUrl("");
    setSelectedFile([]);
  }, [setShow]);

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadToDb = useCallback(
    async (body) => {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND}/assignments/`,
          body,
          {
            headers: {
              token: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
              }`,
            },
          }
        );
        console.log(res);
        dispatch(
          showAlert({
            type: "success",
            message: `Assignment uploaded successfully`,
          })
        );
        setTimeout(() => {
          dispatch(hideAlert());
        }, 1000);
        handleClose();
        setRefresh(true);
      } catch (err) {
        dispatch(showAlert({ type: "warning", message: err.response.data }));
        setTimeout(() => {
          dispatch(hideAlert());
        }, 1000);
      }
    },
    [dispatch, handleClose, setRefresh]
  );

  useEffect(() => {
    if (fileUploadUrl !== "") {
      const body = {
        title: title,
        desc: desc,
        assignment: fileUploadUrl,
        subject: subject._id,
        maxGrade: maxGrade,
        lastDate: lastDate,
      };
      uploadToDb(body);
    }
  }, [title, desc, fileUploadUrl, subject._id, maxGrade, lastDate, uploadToDb]);

  const handleSubmit = async () => {
    if (title.length === 0) {
      dispatch(showAlert({ type: "warning", message: "Title cant be empty" }));
      setTimeout(() => {
        dispatch(hideAlert());
      }, 1000);
      return;
    }
    if (desc.length === 0) {
      dispatch(
        showAlert({ type: "warning", message: "Description cant be empty" })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 1000);
      return;
    }
    if (maxGrade === 0) {
      dispatch(showAlert({ type: "warning", message: "Max grade cant be 0" }));
      setTimeout(() => {
        dispatch(hideAlert());
      }, 1000);
      return;
    }
    if (lastDate === "" || new Date(lastDate) <= new Date()) {
      dispatch(
        showAlert({
          type: "warning",
          message: "Last date should be greater than current day",
        })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 1000);
      return;
    }

    if (selectedFile.length === 0) {
      dispatch(
        showAlert({
          type: "warning",
          message: "Kindly select the file to upload",
        })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 1000);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("name", subject.name);
    formData.append("teacher", JSON.parse(localStorage.getItem("user")).name);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    dispatch(loaderStart());
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/files/upload/assignments`,
        formData,
        {
          headers: {
            token: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        },
        config
      );

      setFileUploadUrl(response.data);
    } catch (err) {
      if (err.response.status === 403) {
        logout();
      }
      console.log(err);
    }
    dispatch(loaderStop());
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Assignment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label htmlFor="assignment-title" className="assignment-title-label">
            Title :{" "}
          </label>
          <input
            type="text"
            placeholder="Enter title"
            id="assignment-title"
            className="assignment-title form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="assignment-desc" className="assignment-desc-label">
            Description :{" "}
          </label>
          <input
            type="text"
            placeholder="Enter desc"
            id="assignment-desc"
            className="assignment-desc form-control"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <div className="mb-3">
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
            className="assignment-maxGrade form-control"
            value={maxGrade}
            min={0}
            onChange={(e) => setMaxGrade(e.target.value)}
          />
        </div>
        <div className="mb-3">
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
            className="assignment-lastDate form-control"
            value={lastDate}
            onChange={(e) => {
              setLastDate(e.target.value);
              console.log(e.target.value);
            }}
          />
        </div>
        <div>
          <input
            type="file"
            onChange={handleFileInput}
            name="file"
            className="form-control"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadModal;
