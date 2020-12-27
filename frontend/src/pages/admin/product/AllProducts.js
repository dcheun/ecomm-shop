import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "react-redux-loading";
import { toast } from "react-toastify";

import AdminNav from "../../../components/nav/AdminNav";
import { getProductByCount } from "../../../utils/product";
import AdminProductCard from "../../../components/cards/AdminProductCard";
import { removeProduct } from "../../../utils/product";

const AllProducts = () => {
  const [products, setProducts] = useState([]);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    handleInitialData();
  }, []);

  const handleInitialData = async () => {
    dispatch(showLoading());
    try {
      const res = await getProductByCount(100);
      setProducts(res.data);
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleRemove = async (slug) => {
    if (!window.confirm("Delete?")) {
      return;
    }

    dispatch(showLoading());
    try {
      const res = await removeProduct(slug, user.token);
      toast.error(`${res.data.title} is removed`);
      console.log(res);
      handleInitialData();
    } catch (error) {
      console.log(error);
      toast.error("Error removing product");
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          <h4>All Products</h4>
          <div className="row">
            {products.map((p) => (
              <div key={p._id} className="col-md-4 pb-3">
                <AdminProductCard product={p} handleRemove={handleRemove} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
