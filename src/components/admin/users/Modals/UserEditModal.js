import axios from "axios";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { hideAlert, showAlert } from "../../../../redux/AlertSlice";
import { loaderStart, loaderStop } from "../../../../redux/LoaderSlice";

const UserEditModal = ({
  show,
  setShow,
  data,
  setEditUsersData,
  onUserDeletedOrUpdated,
}) => {
  const [name, setName] = useState(data.name);
  const [email, setEmail] = useState(data.email);
  const [verified, setVerified] = useState(data.verified);

  const dispatch = useDispatch();

  const handleClose = () => {
    setShow(false);
    setEditUsersData({});
  };

  const handleChange = () => {
    setVerified(!verified);
  };

  const handleSubmit = async () => {
    const updatedData = {
      ...data,
      name: name,
      email: email,
      verified: verified,
    };
    console.log(updatedData);
    dispatch(loaderStart());
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND}/users/${data._id}`,
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
            message: `Updated user ${res.data.name}`,
          })
        );
        setTimeout(() => {
          dispatch(hideAlert());
        }, 1000);
        setShow(false);
        setEditUsersData({});
        onUserDeletedOrUpdated();
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
          <Modal.Title>Edit user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="mb-3">
            <label>Name</label>
            <input
              type="text"
              value={name}
              class="form-control"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div class="mb-3">
            <label>Email</label>
            <input
              type="email"
              value={email}
              class="form-control"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div class="form-check">
            <label class="form-check-label">Verified</label>
            <input
              class="form-check-input"
              type="checkbox"
              defaultChecked={verified}
              onChange={handleChange}
            />
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

export default UserEditModal;
