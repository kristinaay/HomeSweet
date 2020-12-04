import Home from "./components/home.js";
import Signup from "./components/signup.js";
import Signin from "./components/signin.js";
import Housing from "./components/housing.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getPosts = async () => {
      console.log("getting posts 1");
      try {
        setLoading(true);
        const _posts = await fetch("/getposts").then((res) => res.json());
        setPosts(_posts);
        console.log("done");
        setLoading(false);
      } catch (err) {
        console.log("error");
      }
    };
    getPosts();
  }, []);

  return (
    <div>
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/signup" component={Signup} />
            <Route path="/signin" component={Signin} />
            <Route
              path="/housing"
              render={(props) => (
                <Housing {...props} posts={posts} loading={loading} />
              )}
            />
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
