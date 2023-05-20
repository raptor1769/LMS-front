import { useCallback, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { loaderStart, loaderStop } from "../../../../../redux/LoaderSlice";
import axios from "axios";
import useLogout from "../../../../../custom/logout/Logout";
import { hideAlert, showAlert } from "../../../../../redux/AlertSlice";

const UploadModal = ({ show, setShow, subject, setRefresh }) => {
  const [selectedFile, setSelectedFile] = useState([]);
  const [fileUploadUrl, setFileUploadUrl] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const dispatch = useDispatch();
  const logout = useLogout();

  const handleClose = useCallback(() => {
    setShow(false);
    setTitle("");
    setDesc("");
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
          `${process.env.REACT_APP_BACKEND}/recordings/add`,
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
          showAlert({ type: "success", message: `Video uploaded successfully` })
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
        url: fileUploadUrl,
        subject: subject._id,
        teacher: JSON.parse(localStorage.getItem("user"))._id,
      };
      uploadToDb(body);
    }
  }, [title, desc, fileUploadUrl, subject._id, uploadToDb]);

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
    if (!selectedFile.type.startsWith("video/")) {
      // Display warning if selected file is not a video file
      dispatch(
        showAlert({
          type: "warning",
          message: "Only video files are allowed",
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
        `${process.env.REACT_APP_BACKEND}/files/upload/videos`,
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
        <Modal.Title>Add New Recording</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label htmlFor="video-title" className="video-title-label">
            Title :{" "}
          </label>
          <input
            type="text"
            placeholder="Enter video title"
            id="video-title"
            className="video-title form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="video-desc" className="video-desc-label">
            Description :{" "}
          </label>
          <input
            type="text"
            placeholder="Enter video desc"
            id="video-desc"
            className="video-desc form-control"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <div>
          <input
            type="file"
            onChange={handleFileInput}
            name="file"
            className="form-control"
            accept="video/mp4,video/avi,video/mov,video/x-matroska,video/webm,video/quicktime,video/x-ms-wmv,video/x-flv"
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
