import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useLogout from "../../custom/logout/Logout";
import { loaderStart, loaderStop } from "../../redux/LoaderSlice";
import axios from "axios";
import moment from "moment";
import { hideAlert, showAlert } from "../../redux/AlertSlice";
import "./Comments.scss";

const Comments = ({ videoOrAssignmentId, type }) => {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [refresh, setRefresh] = useState(true);

  const dispatch = useDispatch();
  const logout = useLogout();

  useEffect(() => {
    dispatch(loaderStart());

    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND}/comments/${videoOrAssignmentId}`,
          {
            headers: {
              token: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
              }`,
            },
          }
        );
        setComments(res.data);
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
  }, [videoOrAssignmentId, dispatch, refresh]);

  const handleSubmit = async (event) => {
    dispatch(loaderStart());
    event.preventDefault();
    try {
      let body = {
        user: JSON.parse(localStorage.getItem("user"))?._id, // Replace with the user ID of the currently logged-in user
        commentString: commentInput,
        id: videoOrAssignmentId,
      };

      if (type === "recording") {
        body.type = "recording";
      } else if ((type = "assignment")) {
        body.type = "assignment";
      }
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/comments`,
        body,
        {
          headers: {
            token: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        }
      );
      setCommentInput("");
      setRefresh(true);
    } catch (error) {
      console.error(error);
    }
    dispatch(loaderStop());
  };

  return (
    <div className="comments-container">
      <ul>
        {comments?.map((comment) => (
          <li key={comment._id}>
            <div className="commented-section mt-2">
              <div className="d-flex flex-row align-items-center commented-user">
                <h5 className="me-2">{comment.user.name}</h5>
                <span className="dot mb-1"></span>
                <span className="mb-1 ms-2">
                  {moment(comment.createdAt).format("DD-MM-YYYY,  HH:mm")}
                </span>
              </div>
              <div className="comment-text-sm">
                <span>{comment.comment}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <label>
          Add a comment:
          <input
            type="text"
            value={commentInput}
            onChange={(event) => setCommentInput(event.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Comments;
