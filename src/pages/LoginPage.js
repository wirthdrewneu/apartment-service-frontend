import React, { useState, useContext, useRef } from 'react';
import { Redirect, Link, useHistory } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import LoggedIn from '../components/LoginContext';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { loggedIn, setLoggedInHelper } = useContext(LoggedIn);
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const bodyObj = {
      email: email,
      password: password,
    };

    const formBody = Object.keys(bodyObj)
      .map(
        (key) =>
          encodeURIComponent(key) + '=' + encodeURIComponent(bodyObj[key])
      )
      .join('&');

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: formBody,
      });

      const responseJson = await response.json();

      if (response.status === 200) {
        setLoggedInHelper(true, responseJson.username);
        history.goBack();
      } else if (response.status === 401) {
        setLoggedInHelper(false, null);
        setErrorMessage(responseJson.message);
        emailRef.current.value = '';
        passwordRef.current.value = '';
      } else {
        throw 'Login Error.';
      }
    } catch (err) {
      alert(`${err} Please contact the developer.`);
    }
  };

  if (loggedIn.loggedIn) {
    return <Redirect to="/"></Redirect>;
  } else {
    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-4 p-2 m-5">
            <Form
              onSubmit={handleSubmit}
              className="border p-5 shadow rounded bg-light login-form"
            >
              <h4 className="mb-4 text-center">Sign In</h4>
              <p>{errorMessage}</p>
              <Form.Group controlId="login-form-email-group">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  ref={emailRef}
                  onChange={(evt) => setEmail(evt.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="login-form-pwd-group">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  ref={passwordRef}
                  onChange={(evt) => setPassword(evt.target.value)}
                />
              </Form.Group>

              <p className="p-4 text-center">
                Not a member?
                <Link to="/register" replace>
                  Register
                </Link>
              </p>

              <Button
                type="submit"
                className="btn btn-secondary my-4 btn-block"
              >
                Sign In
              </Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
};

export default LoginPage;
