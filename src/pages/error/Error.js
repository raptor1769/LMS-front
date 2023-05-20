import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./Error.scss";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="error-container">
        <Container fluid className="page-not-found">
          <Row className="justify-content-center align-items-center h-100">
            <Col md={6}>
              <h1 className="text-center mb-4">Oops! Page not found</h1>
              <p className="text-center mb-4">
                The page you are looking for might have been removed, had its
                name changed or is temporarily unavailable.
              </p>
              <div className="text-center">
                <Button
                  href="/"
                  variant="primary"
                  size="lg"
                  className="back-to-home"
                  onClick={() => navigate("/")}
                >
                  Go back home
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ErrorPage;
