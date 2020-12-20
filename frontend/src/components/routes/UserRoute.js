import React from "react";
import { Route } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";

const UserRoute = ({ component: Component, ...rest }) => {
  const user = useSelector((state) => state.user);

  return user && user.token ? (
    <Route {...rest} render={(props) => <Component {...props} />} />
  ) : (
    <LoadingToRedirect />
  );
};

export default UserRoute;
