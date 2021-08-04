import React from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import myip from "../global";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserId,
  setUsername,
  setUserEmail,
  setUserPassword,
  setIsLoggedIn,
  setUserProfile,
  setCartItems,
} from "../redux/actions/userActions";

const Login = () => {
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.userReducer.userEmail);
  const userPassword = useSelector((state) => state.userReducer.userPassword);

  //Makes api post request to decrease qty of an item in the user cart
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      userEmail: userEmail,
      userPassword: userPassword,
    };
    axios
      .post(`http://${myip}:5000/login`, data)
      .then((res) => {
        if (res.data) {
          dispatch(setIsLoggedIn(true));
          dispatch(setUserId(res.data._id));
          dispatch(setUserEmail(res.data.userEmail));
          dispatch(setUsername(res.data.username));
          dispatch(setUserProfile(res.data.userProfile));
          dispatch(setCartItems(res.data.userCart));
          window.location.replace(`http://${myip}:3000/`);
        } else {
          alert("Email or password is incorrect");
        }
      })
      .catch(() => alert("Failed to login"));
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="p-2"
      style={{ width: "40vw", height: "35vh" }}
    >
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={userEmail}
          onChange={(e) => dispatch(setUserEmail(e.target.value))}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={userPassword}
          onChange={(e) => dispatch(setUserPassword(e.target.value))}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Check type="checkbox" label="Remember Me" />
      </Form.Group>
      <center>
        <Button variant="light" type="submit">
          Submit
        </Button>
      </center>
    </Form>
  );
};

export default Login;
