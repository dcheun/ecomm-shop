import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import AdminNav from "../../../components/nav/AdminNav";
import CategoryForm from "../../../components/forms/CategoryForm";
import { getCategory, updateCategory } from "../../../utils/category";

const CategoryUpdate = ({ history, match }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadCategory();
  }, []);

  const loadCategory = async () => {
    setLoading(true);
    try {
      const { data } = await getCategory(match.params.slug);
      setName(data.category.name);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Error loading category");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await updateCategory(match.params.slug, { name }, user.token);
      setLoading(false);
      setName("");
      toast.success(`Category updated`);
      history.push("/admin/category");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Error updating category");
    }
  };

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
            <h4>Update Category</h4>
          )}
          <CategoryForm
            name={name}
            handleSubmit={handleSubmit}
            setName={setName}
          />
          <hr />
        </div>
      </div>
    </div>
  );
};

export default CategoryUpdate;
