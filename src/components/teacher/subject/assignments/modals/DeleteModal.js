import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import useLogout from "../../../../../custom/logout/Logout";
import { loaderStart, loaderStop } from "../../../../../redux/LoaderSlice";
import { hideAlert, showAlert } from "../../../../../redux/AlertSlice";

const DeleteModal = ({
  show,
  setShowDeleteModal,
  data,
  setDeleteData,
  setRefresh,
}) => {
  const handleClose = () => {
    setShowDeleteModal(false);
    setDeleteData({});
  };
  const dispatch = useDispatch();
  const logout = useLogout();

  const handleDelete = async () => {
    dispatch(loaderStart());
    // console.log(data);
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_BACKEND}/assignments/${data._id}`,
        {
          headers: {
            token: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        }
      );
      if (res.status === 200) {
        dispatch(showAlert({ type: "success", message: res.data }));
        setTimeout(() => {
          dispatch(hideAlert());
        }, 1000);
        setShowDeleteModal(false);
        setDeleteData({});
        setRefresh(true);
      }
    } catch (err) {
      if (err.response.status === 403) {
        logout();
      }
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
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the assignment <b>{data.title}</b>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteModal;
