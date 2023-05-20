import { Alert } from "react-bootstrap";

const AlertBar = ({ message, type }) => {
  return <Alert variant={type}>{message}</Alert>;
};

export default AlertBar;
