import React, { useState, useEffect } from "react";
import { showLoading, hideLoading } from "react-redux-loading";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import ProductCard from "../../components/cards/ProductCard";
import { getSubcategory } from "../../utils/subcategory";

const SubcategoryHome = ({ match }) => {
  const [subcategories, setSubcategories] = useState([{ name: "" }]);
  const [products, setProducts] = useState([]);

  const { slug } = match.params;
  const dispatch = useDispatch();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    dispatch(showLoading());
    try {
      const { data } = await getSubcategory(slug, "", ["products"]);
      console.log(data);
      setSubcategories(data.subcategories);
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Error loading subcategory");
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
            {products.length} products in "{subcategories[0].name}" subcategory
          </h4>
        </div>
      </div>
      <div className="row">
        {products.map((p) => (
          <div key={p._id} className="col-md-4">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubcategoryHome;
