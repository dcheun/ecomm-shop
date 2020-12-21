import React from "react";

const CategoryForm = ({ name, handleSubmit, setName }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Name"
          autoFocus
          required
        />
      </div>
      <button className="btn btn-outline-primary">Submit</button>
    </form>
  );
};

export default CategoryForm;
