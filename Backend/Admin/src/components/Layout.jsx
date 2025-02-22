import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* <Navbar /> */}
        <div className="p-5 bg-gray-100 flex-1">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
