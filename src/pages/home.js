import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Figure from "react-bootstrap/Figure";
import { setCartItems } from "../redux/actions/userActions";
import myip from "../global";

const Home = () => {
  const dispatch = useDispatch();
  const [posts, setPosts] = React.useState([]);
  const userId = useSelector((state) => state.userReducer.userId);
  const cartItems = useSelector((state) => state.userReducer.cartItems);

  //Makes api post request to decrease qty of an item in the user cart
  const handleGetUserCart = () => {
    axios
      .get(`http://${myip}:5000/get-my-cart?userId=${userId}`)
      .then((res) => {
        dispatch(setCartItems(res.data));
      })
      .catch(() => console.log("Failed to fetch items"));
  };

  //Returns the index of selected item if it is in the user cart
  //Returns -1 if item is not found
  const checkElement = (element) => {
    for (let i = 0; i < cartItems.length; i++) {
      if (cartItems[i].itemId === element) {
        return i;
      }
    }
    return -1;
  };

  //Adds item to thr use cart
  const handleAddButton = (item) => {
    if (userId) {
      const data = {
        userId: userId,
        itemId: item._id,
        name: item.name,
        price: item.price,
        quantity: 1,
        description: item.description,
        file_name: item.file_name,
        creator_name: item.creator_name,
      };
      let itemIndex = checkElement(item._id);
      if (itemIndex !== -1) {
        const data2 = {
          userId: userId,
          itemId: item._id,
          quantity: cartItems[itemIndex].quantity,
        };
        axios
          .post(`http://${myip}:5000/cart-item-increase-qty`, data2)
          .then((res) => {
            dispatch(setCartItems(res.data));
          });
      } else {
        axios.post(`http://${myip}:5000/add-item`, data).then((res) => {
          dispatch(setCartItems(res.data));
        });
      }
    } else {
      window.location.replace(`http://${myip}:3000/authenticate`);
    }
  };

  //Makes api get request to update user cart
  const handleGetUserPost = () => {
    axios
      .get(`http://${myip}:5000/get-all-items`)
      .then((res) => {
        console.log(res.data);
        setPosts(res.data);
      })
      .catch(() => console.log("Failed to fetch items"));
  };

  React.useEffect(() => {
    handleGetUserPost();
    handleGetUserCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="center-page">
      <Card.Title>Shop</Card.Title>
      <Card bg="dark">
        <Card.Body className="card-min-height" style={{ width: "60vw" }}>
          {posts.length === 0 && <center>No Post atm :/</center>}
          {posts.map((item, index) => (
            <Card key={index} className="m-2">
              <Row>
                <Col>
                  <Figure.Image
                    width={400}
                    height={400}
                    alt="item-picture"
                    src={item.file_name}
                    className="m-2"
                  />
                </Col>
                <Col style={{ color: "#212529" }}>
                  <div className="m-2">
                    <h2>{item.name}</h2>
                    <p>${item.price}</p>
                    <p>{item.description}</p>
                    <p>Seller: {item.creator_name}</p>
                    <Button variant="dark" onClick={() => handleAddButton(item)}>Add to Cart</Button>
                  </div>
                </Col>
              </Row>
            </Card>
          ))}
        </Card.Body>
      </Card>
    </div>
  );
};
export default Home;
