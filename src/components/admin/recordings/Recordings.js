import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import moment from "moment";
import { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { loaderStart, loaderStop } from "../../../redux/LoaderSlice";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./Recordings.scss";
import useLogout from "../../../custom/logout/Logout";
import DeleteModal from "./Modals/DeleteModal";
import CommentsModal from "./Modals/CommentsModal";

const Recordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentsId, setCommentsId] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteData, setDeleteData] = useState({});
  const columnDefs = [
    {
      headerName: "Title",
      width: 150,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center capitalize-value",
      cellRenderer: (params) => {
        return (
          <div
            onClick={() => {
              setCommentsId(params?.data?._id);
              setShowCommentsModal(true);
            }}
            className="recording-title-link"
          >
            {params?.data?.title}
            {"  "}
            <i className="bi bi-box-arrow-up-right"></i>
          </div>
        );
      },
    },
    {
      field: "desc",
      width: 150,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center",
    },
    {
      headerName: "Video",
      width: 80,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center capitalize-value",
      cellRenderer: (params) => {
        return (
          <div>
            <a href={params.data.video} download>
              Download video
            </a>
          </div>
        );
      },
    },
    {
      headerName: "Teacher",
      width: 80,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center capitalize-value",
      cellRenderer: (params) => {
        return (
          <div className="recording-teacher">
            {params.data.teacher.name} || {params.data.teacher.email}
          </div>
        );
      },
    },
    {
      headerName: "Subject",
      width: 80,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center",
      cellRenderer: (params) => {
        return (
          <div className="recording-subject">{params.data.subject.name}</div>
        );
      },
    },
    {
      field: "createdAt",
      width: 80,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center",
      cellRenderer: (params) => {
        return (
          <div>
            {moment(params.data.createdAt).format("DD/MM/YYYY, HH:mm:ss")}
          </div>
        );
      },
    },
    {
      headerName: "Actions",
      width: 40,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center",
      cellRenderer: (params) => {
        return (
          <div className="users-action-container">
            <i
              className="bi bi-trash3"
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => deleteRecording(params.data)}
            ></i>
          </div>
        );
      },
    },
  ];

  const deleteRecording = (data) => {
    setShowDeleteModal(true);
    setDeleteData(data);
  };

  const onVideoDeletedOrUpdated = () => {
    onGridReady();
  };

  const gridStyle = useMemo(
    () => ({
      height: "100%",
      width: "100%",
    }),
    []
  );
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      resizable: true,
    };
  }, []);

  const dispatch = useDispatch();
  const logout = useLogout();
  const gridRef = useRef();

  const onGridReady = useCallback(
    (params) => {
      dispatch(loaderStart());
      axios
        .get(`${process.env.REACT_APP_BACKEND}/recordings/`, {
          headers: {
            token: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        })
        .then((res) => {
          return setRecordings(res.data);
        })
        .catch((err) => {
          if (err.response.status === 403) {
            logout();
          }
          console.log(err);
        });
      dispatch(loaderStop());
    },
    [dispatch, logout]
  );

  return (
    <>
      {/* {showEditModal && (
        <UserEditModal
          show={showEditModal}
          setShow={setShowEditModal}
          data={editUsersData}
          setEditUsersData={setEditUsersData}
          onUserDeletedOrUpdated={onUserDeletedOrUpdated}
        />
      )} */}
      {commentsId && (
        <CommentsModal
          show={showCommentsModal}
          setShow={setShowCommentsModal}
          data={commentsId}
          setData={setCommentsId}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          show={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          data={deleteData}
          setDeleteData={setDeleteData}
          onVideoDeletedOrUpdated={onVideoDeletedOrUpdated}
        />
      )}

      <div className="users-example-wrapper">
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            ref={gridRef}
            rowHeight={60}
            rowData={recordings}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowSelection={"single"}
            onGridReady={onGridReady}
            colResizeDefault="true"
          />
        </div>
      </div>
    </>
  );
};

export default Recordings;
