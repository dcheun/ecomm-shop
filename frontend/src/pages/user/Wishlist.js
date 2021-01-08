import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "react-redux-loading";
import { toast } from "react-toastify";
import { DeleteOutlined } from "@ant-design/icons";

import UserNav from "../../components/nav/UserNav";
import { getWishlist, removeFromWishlist } from "../../utils/user";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    dispatch(showLoading());
    try {
      const { data } = await getWishlist(user.token);
      setWishlist(data.wishlist);
    } catch (error) {
      console.log(error);
      toast.error("Error loading data");
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleRemove = async (productId) => {
    dispatch(showLoading());
    try {
      const { data } = await removeFromWishlist(user.token, productId);
      console.log(data);
      if (data.ok) {
        loadData();
      }
    } catch (error) {
      console.log(error);
      toast.error("Error removing item from wishlist");
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
          <h4>Wishlist</h4>
          {wishlist.map((p) => (
            <div key={p._id} className="alert alert-secondary">
              <Link to={`/product/${p.slug}`}>{p.title}</Link>
              <span
                className="btn btn-sm float-right"
                onClick={() => handleRemove(p._id)}
              >
                <DeleteOutlined className="text-danger" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
