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

const Home = () => {
  const dispatch = useDispatch();
  const [posts, setPosts] = React.useState([]);
  const userId = useSelector((state) => state.userReducer.userId);
  const cartItems = useSelector((state) => state.userReducer.cartItems);

  const checkElement = (element) => {
    console.log("element: " + JSON.stringify(element));
    for (let i = 0; i < cartItems.length; i++) {
      console.log(`${i}: ${JSON.stringify(cartItems[i].itemId)}`);

      if (cartItems[i].itemId === element) {
        return i;
      }
    }
    return -1;
  };
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
      //console.log("cart: " + JSON.stringify(cartItems));
      console.log("index: " + itemIndex);
      if (itemIndex !== -1) {
        const data2 = {
          userId: userId,
          itemId: item._id,
          quantity: cartItems[itemIndex].quantity,
        };
        console.log("data2: " + JSON.stringify(data2));
        axios
          .post("http://localhost:5000/cart-item-increase-qty", data2)
          .then((res) => {
            dispatch(setCartItems(res.data));
            console.log("add item res: " + JSON.stringify(res));
          });
      } else {
        axios.post("http://localhost:5000/add-item", data).then((res) => {
          dispatch(setCartItems(res.data));
          console.log("add item res: " + JSON.stringify(res.data));
        });
      }
    } else {
      window.location.replace("http://localhost:3000/authenticate");
    }
  };

  const handleGetUserPost = () => {
    axios
      .get("http://localhost:5000/get-all-items")
      .then((res) => {
        console.log(res.data);
        setPosts(res.data);
      })
      .catch(() => console.log("Failed to fetch items"));
  };

  React.useEffect(() => {
    handleGetUserPost();
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
                    <Button onClick={() => handleAddButton(item)}>Add</Button>
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
