import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "react-redux-loading";
import { DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { getCoupons, removeCoupon, createCoupon } from "../../../utils/coupon";
import AdminNav from "../../../components/nav/AdminNav";

const CreateCouponPage = () => {
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [discount, setDiscount] = useState("");
  const [coupons, setCoupons] = useState([]);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    dispatch(showLoading());
    try {
      const { data } = await getCoupons(user.token);
      setCoupons(data);
    } catch (error) {
      console.log(error);
      toast.error("Error loading coupons");
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(showLoading());

    try {
      const { data } = await createCoupon(
        { name, expiry, discount },
        user.token
      );
      setName("");
      setDiscount("");
      setExpiry("");
      loadData();
      toast.success(`Coupon "${data.name}" created`);
    } catch (error) {
      console.log(error);
      toast.error("Error saving coupon");
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Delete?")) {
      return;
    }

    dispatch(showLoading());

    try {
      const res = await removeCoupon(id, user.token);
      loadData();
      toast.error(`Coupon "${res.data.name}" deleted`);
    } catch (error) {
      console.log(error);
      toast.error("Error deleting coupon");
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          <h4>Coupon</h4>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="text-muted">Name</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
                value={name}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label className="text-muted">Discount %</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label className="text-muted">Expiry</label>
              <br />
              <DatePicker
                className="form-control"
                selected={expiry || new Date()}
                value={expiry}
                required
                onChange={setExpiry}
              />
            </div>

            <button className="btn btn-outline-primary">Save</button>
          </form>
          <br />

          <h4>{coupons.length} Coupons</h4>

          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Expiry</th>
                <th scope="col">Discount</th>
                <th scope="col">Action</th>
              </tr>
            </thead>

            <tbody>
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{new Date(c.expiry).toLocaleDateString()}</td>
                  <td>{c.discount}%</td>
                  <td>
                    <DeleteOutlined
                      onClick={() => handleRemove(c._id)}
                      className="text-danger pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreateCouponPage;
