import Home from "./components/home.js";
import Signup from "./components/signup.js";
import Signin from "./components/signin.js";
import Housing from "./components/housing.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";

function App() {
  return (
    <div>
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/signup" component={Signup} />
            <Route path="/signin" component={Signin} />
            <Route path="/housing" component={Housing} />
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
