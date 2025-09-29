import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="pt-14 md:pt-12 px-2 sm:px-4">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;


