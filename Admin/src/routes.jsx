import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import UsersList from "./pages/Users/UsersList";
import UserDetail from "./pages/Users/UserDetail";
import UserForm from "./pages/Users/UserForm";

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="/users/edit/:id" element={<UserForm />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
