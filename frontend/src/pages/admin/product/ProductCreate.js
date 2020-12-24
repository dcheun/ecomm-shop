import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import AdminNav from "../../../components/nav/AdminNav";
import { createProduct } from "../../../utils/product";
import ProductCreateForm from "../../../components/forms/ProductCreateForm";
import { getCategories, getCategorySubs } from "../../../utils/category";

const initialState = {
  title: "",
  description: "",
  price: 0,
  categories: [],
  category: "",
  subcategory: [],
  shipping: "No",
  quantity: 0,
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
  color: "",
  brand: "",
};

const ProductCreate = () => {
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [subOptions, setSubOptions] = useState([]);

  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setValues((prev) => ({ ...prev, categories: res.data }));
    } catch (error) {
      console.log(error);
      toast.error("Error loading categories");
    }
  };

  // Filter out null/undefined/empty
  const clean = (obj) => {
    Object.keys(obj).forEach((key) => !obj[key] && delete obj[key]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      clean(values);
      const res = await createProduct(values, user.token);
      toast.success(`Product "${res.data.title}" created`);
    } catch (error) {
      console.log(error);
      toast.error("Create product failed");
    } finally {
      const { categories } = values;
      setValues({ ...initialState, categories });
      setSubOptions([]);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = async (e) => {
    const { value } = e.target;

    setValues((prev) => ({
      ...prev,
      category: value,
      // Clears the selected subcategories if top category changes.
      subcategory: [],
    }));

    if (!value) {
      setSubOptions([]);
      return;
    }

    try {
      const res = await getCategorySubs(value);
      setSubOptions(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Error retrieving subcategories");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          <h4>Product Create</h4>
          <hr />

          <ProductCreateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleCategoryChange={handleCategoryChange}
            subOptions={subOptions}
            setSubOptions={setSubOptions}
            values={values}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
