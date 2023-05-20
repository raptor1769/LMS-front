import axios from "axios";
import moment from "moment";
import "./CommentsModal.scss";
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import useLogout from "../../../../custom/logout/Logout";
import { loaderStart, loaderStop } from "../../../../redux/LoaderSlice";
import { Modal, Button } from "react-bootstrap";
import { hideAlert, showAlert } from "../../../../redux/AlertSlice";

const CommentsModal = ({ show, setShow, data, setData }) => {
  const [comments, setComments] = useState([]);
  const [refresh, setRefresh] = useState(true);

  const handleClose = () => {
    setShow(false);
    setData([]);
    setComments([]);
  };
  const dispatch = useDispatch();
  const logout = useLogout();

  useEffect(() => {
    if (show) {
      setRefresh(true);
    }
  }, [show]);

  useEffect(() => {
    dispatch(loaderStart());

    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND}/comments/${data}`,
          {
            headers: {
              token: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
              }`,
            },
          }
        );
        setComments(res?.data);
      } catch (err) {
        if (err.response.status === 403) {
          return logout();
        }
        dispatch(showAlert({ type: "warning", message: err.response.data }));
        setTimeout(() => {
          dispatch(hideAlert());
        }, 1000);
      }
      setRefresh(false);
    };
    if (refresh) {
      fetchComments();
    }
    dispatch(loaderStop());
  }, [dispatch, logout, data, refresh]);

  console.log(show, data, refresh);

  const deleteComment = async (data) => {
    dispatch(loaderStart());
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND}/comments/${data}`, {
        headers: {
          token: `Bearer ${
            JSON.parse(localStorage.getItem("user")).accessToken
          }`,
        },
      });
      dispatch(
        showAlert({ type: "success", message: "Comment deleted successfully" })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 1000);
      setRefresh(true);
    } catch (err) {
      console.log(err);
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
        size="lg"
        className="comments-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Comments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="comments-container-modal">
            <ul>
              {comments?.map((comment) => (
                <li key={comment._id}>
                  <span>
                    <strong>{comment.user.name}: </strong>
                  </span>
                  <span>{comment.comment}</span>
                  <span>
                    {moment(comment.createdAt).format("DD-MM-YYYY,  HH:mm")}
                  </span>
                  <span>
                    <i
                      className="bi bi-trash3"
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() => deleteComment(comment._id)}
                    ></i>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CommentsModal;
