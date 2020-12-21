import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import AdminNav from "../../../components/nav/AdminNav";
import CategoryForm from "../../../components/forms/CategoryForm";
import {
  createCategory,
  getCategories,
  removeCategory,
} from "../../../utils/category";
import LocalSearch from "../../../components/forms/LocalSearch";

const CategoryCreate = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState("");

  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data);
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
      const res = await createCategory(name, user.token);
      setLoading(false);
      setName("");
      toast.success(`Category "${res.data.name}" created`);
      loadCategories();
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Create category failed");
    }
  };

  const handleRemove = async (slug) => {
    try {
      if (window.confirm("Delete?")) {
        setLoading(true);
        const res = await removeCategory(slug, user.token);
        setLoading(false);
        toast.error(`${res.data.name} deleted`);
        loadCategories();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Error deleting category");
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
            <h4>Create Category</h4>
          )}
          <CategoryForm
            name={name}
            handleSubmit={handleSubmit}
            setName={setName}
          />

          <LocalSearch keyword={keyword} setKeyword={setKeyword} />

          {categories.filter(searched(keyword)).map((c) => (
            <div key={c._id} className="alert alert-secondary">
              {c.name}{" "}
              <span
                className="btn btn-sm float-right"
                onClick={() => handleRemove(c.slug)}
              >
                <DeleteOutlined className="text-danger" />
              </span>{" "}
              <Link to={`/admin/category/${c.slug}`}>
                <span className="btn btn-sm float-right">
                  <EditOutlined className="text-warning" />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryCreate;
