import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import NavDropdown from "react-bootstrap/NavDropdown";
import Figure from "react-bootstrap/Figure";
import Dropdown from "react-bootstrap/Dropdown";
import Badge from "react-bootstrap/Badge";
import { useDispatch, useSelector } from "react-redux";
import {
  setUsername,
  setUserEmail,
  setUserPassword,
  setUserId,
  setIsLoggedIn,
  setUserProfile,
} from "../redux/actions/userActions";

const NavBar = () => {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.userReducer.username);
  const isLoggedIn = useSelector((state) => state.userReducer.isLoggedIn);
  const userProfile = useSelector((state) => state.userReducer.userProfile);
  const cartItems = useSelector((state) => state.userReducer.cartItems);

  console.log("username: " + username);

  const handleSignOut = () => {
    dispatch({ type: "USER_SET_LOG_OUT" });
    window.location.replace("http://localhost:3000/");
  };

  const handleCalculateCartItemsNumber = () =>{
    let total = 0;
    for (let i = 0; i < cartItems.length; i++) {
      total += cartItems[i].quantity;
    }
    return total;
  }

  return (
    <div>
      <Navbar
        collapseOnSelect
        bg="dark"
        variant="dark"
        expand="lg"
        className="nav-padding"
      >
        <Navbar.Brand href="/">
          <img src="box.svg" width="35" height="35" alt="Brand Logo" /> {"Demo"}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          id="responsive-navbar-nav"
          className="justify-content-end"
        >
          <Nav>
            {isLoggedIn && (
              <Nav>
                <NavDropdown
                  title={
                    <Figure.Image
                      src={userProfile}
                      width="25"
                      height="25"
                      alt="profile"
                      roundedCircle
                    />
                  }
                >
                  <NavDropdown.Header>
                    <Figure.Image
                      src={userProfile}
                      width="30"
                      height="30"
                      alt="profile"
                      roundedCircle
                    />{" "}
                    {`${username}`}
                  </NavDropdown.Header>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/my-orders">
                    My Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/my-posts">My Posts</NavDropdown.Item>
                  <NavDropdown.Item href="/make-post">
                    Make a Post
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/my-account">
                    Account Settings
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleSignOut}>
                    Sign Out{" "}
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            )}
            <Nav.Link href="/">Shop</Nav.Link>
            <Nav.Link href="/my-orders">Orders</Nav.Link>
            <Nav.Link href="/my-posts">Post</Nav.Link>
            <Nav.Link href="/my-cart">
              Cart
              <Badge bg="light">{handleCalculateCartItemsNumber()}</Badge>
            </Nav.Link>
            {!isLoggedIn && (
              <Nav>
                <Button href="/authenticate" variant="outline-light">
                  Log In
                </Button>
              </Nav>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;
