import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import AdminNav from "../../../components/nav/AdminNav";
import CategoryForm from "../../../components/forms/CategoryForm";
import {
  createSubcategory,
  getSubcategories,
  removeSubcategory,
} from "../../../utils/subcategory";
import { getCategories } from "../../../utils/category";
import LocalSearch from "../../../components/forms/LocalSearch";

const SubcategoryCreate = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [keyword, setKeyword] = useState("");

  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      let res = await getCategories();
      setCategories(res.data);
      res = await getSubcategories();
      setSubcategories(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Error loading categories");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createSubcategory(
        { name, parent: category },
        user.token
      );
      setLoading(false);
      setName("");
      toast.success(`Subcategory "${res.data.name}" created`);
      loadCategories();
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Create subcategory failed");
    }
  };

  const handleRemove = async (slug) => {
    try {
      if (window.confirm("Delete?")) {
        setLoading(true);
        const res = await removeSubcategory(slug, user.token);
        setLoading(false);
        toast.error(`${res.data.name} deleted`);
        loadCategories();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Delete subcategory failed");
    }
  };

  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Create Subcategory</h4>
          )}

          <div className="form-group">
            <label>Parent Category</label>
            <select
              name="category"
              className="form-control"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Please select</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <CategoryForm
            name={name}
            handleSubmit={handleSubmit}
            setName={setName}
          />

          <LocalSearch keyword={keyword} setKeyword={setKeyword} />

          {categories
            .filter(
              (c) => subcategories.filter((s) => s.parent === c._id).length > 0
            )
            .filter(searched(keyword))
            .map((c) => (
              <div key={c._id}>
                <div className="alert alert-secondary">{c.name} </div>
                {subcategories
                  .filter((s) => s.parent === c._id)
                  .filter(searched(keyword))
                  .map((s) => (
                    <div key={s._id} className="alert alert-secondary ml-3">
                      {s.name}{" "}
                      <span
                        className="btn btn-sm float-right"
                        onClick={() => handleRemove(s.slug)}
                      >
                        <DeleteOutlined className="text-danger" />
                      </span>{" "}
                      <Link to={`/admin/subcategory/${s.slug}?parent=${c._id}`}>
                        <span className="btn btn-sm float-right">
                          <EditOutlined className="text-warning" />
                        </span>
                      </Link>
                    </div>
                  ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SubcategoryCreate;
