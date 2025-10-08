import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <button
        className={`${
          isMenuOpen ? "top-2 right-2" : "top-5 right-7"
        } bg-gray-800 p-2 fixed rounded-lg`}
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <FaTimes color="white" />
        ) : (
          <>
            <div className="w-6 h-0.5 bg-gray-200 my-1"></div>
            <div className="w-6 h-0.5 bg-gray-200 my-1"></div>
            <div className="w-6 h-0.5 bg-gray-200 my-1"></div>
          </>
        )}
      </button>

      {isMenuOpen && (
        <section className="bg-[#131A28] p-4 fixed right-7 top-5 rounded-lg 
                shadow-2xl z-50">
          <ul className="list-none mt-2">
            <li>
              <NavLink
                className="list-item py-2 px-3 block mb-5 hover:bg-gray-800
                 rounded-sm transition-colors duration-150"
                to="/admin/dashboard"
                style={({ isActive }) => ({
                  color: isActive ? "#EC4899" : "white",
                })}
              >
                Admin Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 block mb-5 hover:bg-gray-800
                 rounded-sm transition-colors duration-150"
                to="/admin/categorylist"
                style={({ isActive }) => ({
                  color: isActive ? "#EC4899" : "white",
                })}
              >
                Create Category
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 block mb-5 hover:bg-gray-800
                 rounded-sm transition-colors duration-150"
                to="/admin/productlist"
                style={({ isActive }) => ({
                  color: isActive ? "#EC4899" : "white",
                })}
              >
                Create Product
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 block mb-5 hover:bg-gray-800 
                rounded-sm transition-colors duration-150"
                to="/admin/allproductslist"
                style={({ isActive }) => ({
                  color: isActive ? "#EC4899" : "white",
                })}
              >
                All Products
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 block mb-5 hover:bg-gray-800 
                rounded-sm transition-colors duration-150"
                to="/admin/userlist"
                style={({ isActive }) => ({
                  color: isActive ? "#EC4899" : "white",
                })}
              >
                Manage Users
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 block mb-5 hover:bg-gray-800 
                rounded-sm transition-colors duration-150"
                to="/admin/orderlist"
                style={({ isActive }) => ({
                  color: isActive ? "#EC4899" : "white",
                })}
              >
                Manage Orders
              </NavLink>
            </li>
          </ul>
        </section>
      )}
    </>
  );
};

export default AdminMenu;