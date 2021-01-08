import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "react-redux-loading";
import { toast } from "react-toastify";

import AdminNav from "../../components/nav/AdminNav";
import Orders from "../../components/order/Orders";
import { getOrders, changeStatus } from "../../utils/admin";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    dispatch(showLoading());

    try {
      const { data } = await getOrders(user.token);
      setOrders(data);
    } catch (error) {
      console.log(error);
      toast.error("Error loading data");
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleStatusChange = async (orderId, orderStatus) => {
    dispatch(showLoading());
    try {
      await changeStatus(user.token, orderId, orderStatus);
      toast.success("Status updated");
    } catch (error) {
      console.log(error);
      toast.error("Error updating status");
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
          <h4>AdminDashboard</h4>
          <Orders orders={orders} handleStatusChange={handleStatusChange} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
