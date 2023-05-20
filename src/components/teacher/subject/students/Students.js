import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./Students.scss";
import { loaderStart, loaderStop } from "../../../../redux/LoaderSlice";
import useLogout from "../../../../custom/logout/Logout";
import { Button } from "react-bootstrap";

const Students = ({ subject }) => {
  const [students, setStudents] = useState([]);

  const logout = useLogout();
  const dispatch = useDispatch();
  const gridRef = useRef();
  const columnDefs = [
    {
      field: "name",
      width: 150,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center capitalize-value",
    },
    {
      field: "email",
      width: 150,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center capitalize-value",
    },
    {
      field: "totalGrade",
      width: 150,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center capitalize-value",
    },
  ];

  const gridStyle = useMemo(
    () => ({
      height: "60vh",
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

  const onClickExport = () => {
    gridRef.current.api.exportDataAsCsv();
  };

  const onGridReady = useCallback(
    async (params) => {
      dispatch(loaderStart());
      await axios
        .get(
          `${process.env.REACT_APP_BACKEND}/assignments/${subject._id}/gradeReport`,
          {
            headers: {
              token: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
              }`,
            },
          }
        )
        .then((res) => {
          return setStudents(res.data);
        })
        .catch((err) => {
          if (err.response.status === 403) {
            logout();
          }
          console.log(err);
        });
      dispatch(loaderStop());
    },
    [dispatch, logout, subject._id]
  );

  return (
    <div style={{ height: "100%" }}>
      <div className="students-example-wrapper">
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            ref={gridRef}
            rowData={students}
            rowHeight={60}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowSelection={"single"}
            onGridReady={onGridReady}
          />
        </div>
      </div>
      <Button onClick={() => onClickExport()} disabled={students.length === 0}>
        Export
      </Button>
    </div>
  );
};

export default Students;
