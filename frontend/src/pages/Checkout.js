import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "react-redux-loading";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import {
  getUserCart,
  emptyUserCart,
  saveUserAddress,
  applyCoupon,
} from "../utils/user";

const Checkout = ({ history }) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [coupon, setCoupon] = useState("");
  // Discount price
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    dispatch(showLoading());
    try {
      const { data } = await getUserCart(user.token);
      setProducts(data.products);
      setTotal(data.cartTotal);
    } catch (error) {
      console.log(error);
      toast.error("Error loading data");
    } finally {
      dispatch(hideLoading());
    }
  };

  const saveAddressToDb = async (value) => {
    dispatch(showLoading());
    try {
      const res = await saveUserAddress(user.token, address);
      if (res.data.ok) {
        setAddressSaved(true);
        toast.success("Address saved");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error saving address");
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleEmptyCart = async () => {
    // remove from local storage
    if (typeof window !== undefined) {
      localStorage.removeItem("cart");
    }
    // remove from redux
    dispatch({
      type: "ADD_TO_CART",
      payload: [],
    });
    // remove from backend
    const res = await emptyUserCart(user.token);
    setProducts([]);
    setTotal(0);
    setTotalAfterDiscount(0);
    setCoupon("");
    toast.success("Cart is empty. Continue shopping.");
  };

  const showAddress = () => {
    return (
      <>
        <ReactQuill theme="snow" value={address} onChange={setAddress} />
        <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
          Save
        </button>
      </>
    );
  };

  const showProductSummary = () => {
    return products.map((p, i) => (
      <div key={i}>
        <p>
          {p.product.title} ({p.color}) x {p.count} ={" "}
          {p.product.price * p.count}
        </p>
      </div>
    ));
  };

  const applyDiscountCoupon = async () => {
    dispatch(showLoading());
    try {
      const { data } = await applyCoupon(user.token, coupon);
      setTotalAfterDiscount(data.totalAfterDiscount);
      // Update redux coupon applied true/false
      dispatch({
        type: "COUPON_APPLIED",
        payload: true,
      });
      toast.success("Coupon applied");
    } catch (error) {
      console.log(error);
      setDiscountError(error.response.data.message);
      // Update redux coupon applied true/false
      dispatch({
        type: "COUPON_APPLIED",
        payload: false,
      });
      toast.error("Error applying coupon");
    } finally {
      dispatch(hideLoading());
    }
  };

  const showApplyCoupon = () => {
    return (
      <>
        <input
          type="text"
          onChange={(e) => {
            setCoupon(e.target.value);
            setDiscountError("");
          }}
          className="form-control"
          value={coupon}
        />
        <button onClick={applyDiscountCoupon} className="btn btn-primary mt-2">
          Apply
        </button>
      </>
    );
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <br />
        <br />
        {showAddress()}
        <hr />
        <h4>Got Coupon?</h4>
        <br />
        {showApplyCoupon()}
        <br />
        {discountError && <p className="bg-danger p-2">{discountError}</p>}
      </div>
      <div className="col-md-6">
        <h4>Order Summary</h4>
        <hr />
        <p>Products {products.length} </p>
        <hr />
        {showProductSummary()}
        <hr />
        <p>Cart Total: ${total}</p>

        {totalAfterDiscount > 0 && (
          <p className="bg-success p-2">
            Discount Applied: Total Payable: ${totalAfterDiscount}
          </p>
        )}

        <div className="row">
          <div className="col-md-6">
            <button
              className="btn btn-primary"
              disabled={!addressSaved || !products.length}
              onClick={() => history.push("/payment")}
            >
              Place Order
            </button>
          </div>
          <div className="col-md-6">
            <button
              disabled={!products.length}
              onClick={handleEmptyCart}
              className="btn btn-primary"
            >
              Empty Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
