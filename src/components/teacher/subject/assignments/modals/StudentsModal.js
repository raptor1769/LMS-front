import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import useLogout from "../../../../../custom/logout/Logout";
import { loaderStart, loaderStop } from "../../../../../redux/LoaderSlice";
import { hideAlert, showAlert } from "../../../../../redux/AlertSlice";
import axios from "axios";
import EditModal from "./EditModal";

const StudentsModal = ({ show, setShow, data }) => {
  const [reload, setReload] = useState(true);
  const [studentData, setStudentData] = useState([]);
  const [studentDataEdit, setStudentDataEdit] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [maxMarks, setMaxMarks] = useState(0);

  const assgnStatusText = [
    "Not submitted",
    "Submitted",
    "Reviewed",
    "Rejected",
  ];

  const columnDefs = [
    {
      headerName: "Name",
      width: 150,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center capitalize-value",
      cellRenderer: (params) => {
        return (
          <div
            className="student-assignment-edit"
            onClick={() => handleModal(params.data)}
          >
            <span>{params?.data?.studentId.name}</span>
            <span>
              <i className="bi bi-box-arrow-up-right"></i>
            </span>
          </div>
        );
      },
    },
    {
      field: "studentId.email",
      headerName: "Email",
      width: 150,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center capitalize-value",
    },
    {
      field: "submissionLink",
      headerName: "Link",
      width: 150,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center capitalize-value",
    },
    {
      field: "submissionDate",
      headerName: "Date",
      width: 150,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center capitalize-value",
    },
    {
      field: "obtainedGrade",
      headerName: "Grades",
      width: 150,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center capitalize-value",
    },
    {
      field: "submissionStatus",
      headerName: "Status",
      width: 150,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center capitalize-value",
      cellRenderer: (params) => {
        let classValue;
        switch (assgnStatusText[params.data.submissionStatus]) {
          case "Submitted":
            classValue = "bg-info";
            break;
          case "Reviewed":
            classValue = "bg-success";
            break;
          case "Rejected":
            classValue = "bg-danger";
            break;
          case "Not submitted":
            classValue = "bg-warning";
            break;

          default:
            classValue = "bg-warning";
            break;
        }

        return (
          <div className={`badge text-capitalize ${classValue}`}>
            {assgnStatusText[params.data.submissionStatus]}
          </div>
        );
      },
    },
  ];

  const dispatch = useDispatch();
  const logout = useLogout();
  const gridRef = useRef();

  const handleModal = (data) => {
    setStudentDataEdit(true);
    setEditStudent(data);
  };

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      resizable: true,
    };
  }, []);

  const containerStyle = useMemo(
    () => ({ width: "100%", height: "80vh", margin: "30px 20px 30px 0" }),
    []
  );

  const gridStyle = useMemo(
    () => ({
      height: "100%",
      width: "100%",
    }),
    []
  );

  const onGridReady = useCallback(async () => {
    dispatch(loaderStart());
    const getStudentData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND}/assignments/${data}/students`,
          {
            headers: {
              token: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
              }`,
            },
          }
        );
        setStudentData(res.data.studentData);
        setMaxMarks(res.data.maxGrade);
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
    if (reload) {
      getStudentData();
    }
    dispatch(loaderStop());
  }, [dispatch, logout, data, reload]);

  useEffect(() => {
    if (reload) {
      onGridReady();
    }
  }, [dispatch, logout, data, reload, onGridReady]);

  const handleClose = () => {
    setShow(false);
    setStudentData([]);
  };

  return (
    <>
      {studentDataEdit && editStudent && (
        <EditModal
          show={studentDataEdit}
          setShow={setStudentDataEdit}
          data={editStudent}
          maxMark={maxMarks}
          assignment={data}
          setReload={setReload}
          onGridReady={onGridReady}
        />
      )}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>Student Details</Modal.Header>
        <Modal.Body>
          <div style={containerStyle}>
            <div style={gridStyle} className="ag-theme-alpine">
              <AgGridReact
                ref={gridRef}
                rowData={studentData}
                rowHeight={60}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                rowSelection={"single"}
                onGridReady={onGridReady}
              />
            </div>
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

export default StudentsModal;
