import React from "react";
import { Link } from "react-router-dom";
import "./signin.css";

function SignIn() {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get("error");
  return (
    <div>
      <div className="navbar" role="navigation">
        <Link to="/" className="logo-container">
          <h1 className="logo-header">HOMESWEET</h1>
        </Link>
        <Link to="/signin" className="nav-links">
          Sign In
        </Link>
        <Link to="/signup" className="nav-links">
          Sign Up
        </Link>
      </div>
      <section id="section1" role="main">
        <div className="SignIn">
          <div className="container-fluid d-flex justify-content-center">
            <div className="signcard">
              <div className="card-header" id="header-signin">
                <h1 className="sign-heading" id="heading-signin">
                  Welcome to HomeSweet!
                </h1>
                <div className="subtitle2">Sign in here.</div>
              </div>
              <div className="card-body">
                <form action="/signin1" method="POST">
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="form-control"
                      placeholder="Enter username"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      placeholder="Enter password"
                    />
                  </div>
                  {error ? <div className="danger">{error}</div> : ""}
                  <div className="form-group">
                    <input
                      type="submit"
                      className="btn btn-dark"
                      style={{ marginTop: "10px" }}
                      value="Sign In"
                      id="signinbtn"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer>Image by @bradencollum on Unsplash.</footer>
    </div>
  );
}

export default SignIn;
