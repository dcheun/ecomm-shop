import React, { useEffect, useState } from "react";
import { showLoading, hideLoading } from "react-redux-loading";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Pagination } from "antd";

import { getProducts, getProductsCount } from "../../utils/product";
import ProductCard from "../cards/ProductCard";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [productsCount, setProductsCount] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    loadAllProducts();
  }, [page]);

  useEffect(() => {
    getProductsCount()
      .then((res) => setProductsCount(res.data))
      .catch((error) => console.log(error));
  }, []);

  const loadAllProducts = async () => {
    dispatch(showLoading());
    try {
      const res = await getProducts("sold", "desc", page);
      setProducts(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Error loading products");
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          {products &&
            products.map((p) => (
              <div key={p._id} className="col-md-4">
                <ProductCard product={p} />
              </div>
            ))}
        </div>
        <div className="row">
          <nav className="col-md-4 offset-md-4 text-center p-3">
            <Pagination
              current={page}
              total={(productsCount / 3) * 10}
              onChange={setPage}
            />
          </nav>
        </div>
      </div>
    </>
  );
};

export default BestSellers;
