import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "react-redux-loading";
import { toast } from "react-toastify";
import { Card } from "antd";
import { DollarOutlined, CheckOutlined } from "@ant-design/icons";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { createPaymentIntent } from "../utils/stripe";
import { createOrder, emptyUserCart } from "../utils/user";
import sample from "../images/sample.jpg";

const StripeCheckout = ({ history }) => {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  const [cartTotal, setCartTotal] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [payable, setPayable] = useState(0);

  const dispatch = useDispatch();
  const { user, coupon } = useSelector((state) => state);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    dispatch(showLoading());
    try {
      const { data } = await createPaymentIntent(user.token, coupon);
      console.log("createPaymentIntent=", data);
      setClientSecret(data.clientSecret);
      // Additional response received on successful payment.
      setCartTotal(data.cartTotal);
      setTotalAfterDiscount(data.totalAfterDiscount);
      setPayable(data.payable);
    } catch (error) {
      console.log(error);
      toast.error("Error loading payment");
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: e.target.name.value,
          },
        },
      });
      if (payload.error) {
        setError(`Payment failed ${payload.error.message}`);
      } else {
        // Get result after successful payment.
        // Create order and save in db for admin to process.
        const res = await createOrder(user.token, payload);
        if (res.data.ok) {
          // Empty cart from local storage.
          // NOTE: typeof returns a string
          // https://stackoverflow.com/questions/5663277/what-is-the-difference-between-undefined-and-undefined
          if (typeof window !== "undefined") {
            localStorage.removeItem("cart");
          }
          // Empty cart from redux.
          dispatch({
            type: "ADD_TO_CART",
            payload: [],
          });
          // Reset coupon to false.
          dispatch({
            type: "COUPON_APPLIED",
            payload: false,
          });
          // Empty cart from database.
          const { data } = await emptyUserCart(user.token);
        }
        // Empty user cart from redux store and local storage.
        console.log(JSON.stringify(payload, null, 4));
        setError(null);
        setSucceeded(true);
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleChange = async (e) => {
    // Listen for changes in the card element and display
    // any errors as the customer types their card details
    setDisabled(e.empty); // Disable button if there are errors
    setError(e.error ? e.error.message : ""); // Show error message
  };

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <>
      {!succeeded && (
        <div>
          {coupon && totalAfterDiscount !== undefined ? (
            <p className="alert alert-success">{`Total after discount: $${totalAfterDiscount}`}</p>
          ) : (
            <p className="alert alert-danger">No coupon applied</p>
          )}
        </div>
      )}
      <div className="text-center pb-5">
        <Card
          cover={
            <img
              src={sample}
              style={{
                height: "200px",
                objectFit: "cover",
                marginBottom: "-50px",
              }}
            />
          }
          actions={[
            <>
              <DollarOutlined className="text-info" />
              <br />
              Total: ${cartTotal}
            </>,
            <>
              <CheckOutlined className="text-info" />
              <br />
              Total payable: ${(payable / 100).toFixed(2)}
            </>,
          ]}
        />
      </div>

      <form id="payment-form" onSubmit={handleSubmit} className="stripe-form">
        <CardElement
          id="card-element"
          options={cardStyle}
          onChange={handleChange}
        />
        <button
          className="stripe-button"
          disabled={processing || disabled || succeeded}
        >
          <span id="button-text">
            {processing ? <div className="spinner" id="spinner"></div> : "Pay"}
          </span>
        </button>
        <br />
        {error && (
          <div className="card-error" role="alert">
            {error}
          </div>
        )}
        <p className={succeeded ? "result-message" : "result-message hidden"}>
          Payment Successful. <Link to="/user/history">Purchase history.</Link>
        </p>
      </form>
    </>
  );
};

export default StripeCheckout;
