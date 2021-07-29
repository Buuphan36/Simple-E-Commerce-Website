import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Figure from "react-bootstrap/Figure";

const Order = () =>{
    const userId = useSelector((state) => state.userReducer.userId);
    const isLoggedIn = useSelector((state) => state.userReducer.isLoggedIn);
    const [orders, setOrders] = React.useState([]);
  
    const handleGetUserPost = () => {
      axios
        .get(`http://localhost:5000/get-my-orders?userId=${userId}`)
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
    if (!isLoggedIn) {
      window.location.replace("http://localhost:3000/");
    }
    return (
      <div className="center-page">
        <Card.Title>My Orders</Card.Title>
        <Card bg="dark">
          <Card.Body className="card-min-height" style={{width: "60vw"}}>
            {orders.length===0 && (
              <center>
                 No order atm :/
              </center>
            )}
            {orders.map((item, index) => (
              <Card key={index} className="m-2" >
                <Row>
                  <Col>
                    <Figure>
                      <Figure.Image
                        width={200}
                        height={200}
                        alt="item-picture"
                        src={item.file_name}
                      />
                    </Figure>
                  </Col>
                  <Col style={{color: "#212529"}}>
                    <h2>{item.name}</h2>
                    <p>{item.description}</p>
                    <p>${item.price}</p>
                  </Col>
                </Row>
              </Card>
            ))}
          </Card.Body>
        </Card>
      </div>
    );
}

export default Order;