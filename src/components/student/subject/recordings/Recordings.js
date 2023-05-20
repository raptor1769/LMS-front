import { useEffect, useState } from "react";
import "./Recordings.scss";
// import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { loaderStart, loaderStop } from "../../../../redux/LoaderSlice";
import axios from "axios";
import useLogout from "../../../../custom/logout/Logout";
import { hideAlert, showAlert } from "../../../../redux/AlertSlice";
import Comments from "../../../comments/Comments";

const Recordings = ({ subject }) => {
  const [recordings, setRecordings] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  // const [refresh, setRefresh] = useState(true);

  const [show, setShow] = useState(false);

  const dispatch = useDispatch();
  const logout = useLogout();

  useEffect(() => {
    dispatch(loaderStart());
    const getRecordings = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND}/recordings/${subject._id}`,
          {
            headers: {
              token: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
              }`,
            },
          }
        );
        setRecordings(res.data);
        // setRefresh(false);
      } catch (err) {
        if (err.response.status === 403) {
          return logout();
        }
        dispatch(showAlert({ type: "warning", message: err.response.data }));
        setTimeout(() => {
          dispatch(hideAlert());
        }, 1000);
      }
    };
    getRecordings();
    dispatch(loaderStop());
  }, [dispatch, logout, subject._id]);

  return (
    <>
      <div className="recordings-container">
        <div className="recordings-left-section">
          {recordings?.length > 0 && <span>All Recordings</span>}
          <ul className="recordings-list">
            {recordings?.length > 0 ? (
              <>
                {recordings?.map((item, idx) => (
                  <li
                    key={item._id}
                    onClick={() => setActiveVideo(item)}
                    className="recordings-list-item"
                  >
                    <span>{item.title}</span>
                  </li>
                ))}
              </>
            ) : (
              <li>No videos added</li>
            )}
          </ul>
        </div>
        <div className="recording-right-section">
          {recordings.length > 0 ? (
            <>
              <div className="recording-video-player">
                {activeVideo === null ? (
                  <div>Please select video to play</div>
                ) : (
                  <video
                    key={activeVideo._id}
                    style={{ width: "100%" }}
                    controls
                    preload="auto"
                  >
                    <source src={activeVideo.video} type="video/mp4" />
                    <source src={activeVideo.video} type="video/ogg" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              {activeVideo !== null && (
                <div className="recording-comments">
                  <Comments
                    videoOrAssignmentId={activeVideo._id}
                    type="recording"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="no-videos-section">
              <div onClick={() => setShow(true)}>
                <div>No videos found</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Recordings;
