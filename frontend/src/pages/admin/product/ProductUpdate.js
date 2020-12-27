import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { showLoading, hideLoading } from "react-redux-loading";

import AdminNav from "../../../components/nav/AdminNav";
import { getProduct, updateProduct } from "../../../utils/product";
import ProductUpdateForm from "../../../components/forms/ProductUpdateForm";
import { getCategories, getCategorySubs } from "../../../utils/category";
import FileUpload from "../../../components/forms/FileUpload";

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

const ProductUpdate = ({ match, history }) => {
  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOptions] = useState([]);
  const [initialVals, setInitialVals] = useState(initialState);

  const { slug } = match.params;

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    loadCategories();
    loadProduct();
  }, []);

  const loadProduct = async () => {
    dispatch(showLoading());
    try {
      const res = await getProduct(slug);
      console.log(res.data);
      setValues((prev) => ({
        ...prev,
        ...res.data,
        category: res.data.category?._id ?? "",
        subcategory: res.data.subcategory.map((i) => i._id),
      }));
      console.log(values);
      setInitialVals((prev) => ({
        ...prev,
        ...res.data,
        category: res.data.category?._id ?? "",
        subcategory: res.data.subcategory.map((i) => i._id),
      }));
      console.log("initialVals=", initialVals);
      if (res.data.category?._id) {
        const subs = await getCategorySubs(res.data.category._id);
        setSubOptions(subs.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoading());
    }
  };

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
    dispatch(showLoading());

    try {
      clean(values);
      const res = await updateProduct(slug, values, user.token);
      toast.success(`Product "${res.data.title}" updated`);
    } catch (error) {
      console.log(error);
      toast.error("Update product failed");
    } finally {
      const { categories } = values;
      setValues({ ...initialState, categories });
      setSubOptions([]);
      dispatch(hideLoading());
    }
    history.push("/admin/products");
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

    setValues((prev) => ({
      ...prev,
      category: value,
      // Clears the selected subcategories if top category changes.
      // Set it back to original if user clicks back to it.
      subcategory:
        value === initialVals.category ? initialVals.subcategory : [],
    }));
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          <h4>Product Update</h4>
          <hr />

          <div className="p-3">
            <FileUpload values={values} setValues={setValues} />
          </div>

          <ProductUpdateForm
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

export default ProductUpdate;
