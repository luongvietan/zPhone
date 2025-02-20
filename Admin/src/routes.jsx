import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import UsersList from "./pages/Users/UsersList";
import UserDetail from "./pages/Users/UserDetail";
import UserForm from "./pages/Users/UserForm";
import ProductsList from "./pages/Products/ProductsList";
import ProductDetail from "./pages/Products/ProductDetail";
import ProductForm from "./pages/Products/ProductForm";
import AdminLogin from "./pages/AdminLogin";
import OrderList from "./pages/Orders/OrderList";
import OrderStats from "./pages/Orders/OrderStats";
import OrderExport from "./pages/Orders/OrderExport";
import PromotionsList from "./pages/Promotions/PromotionsList"; // Thêm import
import CreateVoucher from "./pages/Promotions/CreateVoucher"; // Thêm import
import EditVoucher from "./pages/Promotions/EditVoucher"; // Thêm import

const AppRoutes = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem("adminToken");
    return !!token;
  };

  return (
    <Layout>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/"
          element={
            isAuthenticated() ? <Dashboard /> : <Navigate to="/admin/login" />
          }
        />
        <Route
          path="/users"
          element={
            isAuthenticated() ? <UsersList /> : <Navigate to="/admin/login" />
          }
        />
        <Route
          path="/users/:id"
          element={
            isAuthenticated() ? <UserDetail /> : <Navigate to="/admin/login" />
          }
        />
        <Route
          path="/users/edit/:id"
          element={
            isAuthenticated() ? <UserForm /> : <Navigate to="/admin/login" />
          }
        />
        <Route
          path="/products"
          element={
            isAuthenticated() ? (
              <ProductsList />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />
        <Route
          path="/products/new"
          element={
            isAuthenticated() ? <ProductForm /> : <Navigate to="/admin/login" />
          }
        />
        <Route
          path="/products/:id"
          element={
            isAuthenticated() ? (
              <ProductDetail />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />
        <Route
          path="/products/edit/:id"
          element={
            isAuthenticated() ? <ProductForm /> : <Navigate to="/admin/login" />
          }
        />
        <Route
          path="/orders"
          element={
            isAuthenticated() ? <OrderList /> : <Navigate to="/admin/login" />
          }
        />
        <Route
          path="/orders/stats"
          element={
            isAuthenticated() ? <OrderStats /> : <Navigate to="/admin/login" />
          }
        />
        <Route
          path="/orders/export"
          element={
            isAuthenticated() ? <OrderExport /> : <Navigate to="/admin/login" />
          }
        />
        {/* Thêm các route cho Promotions */}
        <Route
          path="/promotions"
          element={
            isAuthenticated() ? (
              <PromotionsList />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />
        <Route
          path="/promotions/create"
          element={
            isAuthenticated() ? (
              <CreateVoucher />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />
        <Route
          path="/promotions/edit/:id"
          element={
            isAuthenticated() ? <EditVoucher /> : <Navigate to="/admin/login" />
          }
        />
        <Route path="*" element={<Navigate to="/admin/login" />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
