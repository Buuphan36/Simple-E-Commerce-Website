import "./App.css";
import Home from "./pages/home";
import Navbar from "./components/navbar";
import Authenticate from "./pages/authenticate";
import Settings from "./pages/settings";
import Order from "./pages/orders";
import Post from "./pages/posts";
import Cart from "./pages/cart"
import MakePost from "./pages/makePost";
import { Switch, Route } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Navbar/>
      <Switch>
        <Route exact path="/authenticate">
          <Authenticate />
        </Route>
        <Route exact path="/my-account">
          <Settings/>
        </Route>
        <Route exact path="/my-orders">
          <Order/>
        </Route>
        <Route exact path="/my-posts">
          <Post/>
        </Route>
        <Route exact path="/my-cart">
          <Cart/>
        </Route>
        <Route exact path="/make-post">
          <MakePost/>
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
