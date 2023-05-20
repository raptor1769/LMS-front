import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import useLogout from "../../../../custom/logout/Logout";
import { hideAlert, showAlert } from "../../../../redux/AlertSlice";
import { loaderStart, loaderStop } from "../../../../redux/LoaderSlice";

const UserDeleteModal = ({
  show,
  setShowDeleteModal,
  data,
  setDeleteData,
  onUserDeletedOrUpdated,
}) => {
  const handleClose = () => {
    setShowDeleteModal(false);
    setDeleteData({});
  };
  const dispatch = useDispatch();
  const logout = useLogout("Session");

  const handleDelete = async () => {
    dispatch(loaderStart());
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_BACKEND}/users/${data._id}`,
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
        onUserDeletedOrUpdated();
      }
    } catch (err) {
      if (err.response.status === 403) {
        logout();
      }
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
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete user <b>{data.name}</b>
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

export default UserDeleteModal;
