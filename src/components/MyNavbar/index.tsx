import { useEffect, useState } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  useEffect(() => {
    setActiveSection(location.pathname); // contains initial '/'
  }, [location]);
  return (
    <Navbar bg="light" variant="light" expand="md" collapseOnSelect={true}>
      <div className="container">
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
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            {navLinks.map((nl, i) => {
              const isActive = activeSection === nl.link;
              return (
                <Nav.Link
                  key={i}
                  href={nl.link}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(nl.link);
                  }}
                  data-bs-toggle="collapse"
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
                </Nav.Link>
              );
            })}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default MyNavbar;
