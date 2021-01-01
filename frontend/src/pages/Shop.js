import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, createSelectorHook } from "react-redux";
import { showLoading, hideLoading } from "react-redux-loading";
import { toast } from "react-toastify";
import { Menu, Slider, Checkbox, Radio } from "antd";
import {
  DollarOutlined,
  DownSquareOutlined,
  StarOutlined,
} from "@ant-design/icons";
import Star from "../components/forms/Star";

import ProductCard from "../components/cards/ProductCard";
import { getProductByCount, fetchProductsByFilter } from "../utils/product";
import { getCategories } from "../utils/category";
import { getSubcategories } from "../utils/subcategory";

const { SubMenu, ItemGroup } = Menu;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [price, setPrice] = useState([0, 0]);
  const [ok, setOk] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [star, setStar] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [sub, setSub] = useState("");
  const [brands, setBrands] = useState([
    "Apple",
    "Samsung",
    "Microsoft",
    "Lenovo",
    "ASUS",
  ]);
  const [brand, setBrand] = useState("");
  const [colors, setColors] = useState([
    "Black",
    "Brown",
    "Silver",
    "White",
    "Blue",
  ]);
  const [color, setColor] = useState("");
  const [shipping, setShipping] = useState("");

  const { text } = useSelector((state) => state.search);
  const dispatch = useDispatch();

  // 1. Load products by default on page load
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    dispatch(showLoading());
    try {
      let res = await getProductByCount(12);
      setProducts(res.data);
      res = await getCategories();
      setCategories(res.data);
      res = await getSubcategories();
      setSubcategories(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Error loading products");
    } finally {
      dispatch(hideLoading());
    }
  };

  // 2. Load products on user search input
  useEffect(() => {
    const delayed = setTimeout(() => {
      if (!text) {
        loadData();
      } else {
        loadProductsByFilter({ query: text });
      }
    }, 300);
    return () => clearTimeout(delayed);
  }, [text]);

  const loadProductsByFilter = async (arg) => {
    try {
      const { data } = await fetchProductsByFilter(arg);
      setProducts(data);
    } catch (error) {
      console.log(error);
      toast.error("Error loading products");
    }
  };

  // 3. Load products based on price range
  useEffect(() => {
    console.log("ok to request");
    if (price[1] === 0) {
      loadData();
    } else {
      loadProductsByFilter({ price });
    }
  }, [ok]);

  const handleSlider = (value) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    // Reset
    setCategoryIds([]);
    setPrice(value);
    setStar("");
    setSub("");
    setBrand("");
    setColor("");
    setShipping("");
    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };

  // 4. Load products based on category
  // Show categories in a list of checkboxes
  const handleCheck = (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setStar("");
    setSub("");
    setBrand("");
    setColor("");
    setShipping("");

    const inTheState = [...categoryIds];
    const justChecked = e.target.value;
    const foundInTheState = inTheState.indexOf(justChecked); // index or -1

    // indexOf method -> if not found returns -1 else returns index
    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      // if found pull out one item from index.
      inTheState.splice(foundInTheState, 1);
    }

    setCategoryIds(inTheState);
    if (inTheState.length === 0) {
      loadData();
    } else {
      loadProductsByFilter({ category: inTheState });
    }
  };

  const showCategories = () => {
    return categories.map((i) => (
      <div key={i._id}>
        <Checkbox
          onChange={handleCheck}
          className="pb-2 pl-4 pr-4"
          value={i._id}
          name="category"
          checked={categoryIds.includes(i._id)}
        >
          {i.name}
        </Checkbox>
        <br />
      </div>
    ));
  };

  // 5. Show products by star rating
  const handleStarClick = (num) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar(num);
    setSub("");
    setBrand("");
    setColor("");
    setShipping("");
    loadProductsByFilter({ stars: num });
  };

  const showStars = () => {
    return (
      <div className="pr-4 pl-4 pb-2">
        <Star starClick={handleStarClick} numberOfStars={5} />
        <Star starClick={handleStarClick} numberOfStars={4} />
        <Star starClick={handleStarClick} numberOfStars={3} />
        <Star starClick={handleStarClick} numberOfStars={2} />
        <Star starClick={handleStarClick} numberOfStars={1} />
      </div>
    );
  };

  // 6. Show products by subcategories
  const handleSubClick = (sub) => {
    setSub(sub);
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar("");
    setBrand("");
    setColor("");
    setShipping("");
    loadProductsByFilter({ subcategory: sub._id });
  };

  const showSubcategories = () => {
    return subcategories.map((i) => (
      <div
        key={i._id}
        onClick={() => handleSubClick(i)}
        className="p-1 m-1 badge badge-secondary"
        style={{ cursor: "pointer" }}
      >
        {i.name}
      </div>
    ));
  };

  // 7. Show products based on brand
  const handleBrand = (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar("");
    setSub("");
    setColor("");
    setShipping("");
    setBrand(e.target.value);
    loadProductsByFilter({ brand: e.target.value });
  };

  const showBrands = () => {
    return brands.map((i) => (
      <Radio
        key={i}
        value={i}
        checked={i === brand}
        onChange={handleBrand}
        className="d-block"
      >
        {i}
      </Radio>
    ));
  };

  // 8. Show products based on color
  const handleColor = (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar("");
    setSub("");
    setBrand("");
    setShipping("");
    setColor(e.target.value);
    loadProductsByFilter({ color: e.target.value });
  };

  const showColors = () => {
    return colors.map((i) => (
      <Radio
        key={i}
        value={i}
        checked={i === color}
        onChange={handleColor}
        className="d-block"
      >
        {i}
      </Radio>
    ));
  };

  // 9. Show products based on shipping
  const handleShipping = (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar("");
    setSub("");
    setBrand("");
    setColor("");
    setShipping(e.target.value);
    loadProductsByFilter({ shipping: e.target.value });
  };

  const showShipping = () => {
    return (
      <>
        <div>
          <Checkbox
            value="Yes"
            checked={shipping === "Yes"}
            onChange={handleShipping}
            // className="pb-2 pl-4 pr-4"
            className="d-block pb-2"
          >
            Yes
          </Checkbox>
        </div>
        <div>
          <Checkbox
            value="No"
            checked={shipping === "No"}
            onChange={handleShipping}
            // className="pb-2 pl-4 pr-4"
            className="d-block pb-2"
          >
            No
          </Checkbox>
        </div>
      </>
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 pt-2">
          <h4>Search/Filter</h4>
          <hr />
          <Menu
            defaultOpenKeys={["1", "2", "3", "4", "5", "6", "7"]}
            mode="inline"
          >
            <SubMenu
              key="1"
              title={
                <span className="h6">
                  <DollarOutlined />
                  Price
                </span>
              }
            >
              <div>
                <Slider
                  className="ml-4 mr-4"
                  tipFormatter={(v) => `$${v}`}
                  range
                  value={price}
                  onChange={handleSlider}
                  max="4999"
                />
              </div>
            </SubMenu>

            <SubMenu
              key="2"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Categories
                </span>
              }
            >
              <div>{showCategories()}</div>
            </SubMenu>

            <SubMenu
              key="3"
              title={
                <span className="h6">
                  <StarOutlined />
                  Rating
                </span>
              }
            >
              <div>{showStars()}</div>
            </SubMenu>

            <SubMenu
              key="4"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Subcategories
                </span>
              }
            >
              <div className="pl-4 pr-4">{showSubcategories()}</div>
            </SubMenu>

            <SubMenu
              key="5"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Brands
                </span>
              }
            >
              <div className="pl-4 pr-4">{showBrands()}</div>
            </SubMenu>

            <SubMenu
              key="6"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Colors
                </span>
              }
            >
              <div className="pl-4 pr-4">{showColors()}</div>
            </SubMenu>

            <SubMenu
              key="7"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Shipping
                </span>
              }
            >
              <div className="pl-4">{showShipping()}</div>
            </SubMenu>
          </Menu>
        </div>
        <div className="col-md-9 pt-2">
          <h4 className="text-danger">Products</h4>
          {products.length < 1 && <p>No products found</p>}
          <div className="row pb-5">
            {products.map((p) => (
              <div key={p._id} className="col-md-4 mt-3">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
