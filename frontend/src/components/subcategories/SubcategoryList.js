import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { showLoading, hideLoading } from "react-redux-loading";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { getSubcategories } from "../../utils/subcategory";

const SubcategoryList = () => {
  const [subcategories, setSubcategories] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    dispatch(showLoading());

    try {
      const { data } = await getSubcategories();
      setSubcategories(data);
    } catch (error) {
      console.log(error);
      toast.error("Error loading subcategories");
    } finally {
      dispatch(hideLoading());
    }
  };

  const show = () => {
    return subcategories.map((c) => (
      <div
        key={c._id}
        className="col btn btn-outlined-primary btn-lg btn-block btn-raised m-3"
      >
        <Link to={`/subcategory/${c.slug}`}>{c.name}</Link>
      </div>
    ));
  };

  return (
    <div className="container">
      <div className="row">{show()}</div>
    </div>
  );
};

export default SubcategoryList;
