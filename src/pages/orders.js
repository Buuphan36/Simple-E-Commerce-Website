import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Figure from "react-bootstrap/Figure";
import myip from "../global";
import { Redirect} from "react-router-dom";

const Order = () => {
  const userId = useSelector((state) => state.userReducer.userId);
  const isLoggedIn = useSelector((state) => state.userReducer.isLoggedIn);
  const [orders, setOrders] = React.useState([]);

  const handleGetUserPost = () => {
    axios
      .get(`http://${myip}:5000/get-my-orders?userId=${userId}`)
      .then((response) => {
        console.log(response.data);
        setOrders(response.data);
      })
      .catch(() => console.log("Failed to fetch items"));
  };

  React.useEffect(() => {
    handleGetUserPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Redirect if user hasnt log in yet
  if (!isLoggedIn) {
    return <Redirect to="/authenticate"/>;
  }
  
  return (
    <div className="center-page">
      <Card.Title>My Orders</Card.Title>
      <Card bg="dark">
        <Card.Body className="card-min-height" style={{ width: "60vw" }}>
          {orders.length === 0 && <center>No order atm :/</center>}
          {orders.map((order, index) => (
            <Card key={index} className="m-2" style={{ color: "#212529" }}>
              <Card.Header>
                <Row>
                  <Col>
                    <h5>ORDER PLACED: {order.date}</h5>
                  </Col>
                  <Col>
                    <h5>TOTAL: ${order.total}</h5>
                  </Col>
                </Row>
              </Card.Header>
              {order.items.map((item) => (
                <Row>
                  <Col>
                    <Figure.Image
                      width={200}
                      height={200}
                      alt="item-picture"
                      src={item.file_name}
                    />
                  </Col>
                  <Col>
                    <h2>{item.name}</h2>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.price}</p>
                  </Col>
                </Row>
              ))}
            </Card>
          ))}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Order;
