import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Figure from "react-bootstrap/Figure";
import ListGroup from "react-bootstrap/ListGroup";
import myip from "../global";
import { Redirect} from "react-router-dom";

const Post = () => {
  const userId = useSelector((state) => state.userReducer.userId);
  const isLoggedIn = useSelector((state) => state.userReducer.isLoggedIn);
  const [posts, setPosts] = React.useState([]);

  //Makes api get request to get all user posts  
  const handleGetUserPost = () => {
    axios
      .get(`http://${myip}:5000/get-my-post?userId=${userId}`)
      .then((response) => {
        console.log(response.data);
        setPosts(response.data);
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
      <Card.Title>My Post</Card.Title>
      <Card bg="dark">
        <Card.Body className="card-min-height" style={{width: "60vw"}}>
          {posts.length===0 && (
            <center>
               No Post atm :/
            </center>
          )}
          {posts.map((item, index) => (
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
};

export default Post;
