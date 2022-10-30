import { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import Toggler from "./Toggler";

export interface NavbarState {
  expanded: boolean;
  transitioning: boolean;
  height: string;
}

const MyNavbar: React.FC = () => {
  return (
    <Navbar bg="light" variant="light" expand="md">
      <Container>
        <Navbar.Brand href="/">
          <img
            alt="Logo"
            src="/news.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          Free live news
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link href="/">News</Nav.Link>
            <Nav.Link href="/interesting-channels">
              Interesting channels
            </Nav.Link>
            <Nav.Link href="/search">Search</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
