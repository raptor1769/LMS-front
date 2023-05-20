import { useDispatch } from "react-redux";
// import useLogout from "../../../../../custom/logout/Logout";
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loaderStart, loaderStop } from "../../../../../redux/LoaderSlice";
import { AgGridReact } from "ag-grid-react";

const AddStundentsGrid = ({
  data,
  setAddStudentsButtonState,
  setAddStudentsId,
}) => {
  const [studentsData, setStudentsData] = useState();

  const dispatch = useDispatch();
  //   const logout = useLogout();
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
      const getAllStudents = async () => {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_BACKEND}/users?type=student`,
            {
              headers: {
                token: `Bearer ${
                  JSON.parse(localStorage.getItem("user")).accessToken
                }`,
              },
            }
          );

          const result = res?.data
            .filter((item1) => {
              // check if the item exists in arr2
              const item2 = data?.students?.find(
                (item) => item._id === item1._id
              );
              return !item2; // return true if not found in arr2
            })
            .map(({ _id, name, email }) => ({ _id, name, email }));

          setStudentsData(result);
        } catch (err) {
          console.log(err);
        }
      };
      getAllStudents();
      dispatch(loaderStop());
    },
    [dispatch, data?.students]
  );

  useEffect(() => {
    onGridReady();
  }, [data, onGridReady]);

  const onSelectionChanged = useCallback(
    (event) => {
      let rowCount = event.api.getSelectedNodes().length;
      rowCount === 0
        ? setAddStudentsButtonState(true)
        : setAddStudentsButtonState(false);

      let addStudentsId = event.api
        .getSelectedNodes()
        ?.map((item) => item.data._id);

      setAddStudentsId(addStudentsId);
    },
    [setAddStudentsButtonState, setAddStudentsId]
  );

  const onQuickFilterChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("quickFilter").value
    );
  }, []);

  return (
    <>
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

export default AddStundentsGrid;
