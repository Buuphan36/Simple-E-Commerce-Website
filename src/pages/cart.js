import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Figure from "react-bootstrap/Figure";
import { setCartItems } from "../redux/actions/userActions";
const Cart = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.userReducer.userId);
  const isLoggedIn = useSelector((state) => state.userReducer.isLoggedIn);
  const cartItems = useSelector((state) => state.userReducer.cartItems);

  const handleCheckoutButton = () =>{
    const data = {
      userId: userId,
      date: new Date().toISOString().slice(0, 10),
      items: cartItems,
    };
    axios.post("http://localhost:5000/create-orders", data).then((res) => {
      console.log("add item res: " + JSON.stringify(res));
      dispatch({ type: "USER_RESET_CART_ITEMS" });
      alert("Thank you for shopping with us!")
      window.location.replace("http://localhost:3000/");
    });
  } 

  const handleGetUserCart = () => {
    axios
      .get(`http://localhost:5000/get-my-cart?userId=${userId}`)
      .then((res) => {
        console.log("cart: " + JSON.stringify(res.data));
        dispatch(setCartItems(res.data));
      })
      .catch(() => console.log("Failed to fetch items"));
  };

  const handleRemoveItem = (item) => {
    const data = {
      userId: userId,
      itemId: item.itemId,
    };

    console.log("item: " + JSON.stringify(data));
    axios.post("http://localhost:5000/remove-item", data).then((res) => {
      handleGetUserCart();
      console.log("add item res: " + JSON.stringify(res));
    });
  };

  const handleDecreaseQty = (item) => {
    if (item.quantity === 1) {
      handleRemoveItem(item);
    }
    else {
    const data = {
      userId: userId,
      itemId: item.itemId,
      quantity: item.quantity,
    };
    console.log("dq item: " + JSON.stringify(data));
    axios
      .post("http://localhost:5000/cart-item-decrease-qty", data)
      .then((res) => {
        handleGetUserCart();
        console.log("add item res: " + JSON.stringify(res));
      });
    }
  };

  const handleCalculateTotal = (item) => {
    let total = 0;
    for (let i = 0; i < cartItems.length; i++) {
      total += cartItems[i].price * cartItems[i].quantity;
    }
    return total;
  };

  const handleIncreaseQty = (item) => {
    const data = {
      userId: userId,
      itemId: item.itemId,
      quantity: item.quantity,
    };

    console.log("item: " + JSON.stringify(data));
    axios
      .post("http://localhost:5000/cart-item-increase-qty", data)
      .then((res) => {
        handleGetUserCart();
        console.log("add item res: " + JSON.stringify(res));
      });
  };

  React.useEffect(() => {
    handleGetUserCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isLoggedIn) {
    window.location.replace("http://localhost:3000/authenticate");
  }

  return (
    <div className="center-page">
      <Card.Title>My Cart</Card.Title>
      <Card bg="dark">
        <Card.Body className="card-min-height" style={{ width: "60vw" }}>
          {cartItems.length === 0 && <center>Nothing in cart atm :/</center>}
          {cartItems.length !== 0 && (
            <div>
              {cartItems.map((item, index) => (
                <Card key={index} className="m-2" style={{ color: "#212529" }}>
                  <Row>
                    <Col xs={2} className="m-2">
                      <Figure.Image
                        width={200}
                        height={200}
                        alt="item-picture"
                        src={item.file_name}
                      />
                    </Col>
                    <Col className="m-2">
                      <h2>{item.name}</h2>
                      <div className="mt-3">
                        <h5>
                          Quantity:{" "}
                          <Button
                            variant="outline-dark"
                            onClick={() => handleDecreaseQty(item)}
                          >
                            -
                          </Button>{" "}
                          {item.quantity}{" "}
                          <Button
                            variant="outline-dark"
                            onClick={() => handleIncreaseQty(item)}
                          >
                            +
                          </Button>
                        </h5>
                      </div>
                      <div className="mt-2">
                        <Button
                          variant="outline-dark"
                          onClick={() => handleRemoveItem(item)}
                        >
                          Remove
                        </Button>
                      </div>
                    </Col>
                    <Col xs={2} className="m-2">
                      <h4>${item.price}</h4>
                    </Col>
                  </Row>
                </Card>
              ))}
              <div className="m-3 d-flex flex-row-reverse">
                <h3>Total: ${handleCalculateTotal()}</h3>
              </div>
              <center>
                <Button onClick={handleCheckoutButton()}>Check Out</Button>
              </center>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Cart;
