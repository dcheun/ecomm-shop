import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "react-redux-loading";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { getUserCart, emptyUserCart, saveUserAddress } from "../utils/user";

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);

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
    toast.success("Cart is empty. Continue shopping.");
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <br />
        <br />
        <ReactQuill theme="snow" value={address} onChange={setAddress} />
        <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
          Save
        </button>
        <hr />
        <h4>Got Coupon?</h4>
        <br />
        coupon input apply button
      </div>
      <div className="col-md-6">
        <h4>Order Summary</h4>
        <hr />
        <p>Products {products.length} </p>
        <hr />
        {products.map((p, i) => (
          <div key={i}>
            <p>
              {p.product.title} ({p.color}) x {p.count} ={" "}
              {p.product.price * p.count}
            </p>
          </div>
        ))}
        <hr />
        <p>Cart Total: ${total}</p>

        <div className="row">
          <div className="col-md-6">
            <button
              className="btn btn-primary"
              disabled={!addressSaved || !products.length}
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
