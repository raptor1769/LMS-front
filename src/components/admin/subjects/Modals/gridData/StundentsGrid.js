import { useDispatch } from "react-redux";
import useLogout from "../../../../../custom/logout/Logout";
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loaderStart, loaderStop } from "../../../../../redux/LoaderSlice";
import { AgGridReact } from "ag-grid-react";
import { Modal, Button } from "react-bootstrap";
import { hideAlert, showAlert } from "../../../../../redux/AlertSlice";

const StundentsGrid = ({
  data,
  setUpdateStudents,
  setDeleteButtonState,
  setDeleteStudentsId,
}) => {
  const [studentsData, setStudentsData] = useState();
  const [show, setShow] = useState(false);
  const [updatedStudentsArray, setUpdatedStudentsArray] = useState([]);
  const [deleteStudentName, setDeleteStudentName] = useState("");

  const dispatch = useDispatch();
  const logout = useLogout();
  const gridRef = useRef();
  const columnDefs = [
    {
      field: "email",
      width: 80,
      headerClass: "ag-header-cell-left",
      cellClass: "ag-cell-left",
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
    },
    {
      headerName: "Name",
      field: "name",
      width: 120,
      headerClass: "ag-header-cell-left",
      cellClass: "ag-cell-left",
    },
  ];

  const containerStyle = useMemo(() => ({ width: "100%", height: "50vh" }), []);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const onGridReady = useCallback(
    (params) => {
      dispatch(loaderStart());
      setStudentsData(data?.students);
      dispatch(loaderStop());
    },
    [dispatch, data]
  );

  useEffect(() => {
    onGridReady();
  }, [data, onGridReady]);

  const handleClose = () => {
    setShow(false);
    setDeleteStudentName("");
  };

  const handleDelete = async () => {
    dispatch(loaderStart());
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND}/subjects/${data._id}`,
        {
          students: updatedStudentsArray,
        },
        {
          headers: {
            token: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        }
      );

      dispatch(
        showAlert({
          type: "success",
          message: `${deleteStudentName} removed successfuly from ${data.name}`,
        })
      );
      setTimeout(() => {
        dispatch(hideAlert());
      }, 1000);
    } catch (err) {
      if (err.response.status === 403) {
        logout();
      }
      console.log(err);
    }
    setShow(false);
    setUpdatedStudentsArray([]);
    setDeleteStudentName("");
    setUpdateStudents(true);
    dispatch(loaderStop());
  };

  const onSelectionChanged = useCallback(
    (event) => {
      let rowCount = event.api.getSelectedNodes().length;
      rowCount === 0 ? setDeleteButtonState(true) : setDeleteButtonState(false);

      let deletedStudentsId = event.api
        .getSelectedNodes()
        ?.map((item) => item.data._id);
      setDeleteStudentsId(deletedStudentsId);
    },
    [setDeleteButtonState, setDeleteStudentsId]
  );

  const onQuickFilterChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("quickFilter").value
    );
  }, []);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
        className="subject-details-modal"
      >
        <Modal.Header>
          <Modal.Title>Remove students</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Remove selected students from subject <b>{data.name}</b>
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
      <div style={containerStyle}>
        <div className="studentsGrid-wrapper">
          <div className="mb-2">
            <input
              type="text"
              onInput={onQuickFilterChanged}
              id="quickFilter"
              placeholder="quick filter..."
            />
          </div>
          <div className="ag-theme-alpine">
            <AgGridReact
              ref={gridRef}
              rowHeight={60}
              rowData={studentsData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onSelectionChanged={onSelectionChanged}
              rowSelection={"multiple"}
              rowMultiSelectWithClick={true}
              onGridReady={onGridReady}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default StundentsGrid;
