import React, { useEffect, useState } from "react";
import { showLoading, hideLoading } from "react-redux-loading";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { getProduct } from "../utils/product";
import SingleProduct from "../components/cards/SingleProduct";

const Product = ({ match }) => {
  const [product, setProduct] = useState({});

  const { slug } = match.params;

  const dispatch = useDispatch();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    dispatch(showLoading());
    try {
      const res = await getProduct(slug);
      setProduct(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Error loading product data");
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div className="container">
      <div className="row pt-4">
        <SingleProduct product={product} />
      </div>
      <div className="row">
        <div className="col text-center pt-5 pb-5">
          <hr />
          <h4>Related Products</h4>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default Product;
