import React, { useEffect, useState } from "react";
import { showLoading, hideLoading } from "react-redux-loading";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { getProduct, productStar, getRelated } from "../utils/product";
import SingleProduct from "../components/cards/SingleProduct";
import ProductCard from "../components/cards/ProductCard";

const Product = ({ match }) => {
  const [product, setProduct] = useState({});
  const [star, setStar] = useState(0);
  const [related, setRelated] = useState([]);

  const user = useSelector((state) => state.user);
  const { slug } = match.params;

  const dispatch = useDispatch();

  useEffect(() => {
    loadInitialData();
  }, [slug]);

  const loadInitialData = async () => {
    dispatch(showLoading());
    try {
      const { data: product } = await getProduct(slug);
      setProduct(product);
      if (product.ratings && user) {
        const existingRatingObject = product.ratings.find(
          (rating) => rating.postedBy.toString() === user._id.toString()
        );
        existingRatingObject && setStar(existingRatingObject.star);
      }
      const { data: related } = await getRelated(product._id);
      setRelated(related);
    } catch (error) {
      console.log(error);
      toast.error("Error loading product data");
    } finally {
      dispatch(hideLoading());
    }
  };

  const onStarClick = async (newRating, name) => {
    setStar(newRating);
    dispatch(showLoading());
    try {
      await productStar(name, newRating, user.token);
      loadInitialData();
    } catch (error) {
      console.log(error);
      toast.error("Error setting rating");
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div className="container">
      <div className="row pt-4">
        <SingleProduct
          product={product}
          onStarClick={onStarClick}
          star={star}
        />
      </div>
      <div className="row">
        <div className="col text-center pt-5 pb-5">
          <hr />
          <h4>Related Products</h4>
          <hr />
        </div>
      </div>
      <div className="row pb-5">
        {related?.length ?? 0 > 0 ? (
          related.map((i) => {
            return (
              <div key={i._id} className="col-md-4">
                <ProductCard product={i} />
              </div>
            );
          })
        ) : (
          <div className="text-center col">No products found</div>
        )}
      </div>
    </div>
  );
};

export default Product;
