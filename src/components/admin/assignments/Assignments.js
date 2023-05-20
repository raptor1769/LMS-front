import { useDispatch } from "react-redux";
import "./Assignments.scss";
import useLogout from "../../../custom/logout/Logout";
import { useCallback, useRef, useMemo, useState } from "react";
import { loaderStart, loaderStop } from "../../../redux/LoaderSlice";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import DeleteModal from "./Modals/DeleteModal";
import CommentsModal from "./Modals/CommentsModal";
import moment from "moment";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentsId, setCommentsId] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteData, setDeleteData] = useState({});

  const dispatch = useDispatch();
  const logout = useLogout();
  const gridRef = useRef();

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
            className="assignment-title-link"
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
      field: "assignment",
      width: 80,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center capitalize-value",
      cellRenderer: (params) => {
        return (
          <div>
            <a href={params?.data?.assignment} download>
              Download Assignment
            </a>
          </div>
        );
      },
    },
    {
      headerName: "Subject",
      width: 80,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center capitalize-value",
      cellRenderer: (params) => {
        return (
          <div className="assignment-teacher">{params.data.subject.name}</div>
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
          <div className="assignment-teacher">
            {params.data.subject.teacher.name} ||{" "}
            {params.data.subject.teacher.email}
          </div>
        );
      },
    },
    {
      field: "maxGrade",
      width: 80,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center capitalize-value",
    },
    {
      field: "lastDate",
      width: 80,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center",
      cellRenderer: (params) => {
        return (
          <div>
            {moment(params.data.lastDate).format("DD/MM/YYYY, HH:mm:ss")}
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
          <div className="assignments-action-container">
            <i
              className="bi bi-trash3"
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => deleteAssignment(params.data)}
            ></i>
          </div>
        );
      },
    },
  ];

  const deleteAssignment = (data) => {
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

  const onGridReady = useCallback(
    (params) => {
      dispatch(loaderStart());
      axios
        .get(`${process.env.REACT_APP_BACKEND}/assignments/`, {
          headers: {
            token: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        })
        .then((res) => {
          return setAssignments(res.data);
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
            rowData={assignments}
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

export default Assignments;
