import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { loaderStart, loaderStop } from "../../../redux/LoaderSlice";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import useLogout from "../../../custom/logout/Logout";
import SubjectEditModal from "./Modals/SubjectEditModal";
import SubjectDeleteModal from "./Modals/SubjectDeleteModal";

import "./Subjects.scss";
import SubjectDetailsModal from "./Modals/SubjectDetailsModal";
import AddSubjectModal from "./Modals/AddSubjectModal";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [addSubjectModal, setAddSubjectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSubjectData, setEditSubjectData] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteData, setDeleteData] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsData, setDetailsData] = useState({});

  const dispatch = useDispatch();
  const logout = useLogout();
  const gridRef = useRef();

  const columnDefs = [
    {
      headerName: "Name",
      width: 150,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center",
      cellRenderer: (params) => {
        return (
          <div
            className="subject-name-grid"
            onClick={() => subjectDetailsData(params.data._id)}
          >
            <span>{params.data.name}</span>
            {"  "}
            <i className="bi bi-box-arrow-up-right"></i>
          </div>
        );
      },
    },
    {
      headerName: "Description",
      width: 80,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center",
      cellRenderer: (params) => {
        return (
          <div>
            {params.data.desc.length <= 20
              ? params.data.desc.slice(0, 20)
              : params.data.desc.slice(0, 20) + "..."}
          </div>
        );
      },
    },
    {
      headerName: "Grade",
      field: "gradeDetails",
      width: 120,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center",
    },
    {
      field: "teacher.name",
      width: 80,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center",
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
              className="bi bi-pencil-fill"
              style={{ cursor: "pointer" }}
              onClick={() => editSubject(params.data)}
            ></i>
            <i
              className="bi bi-trash3"
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => deleteSubject(params.data)}
            ></i>
          </div>
        );
      },
    },
  ];

  const subjectDetailsData = (data) => {
    setShowDetailsModal(true);
    setDetailsData(data);
  };

  const editSubject = (data) => {
    setShowEditModal(true);
    setEditSubjectData(data);
  };
  const deleteSubject = (data) => {
    setShowDeleteModal(true);
    setDeleteData(data);
  };

  const onSubjectDeletedOrUpdated = () => {
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
        .get("subjects/", {
          headers: {
            token: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        })
        .then((res) => {
          return setSubjects(res.data);
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
      {showEditModal && (
        <SubjectEditModal
          show={showEditModal}
          setShow={setShowEditModal}
          data={editSubjectData}
          setEditSubjectData={setEditSubjectData}
          onSubjectDeletedOrUpdated={onSubjectDeletedOrUpdated}
        />
      )}
      {showDeleteModal && (
        <SubjectDeleteModal
          show={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          data={deleteData}
          setDeleteData={setDeleteData}
          onSubjectDeletedOrUpdated={onSubjectDeletedOrUpdated}
        />
      )}
      {showDetailsModal && (
        <SubjectDetailsModal
          show={showDetailsModal}
          setShow={setShowDetailsModal}
          data={detailsData}
          setDetailsData={setDetailsData}
          onSubjectDeletedOrUpdated={onSubjectDeletedOrUpdated}
        />
      )}
      {addSubjectModal && (
        <AddSubjectModal
          show={addSubjectModal}
          setShow={setAddSubjectModal}
          onSubjectDeletedOrUpdated={onSubjectDeletedOrUpdated}
        />
      )}

      <div className="subjects-example-wrapper">
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            ref={gridRef}
            rowHeight={60}
            rowData={subjects}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowSelection={"single"}
            onGridReady={onGridReady}
          />
        </div>
      </div>
      <div className="add-subject py-3">
        <button
          className="btn add-subject-button"
          onClick={() => setAddSubjectModal(true)}
        >
          Add Subject
        </button>
      </div>
    </>
  );
};

export default Subjects;
