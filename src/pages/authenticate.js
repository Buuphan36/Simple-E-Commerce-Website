import React from "react";
import Tab from "react-bootstrap/Tab";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";
import Login from "./login";
import Signup from "./signup";

const Authenticate = () => {
  return (
    <div className="center-page">
      <Card bg="dark" style={{color: "#fff"}}>
        <Card.Body>
          <Tab.Container defaultActiveKey="login">
            <Nav fill justify variant="pills" className="m-2">
                <Nav.Item>
                  <Nav.Link eventKey="login">Log in</Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link eventKey="signup">Sign up</Nav.Link>
                </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="login">
                <Login />
              </Tab.Pane>
              <Tab.Pane eventKey="signup">
                <Signup />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Authenticate;
