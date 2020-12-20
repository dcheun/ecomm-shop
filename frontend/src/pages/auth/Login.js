import React, { useState, useEffect } from "react";
import { auth, googleAuthProvider } from "../../firebase";
import "firebase/auth";
import { toast } from "react-toastify";
import { Button } from "antd";
import { MailOutlined, GoogleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createOrUpdateUser } from "../../utils/auth";

const roleBasedRedirect = (res, history) => {
  if (res.data.role === "admin") {
    history.push("/admin/dashboard");
  } else {
    history.push("/user/history");
  }
};

const Login = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user && user.token) {
      history.push("/");
    }
  }, [user, history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      const res = await createOrUpdateUser(idTokenResult.token);

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

      // history.push("/");
      roleBasedRedirect(res, history);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      const result = await auth.signInWithPopup(googleAuthProvider);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      const res = await createOrUpdateUser(idTokenResult.token);

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

      roleBasedRedirect(res, history);
      // history.push("/");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const loginForm = () => {
    return (
      <>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </form>
        <Button
          onClick={handleSubmit}
          type="primary"
          className="mb-4"
          block
          shape="round"
          icon={<MailOutlined />}
          size="large"
          disabled={!email || password.length < 6}
        >
          Login with Email/Password
        </Button>
      </>
    );
  };

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Login</h4>
          )}
          {loginForm()}
          <Button
            onClick={googleLogin}
            type="danger"
            className="mb-3"
            block
            shape="round"
            icon={<GoogleOutlined />}
            size="large"
          >
            Login with Google
          </Button>
          <Link to="/forgot/password" className="float-right text-danger">
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
