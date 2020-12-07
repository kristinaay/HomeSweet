import Home from "./components/home.js";
import Signup from "./components/signup.js";
import Signin from "./components/signin.js";
import Housing from "./components/housing.js";
import Appts from "./components/appts.js";
import Account from "./components/account.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

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
            <Route path="/appointments" component={Appts} />
            <Route path="/account" component={Account} />
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
