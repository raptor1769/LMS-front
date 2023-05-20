import { useCallback, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import axios from "axios";
import moment from "moment";
import { hideAlert, showAlert } from "../../../../../redux/AlertSlice";
import { loaderStart, loaderStop } from "../../../../../redux/LoaderSlice";
import useLogout from "../../../../../custom/logout/Logout";

const UploadModal = ({
  show,
  setShow,
  assignment,
  subject,
  setRefresh,
  setActiveAssignment,
}) => {
  const [selectedFile, setSelectedFile] = useState([]);
  const [fileUploadUrl, setFileUploadUrl] = useState("");

  console.log(assignment);

  const dispatch = useDispatch();
  const logout = useLogout();

  const handleClose = useCallback(() => {
    setShow(false);
    setFileUploadUrl("");
    setSelectedFile([]);
  }, [setShow]);

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadToDb = useCallback(
    async (body) => {
      try {
        const res = await axios.put(
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
        console.log(res);
        setActiveAssignment(null);
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
        assignment: fileUploadUrl,
        student: JSON.parse(localStorage.getItem("user"))._id,
      };
      uploadToDb(body);
    }
  }, [fileUploadUrl, uploadToDb]);

  const handleSubmit = async () => {
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
    formData.append("name", subject);
    formData.append("teacher", JSON.parse(localStorage.getItem("user")).email);

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
        <div>
          <input type="file" onChange={handleFileInput} name="file" />
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
