import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import AdminNav from "../../../components/nav/AdminNav";
import CategoryForm from "../../../components/forms/CategoryForm";
import { getSubcategory, updateSubcategory } from "../../../utils/subcategory";
import { getCategories } from "../../../utils/category";

const SubcategoryUpdate = ({ history, match, location }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);

  const parent = location.search ? location.search.split("=")[1] : null;

  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      let res = await getCategories();
      setCategories(res.data);
      res = await getSubcategory(match.params.slug, parent);
      const sc = res.data[0];
      setName(sc.name);
      setCategory(sc.parent);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Error loading categories");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await updateSubcategory(
        match.params.slug,
        { name, parent: category },
        user.token
      );
      setLoading(false);
      setName("");
      toast.success(`Subcategory updated`);
      history.push("/admin/subcategory");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Error updating subcategory");
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
            <h4>Update Subcategory</h4>
          )}

          <div className="form-group">
            <label>Parent Category</label>
            <select
              name="category"
              className="form-control"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
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
          <hr />
        </div>
      </div>
    </div>
  );
};

export default SubcategoryUpdate;
