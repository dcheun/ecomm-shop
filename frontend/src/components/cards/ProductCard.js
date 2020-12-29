import React from "react";
import { Link } from "react-router-dom";
import { Card } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";

import sample from "../../images/sample.jpg";
import { showAverage } from "../../utils/rating";

const { Meta } = Card;

const ProductCard = ({ product }) => {
  const { title, description, images, slug, ratings } = product;

  return (
    <>
      {ratings?.length ?? 0 > 0 ? (
        showAverage(product)
      ) : (
        <div className="text-center pt-1 pb-3">No ratings yet</div>
      )}
      <Card
        cover={
          <img
            alt=""
            src={images?.length ? images[0].url : sample}
            style={{ height: "150px", objectFit: "cover" }}
            className="p-1"
          />
        }
        actions={[
          <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-warning" />
            <br />
            View Product
          </Link>,
          <Link to={`/`}>
            <ShoppingCartOutlined className="text-danger" />
            <br />
            Add to Cart
          </Link>,
        ]}
      >
        <Meta
          title={title}
          description={`${description && description.substring(0, 30)}...`}
        />
      </Card>
    </>
  );
};

export default ProductCard;
