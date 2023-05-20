import "./Home.scss";
import Users from "./users/Users";
import { useState } from "react";
import { debounce } from "lodash";
import Subjects from "./subjects/Subjects";
import Recordings from "./recordings/Recordings";
import Assignments from "./assignments/Assignments";

const AdminHome = () => {
  const [block, setBlock] = useState("All");

  return (
    <div className="admin-home">
      <div className="main-content">
        <div className="span-menu mb-3">
          <span onClick={() => setBlock("All")}>Admin</span>{" "}
          <span>{`${block === "All" ? "" : "> " + block}`}</span>
        </div>

        {block === "All" ? (
          <div className="all-blocks-container row">
            <div className="px-2 mb-3 col-4">
              <div
                className="cardBox rounded"
                onClick={() => setBlock("Users")}
              >
                <div className="users-block block">Users</div>
              </div>
            </div>
            <div className="px-2 mb-3 col-4">
              <div
                className="cardBox rounded"
                onClick={() => setBlock("Subjects")}
              >
                <div className="subjects-block block">Subjects</div>
              </div>
            </div>
            <div className="px-2 mb-3 col-4">
              <div
                className="cardBox rounded"
                onClick={() => setBlock("Recordings")}
              >
                <div className="assignments-block block">Recordings</div>
              </div>
            </div>
            <div className="px-2 mb-3 col-4">
              <div
                className="cardBox rounded"
                onClick={() => setBlock("Assignments")}
              >
                <div className="assignments-block block">Assignments</div>
              </div>
            </div>
          </div>
        ) : block === "Users" ? (
          <Users />
        ) : block === "Subjects" ? (
          <Subjects />
        ) : block === "Assignments" ? (
          <Assignments />
        ) : block === "Recordings" ? (
          <Recordings />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default AdminHome;
