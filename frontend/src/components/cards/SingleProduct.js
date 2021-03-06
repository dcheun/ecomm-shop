import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "react-redux-loading";
import { Card, Tabs, Tooltip } from "antd";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import StarRatings from "react-star-ratings";
import _ from "lodash";
import { toast } from "react-toastify";

import sample from "../../images/sample.jpg";
import ProductListItems from "./ProductListItems";
import RatingModal from "../modals/RatingModal";
import { showAverage } from "../../utils/rating";
import { addToWishlist } from "../../utils/user";

const { TabPane } = Tabs;

const SingleProduct = ({ product, onStarClick, star }) => {
  const [tooltip, setTooltip] = useState("Click to add");
  const { _id, title, description, images, slug, ratings } = product;

  const { user, cart } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleAddToCart = () => {
    // create cart array
    let cart = [];
    // NOTE: typeof returns a string
    // https://stackoverflow.com/questions/5663277/what-is-the-difference-between-undefined-and-undefined
    if (typeof window !== "undefined") {
      // If cart is in localstorage, GET it
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      // Push new product to cart
      cart.push({
        ...product,
        count: 1,
      });
      // Remove duplicates
      const unique = _.uniqWith(cart, _.isEqual);
      // Save to local storage
      localStorage.setItem("cart", JSON.stringify(unique));
      // Show tooltip
      setTooltip("Added");

      // Add to redux state
      dispatch({
        type: "ADD_TO_CART",
        payload: unique,
      });
      // Show side drawer
      dispatch({
        type: "SET_VISIBLE",
        payload: true,
      });
    }
  };

  const handleAddToWishlist = async (e) => {
    dispatch(showLoading());
    try {
      const { data } = await addToWishlist(user.token, product._id);
      if (data.ok) {
        toast.success("Added to wishlist");
        history.push("/user/wishlist");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error adding to wishlist");
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <>
      <div className="col-md-7">
        {images && images.length ? (
          <Carousel showArrows autoPlay infiniteLoop>
            {images && images.map((i) => <img src={i.url} key={i.public_id} />)}
          </Carousel>
        ) : (
          <Card cover={<img src={sample} className="mb-3 card-image" />}></Card>
        )}
        <Tabs type="card">
          <TabPane tab="Description" key="1">
            {description}
          </TabPane>
          <TabPane tab="More" key="2">
            Call use on xxx xxx xxxx to learn more about this product.
          </TabPane>
        </Tabs>
      </div>

      <div className="col-md-5">
        <h1 className="bg-info p-3">{title}</h1>

        {ratings?.length ?? 0 > 0 ? (
          showAverage(product)
        ) : (
          <div className="text-center pt-1 pb-3">No ratings yet</div>
        )}

        <Card
          actions={[
            <Tooltip title={tooltip}>
              <a onClick={handleAddToCart}>
                <ShoppingCartOutlined className="text-success" />
                <br />
                Add to Cart
              </a>
            </Tooltip>,
            <a onClick={handleAddToWishlist}>
              <HeartOutlined className="text-info" />
              <br />
              Add to Wishlist
            </a>,
            <RatingModal>
              <StarRatings
                name={_id}
                numberOfStars={5}
                rating={star}
                changeRating={onStarClick}
                isSelectable
                starRatedColor="red"
              />
            </RatingModal>,
          ]}
        >
          <ProductListItems product={product} />
        </Card>
      </div>
    </>
  );
};

export default SingleProduct;
