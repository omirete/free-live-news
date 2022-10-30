import { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export interface NavbarState {
  expanded: boolean;
  transitioning: boolean;
  height: string;
}

interface NavLinkInfo {
  link: string;
  text: string;
}

const navLinks: NavLinkInfo[] = [
  { link: "/", text: "News" },
  { link: "/interesting-channels", text: "Interesting channels" },
  { link: "/search", text: "Search" },
];

const MyNavbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("");
  const location = useLocation();
  useEffect(() => {
    setActiveSection(location.pathname); // contains initial '/'
  }, [location]);
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
            {navLinks.map((nl, i) => {
              const isActive = activeSection === nl.link;
              return (
                <Link
                  key={i}
                  to={nl.link}
                  className={`
                    nav-link
                    ${
                      isActive
                        ? "active border-bottom border-warning border-2"
                        : ""
                    }
                `}
                >
                  {nl.text}
                </Link>
              );
            })}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
