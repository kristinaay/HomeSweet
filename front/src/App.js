import Home from "./Home/home.js";
import Signup from "./SignUp/signup.js";
import Signin from "./SignIn/signin.js";
import Housing from "./Housing/housing.js";
import Appts from "./Appts/appts.js";
import Account from "./Account/account.js";
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
