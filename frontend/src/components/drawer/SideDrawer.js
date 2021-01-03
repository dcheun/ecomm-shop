import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Drawer, Button } from "antd";

import sample from "../../images/sample.jpg";

const SideDrawer = () => {
  const dispatch = useDispatch();
  const { drawer, cart } = useSelector((state) => state);

  const imageStyle = {
    width: "100%",
    height: "50px",
    objectFit: "cover",
  };

  return (
    <Drawer
      className="text-center"
      title={`Cart / ${cart.length} Products`}
      placement="right"
      closable={false}
      onClose={() => {
        dispatch({
          type: "SET_VISIBLE",
          payload: false,
        });
      }}
      visible={drawer}
    >
      {cart.map((p) => (
        <div key={p._id} className="r">
          <div className="col">
            {p.images[0] ? (
              <img src={p.images[0].url} style={imageStyle} />
            ) : (
              <img src={sample} style={imageStyle} />
            )}
            <p className="text-center bg-secondary text-light">
              {p.title} x {p.count}
            </p>
          </div>
        </div>
      ))}

      <Link to="/cart">
        <button
          onClick={() => {
            dispatch({
              type: "SET_VISIBLE",
              payload: false,
            });
          }}
          className="text-center btn btn-primary btn-raised btn-block"
        >
          Go To Cart
        </button>
      </Link>
    </Drawer>
  );
};

export default SideDrawer;
