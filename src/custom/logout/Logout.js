import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideAlert, showAlert } from "../../redux/AlertSlice";
import { logout } from "../../redux/AuthSlice";
import { loaderStart, loaderStop } from "../../redux/LoaderSlice";

const useLogout = (type) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    dispatch(loaderStart());
    try {
      localStorage.removeItem("user");
      dispatch(logout());

      if (type !== "Button") {
        dispatch(
          showAlert({
            type: "warning",
            message: `Please login to continue`,
          })
        );
      }

      setTimeout(() => {
        dispatch(loaderStop());
        dispatch(hideAlert());
        navigate("/", { replace: true });
      }, 1000);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }, [dispatch, navigate, type]);

  return handleLogout;
};

export default useLogout;
