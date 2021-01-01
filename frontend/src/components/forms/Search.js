import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";

const Search = () => {
  const dispatch = useDispatch();
  const search = useSelector((state) => state.search);
  const { text } = search;
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(`/shop?${text}`);
  };

  const handleChange = (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: e.target.value },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-inline my-2 my-lg-0">
      <input
        type="search"
        value={text}
        onChange={handleChange}
        className="form-control mr-sm-2"
        placeholder="Search"
      />
      <SearchOutlined onClick={handleSubmit} style={{ cursor: "pointer" }} />
    </form>
  );
};

export default Search;
