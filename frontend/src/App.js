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
import History from "./pages/user/History";
import Password from "./pages/user/Password";
import Wishlist from "./pages/user/Wishlist";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserRoute from "./components/routes/UserRoute";
import AdminRoute from "./components/routes/AdminRoute";
import { currentUser } from "./utils/auth";

const App = () => {
  const dispatch = useDispatch();

  // Check firebase auth state.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          const idTokenResult = await user.getIdTokenResult();

          const res = await currentUser(idTokenResult.token);

          dispatch({
            type: "LOGGED_IN_USER",
            payload: {
              name: res.data.name,
              email: res.data.email,
              token: idTokenResult.token,
              role: res.data.role,
              _id: res.data._id,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
    // Clean up
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <ToastContainer />
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register/complete" component={RegisterComplete} />
        <Route path="/register" component={Register} exact />
        <Route path="/forgot/password" component={ForgotPassword} />
        <UserRoute path="/user/history" component={History} />
        <UserRoute path="/user/password" component={Password} />
        <UserRoute path="/user/wishlist" component={Wishlist} />
        <AdminRoute path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/" component={Home} exact />
      </Switch>
    </Router>
  );
};

export default App;
