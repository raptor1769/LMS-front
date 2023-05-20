import { Dropdown, DropdownButton } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useLogout from "../../custom/logout/Logout";
import { useEffect, useState } from "react";
import "./NavBar.scss";

const NavBar = () => {
  const [loggingOut, setLoggingOut] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const isVerified = user?.verified;
  const logout = useLogout("Button");
  const navigate = useNavigate();

  useEffect(() => {
    if (loggingOut) {
      logout()
        .then(() => {
          navigate("/");
        })
        .catch(() => {
          navigate("/error");
        })
        .finally(() => {
          setLoggingOut(false);
        });
    }
  }, [loggingOut, logout, navigate]);

  const handleLoggingOut = () => {
    setLoggingOut(true);
  };

  return (
    <>
      <div
        className="nav-bar"
        style={user === null ? { justifyContent: "center" } : {}}
      >
        <p onClick={() => navigate(`/${user.name}`)} className="logo-name">
          UCM-LMS
        </p>
        {user !== null && (
          <div className="navbar-right-container">
            {isVerified && (
              <i
                onClick={() => navigate(`/${user.name}`)}
                className="bi bi-house home-button"
                style={{ fontSize: "23px" }}
              ></i>
            )}
            <DropdownButton
              id="dropdown-basic-button"
              title={user?.name?.[0].toUpperCase()}
            >
              {/* <Dropdown.Item>My Profile</Dropdown.Item>
              <Dropdown.Item>Settings</Dropdown.Item> */}
              <Dropdown.Item onClick={handleLoggingOut}>Logout</Dropdown.Item>
            </DropdownButton>
          </div>
        )}
      </div>
    </>
  );
};

export default NavBar;
