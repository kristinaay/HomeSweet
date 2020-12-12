import React from "react";
import "./account.css";
import Navigation from "../components/navigation.js";

function Account() {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get("error");
  const msg = urlParams.get("msg");

  return (
    <div>
      <Navigation></Navigation>
      <section id="section1" role="main">
        <div className="account">
          <div className="container-fluid d-flex justify-content-center">
            <div className="acccard">
              <div className="card-header" id="my-acc-header">
                <h1 className="sign-heading">My Account</h1>
              </div>
              <div className="card-body" id="my-acc-body">
                <form action="/updateuser" method="POST" className="form-1">
                  <div className="form-group-1">
                    <label htmlFor="username">Current Username</label>
                    <input
                      type="text"
                      id="username-acc"
                      name="username"
                      className="form-control"
                      placeholder="Enter current username"
                    />
                  </div>
                  <div className="form-group-1">
                    <label htmlFor="newusername">New Username</label>
                    <input
                      type="text"
                      id="newusername-acc"
                      name="newusername"
                      className="form-control"
                      placeholder="Enter new username"
                    />
                  </div>
                  <div className="form-group-1">
                    <input
                      type="submit"
                      value="Update Username"
                      className="edit-acc-btn"
                    />
                  </div>
                </form>
                <form action="/updatepass" method="POST" className="form-1">
                  <div className="form-group-1">
                    <label htmlFor="username-1">Username</label>
                    <input
                      type="text"
                      id="username-acc-2"
                      name="username"
                      className="form-control"
                      placeholder="Enter current username"
                    />
                  </div>
                  <div className="form-group-1">
                    <label htmlFor="newpassword">New Password</label>
                    <input
                      type="password"
                      id="newpassword-acc"
                      name="newpassword"
                      className="form-control"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="form-group-1">
                    <input
                      type="submit"
                      value="Update Password"
                      className="edit-acc-btn"
                    />
                  </div>
                </form>

                <form action="/deleteacc" method="POST" className="form-1">
                  <div className="form-group-2">
                    <label htmlFor="confirmusername">
                      I want to delete my account (Please enter username to
                      confirm)
                    </label>
                    <input
                      type="text"
                      id="confirmusername"
                      name="confirmusername"
                      className="form-control"
                      placeholder="Current Username"
                    />
                  </div>

                  <div className="form-group-2">
                    <input
                      type="submit"
                      value="Delete Account"
                      className="edit-acc-btn"
                      id="delete-acc-btn"
                    />
                  </div>
                </form>
                <div className="error">
                  {error ? <div className="danger">{error}</div> : ""}
                  {msg ? `${msg}` : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer>Image by @bradencollum on Unsplash.</footer>
    </div>
  );
}

export default Account;
