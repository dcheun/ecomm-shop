import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "react-redux-loading";
import { toast } from "react-toastify";

import { getCategories } from "../../utils/category";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    dispatch(showLoading());

    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch (error) {
      console.log(error);
      toast.error("Error loading categories");
    } finally {
      dispatch(hideLoading());
    }
  };

  const showCategories = () => {
    return categories.map((c) => (
      <div
        key={c._id}
        className="col btn btn-outlined-primary btn-lg btn-block btn-raised m-3"
      >
        <Link to={`/category/${c.slug}`}>{c.name}</Link>
      </div>
    ));
  };

  return (
    <div className="container">
      <div className="row">{showCategories()}</div>
    </div>
  );
};

export default CategoryList;
