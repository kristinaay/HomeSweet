import Home from "./Home/home.js";
import Signup from "./SignUp/signup.js";
import Signin from "./SignIn/signin.js";
import Housing from "./Housing/housing.js";
import Appts from "./Appts/appts.js";
import Account from "./Account/account.js";
import Saved from "./Saved/saved.js";
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
            <Route path="/saved" component={Saved} />
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;


// Overall review of the react frontend:
// Hi Kristina, you website looks perfect! The background and color are selected harmonized and the overall design is very clear. All components are 
// working together in a good manner! Here I only got few suggestions about backend part as noted in other pull request. And If there is no saved posts, 
// A reminding indicationg user has no saved post will be better. And for the My Appointment page, it will be better to have more spacing between forms and more 
// margins to the screen. And Remember to change the website title as it is right now React App lol
