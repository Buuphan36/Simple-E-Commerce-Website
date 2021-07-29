import React from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Figure from "react-bootstrap/Figure";
import { useDispatch, useSelector } from "react-redux";
import {
  setUsername,
  setUserEmail,
  setUserPassword,
  setUserId,
  setUserProfile,
  setIsLoggedIn,
} from "../redux/actions/userActions";
import axios from "axios";

const Settings = () => {
  const dispatch = useDispatch();
  const [file, setFile] = React.useState("");
  const [fileName, setFileName] = React.useState("");
  const [previewFile, setPreviewFile] = React.useState("");
  const [username, setUserName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const userId = useSelector((state) => state.userReducer.userId);
  const userProfile = useSelector((state) => state.userReducer.userProfile);
  const [errorMessage1, setErrorMessage1] = React.useState("");
  const [errorMessage2, setErrorMessage2] = React.useState("");
  const [errorMessage3, setErrorMessage3] = React.useState("");
  const [errorMessage4, setErrorMessage4] = React.useState("");

  const getUserInfo = () => {
    axios
      .get(`http://localhost:5000/get-user-info?id=${userId}`)
      .then((res) => {
        setFileName(res.data.userProfile);
        setUserName(res.data.username);
        setEmail(res.data.userEmail);
        setPassword(res.data.userPassword);
      })
      .catch(() => alert("Failed to load user profile"));
  };

  const fileUploaded = (event) => {
    setPreviewFile(URL.createObjectURL(event.target.files[0]));
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  const deleteFile = (profileName) => {
    axios
      .get(`http://localhost:5000/delete-image?imageName=${profileName}`)
      .then((res) => {
        if (res.data.success) {
          console.log("Successfully removed the file!");
        } else {
          console.log("Failed removed the file!");
        }
      })
      .catch(() => console.log("Failed to send a request"));
  };

  const changeImage = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(`http://localhost:5000/change-profile?userId=${userId}`, formData)
      .then((res) => {
        console.log("image res:" + JSON.stringify(res.data));
        if (res.data.success) {
          dispatch(setUserProfile(res.data.userProfile));
          setErrorMessage1(res.data.error);
        } else {
          setErrorMessage1(res.data.error);
        }
      })
      .catch(() => alert("Failed to send a request"));
  };

  const changeUsername = (e) => {
    e.preventDefault();
    const data = {
      userId: userId,
      username: username,
    };
    axios
      .post("http://localhost:5000/change-username", data)
      .then((res) => {
        console.log("username res:" + JSON.stringify(res.data));
        if (res.data.success) {
          dispatch(setUsername(res.data.username));
          setErrorMessage2(res.data.error);
        } else {
          setErrorMessage2(res.data.error);
        }
      })
      .catch(() => alert("Failed to send a request"));
  };

  const changeUserEmail = (e) => {
    e.preventDefault();
    const data = {
      userId: userId,
      userEmail: email,
    };
    axios
      .post("http://localhost:5000/change-email", data)
      .then((res) => {
        console.log("login res:" + JSON.stringify(res.data));
        if (res.data.success) {
          dispatch(setUserEmail(res.data.userEmail));
          setErrorMessage3(res.data.error);
        } else {
          setErrorMessage3(res.data.error);
        }
      })
      .catch(() => alert("Failed to send a request"));
  };

  const changeUserPassword = (e) => {
    e.preventDefault();
    const data = {
      userId: userId,
      userPassword: password,
    };
    axios
      .post("http://localhost:5000/change-password", data)
      .then((res) => {
        console.log("login res:" + JSON.stringify(res.data));
        if (res.data.success) {
          dispatch(setUserPassword(res.data.userPassword));
          setErrorMessage4(res.data.error);
        } else {
          setErrorMessage4(res.data.error);
        }
      })
      .catch(() => alert("Failed to send a request"));
  };

  React.useEffect(() => {
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form className="m-5" style={{ color: "#fff" }}>
      <Card.Title>Profile Picture</Card.Title>

      <Card className="mb-5" bg="dark">
        <Card.Body>
          <center>
            <Figure>
              {!previewFile && <Figure.Image
                width={200}
                height={200}
                alt="User-Profile"
                src={userProfile}
                roundedCircle
              />}
              {previewFile && <Figure.Image
                width={200}
                height={200}
                alt="User-Profile"
                src={previewFile}
                roundedCircle
              />}
            </Figure>

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>
                Upload an image to change your profile picture
              </Form.Label>
              <div>
                <Form.Control
                  type="file"
                  onChange={fileUploaded}
                  className="mt-3"
                />
              </div>
              <div className="mt-3">
                <Button variant="outline-light" onClick={changeImage}>
                  Update Picture
                </Button>
              </div>

              <Form.Label className="mt-3">{errorMessage1}</Form.Label>
            </Form.Group>
          </center>
        </Card.Body>
      </Card>

      <Card.Title>Profile Settings</Card.Title>
      <Card className="mb-5" bg="dark">
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Row>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Col>
              <Col>
                <Button variant="outline-light" onClick={changeUsername}>
                  Update
                </Button>
              </Col>
              <Col>
                <Form.Label>{errorMessage2}</Form.Label>
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Row>
              <Col>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Col>
              <Col>
                <Button variant="outline-light" onClick={changeUserEmail}>
                  Update
                </Button>
              </Col>
              <Col>
                <Form.Label>{errorMessage3}</Form.Label>
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Row>
              <Col>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Col>
              <Col>
                <Button variant="outline-light" onClick={changeUserPassword}>
                  Update
                </Button>
              </Col>
              <Col>
                <Form.Label>{errorMessage4}</Form.Label>
              </Col>
            </Row>
          </Form.Group>
        </Card.Body>
      </Card>
    </Form>
  );
};

export default Settings;
