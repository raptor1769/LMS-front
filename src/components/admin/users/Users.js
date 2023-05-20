import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import moment from "moment";
import { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { loaderStart, loaderStop } from "../../../redux/LoaderSlice";
import UserDeleteModal from "./Modals/UserDeleteModal";
import UserEditModal from "./Modals/UserEditModal";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./Users.scss";
import useLogout from "../../../custom/logout/Logout";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editUsersData, setEditUsersData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteData, setDeleteData] = useState({});
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
      cellClass: "ag-cell-center",
    },
    {
      field: "role",
      width: 80,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center capitalize-value",
    },
    {
      field: "verified",
      width: 80,
      headerClass: "ag-header-cell-center",
      cellClass: "ag-cell-center",
      cellRenderer: (params) => {
        return (
          <div
            className={
              params.data.verified
                ? "badge bg-success text-capitalize"
                : "badge bg-danger text-capitalize"
            }
          >
            {params.data.verified.toString()}
          </div>
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
              className="bi bi-pencil-fill"
              style={{ cursor: "pointer" }}
              onClick={() => editProfile(params.data)}
            ></i>
            <i
              className="bi bi-trash3"
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => deleteProfile(params.data)}
            ></i>
          </div>
        );
      },
    },
  ];

  const editProfile = (data) => {
    setShowEditModal(true);
    setEditUsersData(data);
  };
  const deleteProfile = (data) => {
    setShowDeleteModal(true);
    setDeleteData(data);
  };

  const onUserDeletedOrUpdated = () => {
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
    async (params) => {
      dispatch(loaderStart());
      await axios
        .get(`${process.env.REACT_APP_BACKEND}/users/`, {
          headers: {
            token: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        })
        .then((res) => {
          return setUsers(res.data);
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
        <UserEditModal
          show={showEditModal}
          setShow={setShowEditModal}
          data={editUsersData}
          setEditUsersData={setEditUsersData}
          onUserDeletedOrUpdated={onUserDeletedOrUpdated}
        />
      )}
      {showDeleteModal && (
        <UserDeleteModal
          show={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          data={deleteData}
          setDeleteData={setDeleteData}
          onUserDeletedOrUpdated={onUserDeletedOrUpdated}
        />
      )}
      <div className="users-example-wrapper">
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            ref={gridRef}
            rowData={users}
            rowHeight={60}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowSelection={"single"}
            onGridReady={onGridReady}
          />
        </div>
      </div>
    </>
  );
};

export default Users;
