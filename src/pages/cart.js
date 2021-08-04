import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Figure from "react-bootstrap/Figure";
import { setCartItems } from "../redux/actions/userActions";
import { Redirect} from "react-router-dom";
import myip from "../global";

const Cart = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.userReducer.userId);
  const isLoggedIn = useSelector((state) => state.userReducer.isLoggedIn);
  const cartItems = useSelector((state) => state.userReducer.cartItems);
  const [total, setTotal] = React.useState(0);

  //Makes api post request to store user orders
  const handleCheckoutButton = () => {
    const data = {
      userId: userId,
      date: new Date().toISOString().slice(0, 10),
      total: total,
      items: cartItems,
    };
    axios.post(`http://${myip}:5000/create-orders`, data).then((res) => {
      dispatch(setCartItems(res.data));
      alert("Thank you for shopping with us!");
      window.location.replace(`http://${myip}:3000/`);
    });
  };

  //Makes api get request to get user cart
  const handleGetUserCart = () => {
    axios
      .get(`http://${myip}:5000/get-my-cart?userId=${userId}`)
      .then((res) => {
        dispatch(setCartItems(res.data));
      })
      .catch(() => console.log("Failed to fetch items"));
  };

  //Makes api post request to remove an item in the user cart
  const handleRemoveItem = (item) => {
    const data = {
      userId: userId,
      itemId: item.itemId,
    };
    console.log("item: " + JSON.stringify(data));
    axios.post(`http://${myip}:5000/remove-item`, data).then((res) => {
      dispatch(setCartItems(res.data));
      handleCalculateTotal(res.data);
    });
  };

   //Makes api post request to decrease qty of an item in the user cart
  const handleDecreaseQty = (item) => {
    //Remove the item from the cart instead if the current qty is 1 
    if (item.quantity === 1) {
      handleRemoveItem(item);
    } else {
      const data = {
        userId: userId,
        itemId: item.itemId,
        quantity: item.quantity,
      };
      axios
        .post(`http://${myip}:5000/cart-item-decrease-qty`, data)
        .then((res) => {
          dispatch(setCartItems(res.data));
          handleCalculateTotal(res.data);
        });
    }
  };

  //Makes api post request to increase qty of an item in the user cart
  const handleIncreaseQty = (item) => {
    const data = {
      userId: userId,
      itemId: item.itemId,
      quantity: item.quantity,
    };
    axios
      .post(`http://${myip}:5000/cart-item-increase-qty`, data)
      .then((res) => {
        dispatch(setCartItems(res.data));
        handleCalculateTotal(res.data);
      });
  };

  //Calculates the total price in the user cart
  const handleCalculateTotal = (items) => {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      total += items[i].price * items[i].quantity;
    }
    setTotal(total);
  };

  React.useEffect(() => {
    handleGetUserCart();
    handleCalculateTotal(cartItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Redirect if user hasnt log in yet
  if (!isLoggedIn) {
    return <Redirect to="/authenticate"/>;
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
                <h3>Total: ${total}</h3>
              </div>
              <center>
                <Button onClick={handleCheckoutButton}>Check Out</Button>
              </center>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Cart;
