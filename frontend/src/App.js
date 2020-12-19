import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";

import { auth } from "./firebase";
import Header from "./components/nav/Header";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import RegisterComplete from "./pages/auth/RegisterComplete";
import ForgotPassword from "./pages/auth/ForgotPassword";

const App = () => {
  const dispatch = useDispatch();

  // Check firebase auth state.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        dispatch({
          type: "LOGGED_IN_USER",
          payload: {
            email: user.email,
            token: idTokenResult.token,
          },
        });
      }
    });
    // Clean up
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Header />
      <ToastContainer />
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register/complete" component={RegisterComplete} />
        <Route path="/register" component={Register} exact />
        <Route path="/forgot/password" component={ForgotPassword} />
        <Route path="/" component={Home} exact />
      </Switch>
    </Router>
  );
};

export default App;
