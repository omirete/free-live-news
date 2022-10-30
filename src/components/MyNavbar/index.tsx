import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export interface NavbarState {
  expanded: boolean;
  transitioning: boolean;
  height: string;
}

const MyNavbar: React.FC = () => {
  return (
    <Navbar bg="light" variant="light" expand="md">
      <Container>
        <Navbar.Brand>
          <Link to="/" className="text-decoration-none text-dark">
            <img
              alt="Logo"
              src="/news.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            Free live news
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Link to="/" className="nav-link">
              News
            </Link>
            <Link to="interesting-channels" className="nav-link">
              Interesting channels
            </Link>
            <Link to="search" className="nav-link">
              Search
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
