import { useState, useEffect } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart, FaUserCircle,
   FaSignOutAlt, FaTachometerAlt, FaBox, 
   FaClipboardList, FaUsers } from "react-icons/fa";

import { NavLink, useNavigate ,Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useIsMobile from "../../components/useIsMobile";
import MobileSidebar from "../../components/MobileSidebar";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";


const Navigation = () => {
  const isMobile = useIsMobile();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  // استخدام حالة الفتح/الإغلاق لتحكم أفضل في العرض
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  
  const openSidebar = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsSidebarOpen(true);
  };
  
  const closeSidebar = () => {
    const timeout = setTimeout(() => {
      setIsSidebarOpen(false);
    }, 100); // تأخير 100ms قبل الإغلاق
    setHoverTimeout(timeout);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  // تنظيف timeout عند إلغاء المكون
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  // تعريف الروابط الرئيسية
  const mainLinks = [
    { to: "/", icon: AiOutlineHome, name: "Home" },
    { to: "/shop", icon: AiOutlineShopping, name: "Shop" },
  ];
  // تعريف رابط سلة التسوق بشكل منفصل لوجود عداد
  const cartLink = { to: "/cart", icon: AiOutlineShoppingCart, name: "Cart" };
  // تعريف رابط المفضلة بشكل منفصل لوجود عداد
  const favoriteLink = { to: "/favorite", icon: FaHeart, name: "Favorites" };

  if (isMobile) {
    return <MobileSidebar />;
  }
  // ...existing code for sidebar navigation (الديسكتوب)
  return (
    <div
      style={{ zIndex: 9999 }}
      className={`
        bg-gray-900 h-screen fixed top-0 left-0 shadow-2xl
        p-4 text-white flex-col justify-between 
        hidden xl:flex lg:flex
        transition-all duration-300 ease-out
        ${isSidebarOpen ? "w-64" : "w-20"} 
      `}
      onMouseEnter={openSidebar} // الفتح عند مرور الماوس
      onMouseLeave={closeSidebar} // الإغلاق عند خروج الماوس
    >
      {/* القسم العلوي: الروابط الرئيسية */}
      <div className="flex flex-col space-y-2 pt-10">
        {[...mainLinks, cartLink, favoriteLink].map((link, index) => (
          <NavLink
            key={index}
            to={link.to}
            className={({ isActive }) => `
              relative flex items-center rounded-lg font-semibold transition-all duration-200 
                ${isActive 
                    ? "bg-pink-600 text-white shadow-lg" 
                    : "text-gray-300 hover:bg-gray-800 hover:text-pink-400"
                }
                ${isSidebarOpen ? "justify-start p-3" : "justify-center p-3 w-12 h-12"}
            `}
          >
            <link.icon className={`flex-shrink-0 ${isSidebarOpen ? "w-6 h-6" : "w-5 h-5"}`} />
            {isSidebarOpen && (
              <span className="ml-4 whitespace-nowrap transition-all duration-200">
                {link.name}
              </span>
            )}
            {link.to === "/cart" && cartItems.length > 0 && (
              <span className={`absolute transform ${
                isSidebarOpen 
                  ? "-top-1 -right-1" 
                  : "-top-1 -right-1"
              }`}>
                <span className="min-w-4 h-4 flex items-center justify-center 
                      text-xs font-bold text-white bg-pink-600 rounded-full shadow-md">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              </span>
            )}
            {link.to === "/favorite" && (
              <div className="absolute -top-1 -right-1">
                <FavoritesCount />
              </div>
            )}
          </NavLink>
        ))}
      </div>

      {/* القسم السفلي: معلومات المستخدم وتسجيل الدخول/الخروج/الأدمن */}
      <div className="relative pb-4">
        <button
          onClick={toggleDropdown}
          className={`
            w-full flex items-center rounded-lg font-semibold transition duration-200 
            text-gray-300 hover:bg-gray-800 hover:text-pink-400
            ${isSidebarOpen ? "justify-start p-3" : "justify-center p-3 h-12"}
          `}
        >
          {userInfo ? (
            <>
              <FaUserCircle className={`flex-shrink-0 ${isSidebarOpen ? "w-6 h-6" : "w-5 h-5"}`} />
              {isSidebarOpen && (
                <span className="ml-4 whitespace-nowrap">
                  {userInfo.username}
                </span>
              )}
            </>
          ) : (
            <Link to="/login" className="flex items-center text-gray-300 hover:text-pink-500 w-full 
            h-full justify-center">
              <AiOutlineLogin className={isSidebarOpen ? "text-2xl" : "text-xl"} />
              {isSidebarOpen && (
                <span className="ml-4 whitespace-nowrap">Login</span>
              )}
            </Link>
          )}
        </button>

        {dropdownOpen && userInfo && (
          <ul
            className={`
              absolute left-full transform -translate-x-full bottom-0 
              mb-14 space-y-1 bg-gray-800 text-white p-2 rounded-lg shadow-xl min-w-40
            `}
          >
            {/* روابط الأدمن */}
            {userInfo.isAdmin && (
              <>
                <DropdownLink to="/admin/dashboard" name="Dashboard" icon={FaTachometerAlt} />
                <DropdownLink to="/admin/productlist" name="Products" icon={FaBox} />
                <DropdownLink to="/admin/categorylist" name="Category" icon={FaBox} />
                <DropdownLink to="/admin/orderlist" name="Orders" icon={FaClipboardList} />
                <DropdownLink to="/admin/userlist" name="Users" icon={FaUsers} />
                <div className="border-t border-gray-700 my-1"></div>
              </>
            )}
            {/* روابط المستخدم */}
            <DropdownLink to="/profile" name="Profile" icon={FaUserCircle} />
            {/* زر تسجيل الخروج */}
            <li>
              <button
                onClick={logoutHandler}
                className="w-full flex items-center px-4 py-2 text-left text-red-400 hover:bg-gray-700 
                rounded-lg transition duration-200"
              >
                <FaSignOutAlt className="mr-2 w-4 h-4" />
                Logout
              </button>
            </li>
          </ul>
        )}
        {/* رابط التسجيل لغير المسجلين */}
        {!userInfo && isSidebarOpen && (
          <Link 
            to="/register" 
            className="flex items-center p-3 mt-2 rounded-lg font-semibold text-gray-300 
            hover:bg-gray-800 hover:text-pink-400"
          >
            <AiOutlineUserAdd size={26} />
            <span className="ml-4">REGISTER</span>
          </Link>
        )}
      </div>
    </div>
  );
};

const DropdownLink = ({ to, name, icon: Icon }) => (
    <li>
        <Link
            to={to}
            className="w-full flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg transition duration-200"
        >
            <Icon className="mr-2 w-4 h-4 text-pink-400" />
            {name}
        </Link>
    </li>
);

export default Navigation;