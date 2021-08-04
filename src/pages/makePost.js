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

const MakePost = () => {
  const dispatch = useDispatch();
  const [file, setFile] = React.useState("");
  const [previewFile, setPreviewFile] = React.useState("");
  const [file_name, setFileName] = React.useState("");
  const isLoggedIn = useSelector((state) => state.userReducer.isLoggedIn);
  const creator_id = useSelector((state) => state.userReducer.userId);
  const creator_name = useSelector((state) => state.userReducer.username);
  const name = useSelector((state) => state.postReducer.name);
  const price = useSelector((state) => state.postReducer.price);
  const description = useSelector((state) => state.postReducer.description);

  //Makes api post request to store user post
  const handlePosting = async (event) => {
    event.preventDefault();
    if (name && price && description) {
        const data = {
          creator_id: creator_id,
          creator_name: creator_name,
          name: name,
          price: price,
          description: description,
          file_name: file_name,
        };
        axios
          .post(`http://${myip}:5000/create-post`, data)
          .then((res) => {
            if(res.data.success){
              handleUploadImage();
              alert(res.data.error);
              window.location.replace(`http://${myip}:3000/my-posts`);
            }
          })
          .catch(() => console.log("Failed to submit!"));
    } else {
      alert("One of the fields is empty!");
    }
  };
  //Makes api post request to save image/file to database  
  const handleUploadImage = () => {
    const formData = new FormData();
    formData.append("file", file);
    axios.post(`http://${myip}:5000/upload-image`, formData).then((res) => {
      console.log("Image is uploaded");
    });
  };

  //Sets files appropriately + create preview image
  const fileUploaded = (event) => {
    setPreviewFile(URL.createObjectURL(event.target.files[0]));
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  //Redirect if user hasnt log in yet
  if (!isLoggedIn) {
    return <Redirect to="/authenticate"/>;
  }

  return (
    <Form className="center-page" style={{ color: "#fff" }}>
      <Card.Title>Create Post</Card.Title>
      <Card className="p-3" bg="dark" style={{width: "60vw"}}>
        <Card.Body>
          <Row>
            <Col>
              <Form.Group controlId="formFile" className="mb-2">
                <Form.Label>Upload an image for your product!</Form.Label>
                {previewFile && (
                  <Figure>
                    <Figure.Image
                      width={300}
                      height={300}
                      alt="item-picture"
                      src={previewFile}
                    />
                  </Figure>
                )}

                {!previewFile && (
                  <Figure>
                    <Figure.Image
                      width={300}
                      height={300}
                      alt="item-picture"
                      src="default-item.png"
                    />
                  </Figure>
                )}

                <div>
                  <Form.Control
                    type="file"
                    onChange={fileUploaded}
                    className="mt-3"
                  />
                </div>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Enter a title..."
                  onChange={(e) =>
                    dispatch({ type: "SET_NAME", name: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>

                <Form.Control
                  type="number"
                  placeholder="Enter amount..."
                  onChange={(e) =>
                    dispatch({ type: "SET_PRICE", price: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={8}
                  placeholder="Enter description..."
                  onChange={(e) =>
                    dispatch({ type: "SET_DESCRIPTION", description: e.target.value })
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <center>
            <Button variant="outline-light" onClick={handlePosting}>
              Submit
            </Button>
          </center>
        </Card.Body>
      </Card>
    </Form>
  );
};

export default MakePost;
