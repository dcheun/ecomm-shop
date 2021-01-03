import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "react-redux-loading";
import { toast } from "react-toastify";

import ProductCardInCheckout from "../components/cards/ProductCardInCheckout";
import { userCart } from "../utils/user";

const Cart = ({ history }) => {
  const { user, cart } = useSelector((state) => state);
  const dispatch = useDispatch();

  const getTotal = () => {
    return cart.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const saveOrderToDb = async () => {
    dispatch(showLoading());
    try {
      const res = await userCart(cart, user.token);
      console.log("Cart Post Res=", res);
      if (res.data.ok) {
        history.push("/checkout");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error saving order");
    } finally {
      dispatch(hideLoading());
    }
    history.push("/checkout");
  };

  const showCartItems = () => {
    return (
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th scope="col">Image</th>
            <th scope="col">Title</th>
            <th scope="col">Price</th>
            <th scope="col">Brand</th>
            <th scope="col">Color</th>
            <th scope="col">Count</th>
            <th scope="col">Shipping</th>
            <th scope="col">Remove</th>
          </tr>
        </thead>
        {cart.map((p) => (
          <ProductCardInCheckout key={p._id} p={p} />
        ))}
      </table>
    );
  };

  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col-md-8">
          <h4>Cart / {cart.length} Product</h4>
          {!cart.length ? (
            <h4>
              No products in cart. <Link to="/shop">Continue Shopping.</Link>
            </h4>
          ) : (
            showCartItems()
          )}
        </div>
        <div className="col-md-4">
          <h4>Order Summary</h4>
          <hr />
          <p>Products</p>
          {cart.map((c, i) => (
            <div key={i}>
              <p>
                {c.title} x {c.count} = ${c.price * c.count}
              </p>
            </div>
          ))}
          <hr />
          Total: <b>${getTotal()}</b>
          <hr />
          {user ? (
            <button
              onClick={saveOrderToDb}
              disabled={!cart.length}
              className="btn btn-sm btn-primary mt-2"
            >
              Proceed to Checkout
            </button>
          ) : (
            <button className="btn btn-sm btn-primary mt-2">
              <Link
                to={{
                  pathname: "/login",
                  state: { from: "cart" },
                }}
              >
                Login to Checkout
              </Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
