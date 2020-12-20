import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";
import { currentAdmin } from "../../utils/auth";

const AdminRoute = ({ component: Component, ...rest }) => {
  const [ok, setOk] = useState(false);

  const user = useSelector((state) => state.user);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (user && user.token) {
        try {
          const res = await currentAdmin(user.token);
          console.log("CURRENT ADMIN RES", res);
          setOk(true);
        } catch (error) {
          console.log("ADMIN ROUTE ERROR", error);
          setOk(false);
        }
      }
    };
    verifyAdmin();
  }, [user]);

  return ok ? (
    <Route {...rest} render={(props) => <Component {...props} />} />
  ) : (
    <LoadingToRedirect />
  );
};

export default AdminRoute;
