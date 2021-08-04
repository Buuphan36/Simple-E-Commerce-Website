import React from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import myip from "../global";

const Signup = () => {
  const defaultImage = "default-profile.png";
  const [username, setUsername] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");  
  const [userPassword2,setUserPassword2] = React.useState("");

  //Makes api post request to create an account for the user
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userPassword !== userPassword2){
      alert("Both passwords are not matched!");
    }
    else {
    const data = {
      username: username,
      userEmail: userEmail,
      userPassword: userPassword,
      userProfile: defaultImage,
      userCart: [],
    };
    console.log("form: " + data);
    axios
      .post(`http://${myip}:5000/sign-up`, data)
      .then((res) => {
        if(res.data){
          window.location.replace(`http://${myip}:3000/authenticate`);
        }else{
          alert("Failed to sign up");
        }
      })
      .catch(() => alert("Failed to sign up"));}
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="p-2"
      style={{ width: "40vw", height: "52vh" }}
    >
      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Re-enter password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={userPassword2}
          onChange={(e) => setUserPassword2(e.target.value)}
        />
      </Form.Group>

      <center>
        <Button variant="light" type="submit">
          Submit
        </Button>
      </center>

    </Form>
  );
};

export default Signup;
