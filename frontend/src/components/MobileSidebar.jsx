import { useState } from "react";
import { AiOutlineHome, AiOutlineShopping, AiOutlineShoppingCart,
  AiOutlineLogin, AiOutlineUserAdd } from "react-icons/ai";
import { FaHeart, FaUserCircle, FaTachometerAlt, FaBox, FaClipboardList, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { NavLink, Link } from "react-router-dom";
import FavoritesCount from "../pages/Products/FavoritesCount";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const MobileSidebar = () => {
  // منطق تسجيل الخروج
  const dispatch = useDispatch();
  const navigate = window.location ? null : undefined;
  const handleLogout = () => {
    dispatch({ type: 'auth/logout' });
    setOpen(false);
    setDropdownOpen(false);
    window.location.href = '/login';
  };
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const mainLinks = [
    { to: "/", icon: AiOutlineHome, name: "Home" },
    { to: "/shop", icon: AiOutlineShopping, name: "Shop" },
  ];
  const cartLink = { to: "/cart", icon: AiOutlineShoppingCart, name: "Cart" };
  const favoriteLink = { to: "/favorite", icon: FaHeart, name: "Favorites" };

  return (
    <>
      {/* زر همبرغر أعلى الصفحة للجوال فقط */}
      <button
        className="fixed top-4 left-4 z-[10000] bg-gray-900 text-white p-2 rounded-full 
        shadow-2xl hidden lg:block transition-all duration-300 hover:bg-pink-100 
        hover:rotate-12 hover:text-pink-600"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        style={{ display: open ? 'none' : 'block' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7"
         fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" 
          strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      {/* القائمة الجانبية للجوال فقط */}
      {open && (
        <div className="xl:hidden lg:hidden fixed inset-0 bg-black bg-opacity-60 z-[10001] flex">
          <div className="bg-gray-900 h-full w-72 shadow-3xl p-6 text-white flex flex-col 
          justify-between relative rounded-r-2xl">
            {/* زر إغلاق */}
            <button
              className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-3 shadow-lg text-xl"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7"
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" 
                strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            {/* الروابط */}
            <div className="flex flex-col space-y-4 pt-14">
              {[...mainLinks, cartLink, favoriteLink].map((link, index) => (
                <NavLink
                  key={index}
                  to={link.to}
                  className={({ isActive }) => `relative flex items-center rounded-xl font-bold text-lg 
                  transition-all duration-200
                   ${isActive ? "bg-pink-700/20 text-pink-600 border border-pink-500 shadow-lg" 
                    : "text-gray-200 hover:bg-gray-800 hover:text-pink-400"} justify-center p-4`}
                  onClick={() => setOpen(false)}
                >
                  <link.icon className="flex-shrink-0 w-7 h-7" />
                  <span className="ml-4 whitespace-nowrap">{link.name}</span>
                  {link.to === "/cart" && cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-5 h-5 flex items-center justify-center
                     text-xs font-bold text-white bg-pink-600 rounded-full shadow-md">
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </span>
                  )}
                  {link.to === "/favorite" && (
                    <div className="absolute -top-2 -right-2">
                      <FavoritesCount />
                    </div>
                  )}
                </NavLink>
              ))}

              <div className="my-8 border-t border-gray-800"></div>
              {/* زر المستخدم لفتح القائمة المنسدلة */}
              {userInfo && (
                <div className="relative flex flex-col items-center mt-auto">
                  <button
                    className="flex items-center w-full rounded-xl font-bold text-lg transition
                     duration-200 text-gray-200 hover:bg-gray-800 hover:text-pink-400 justify-center p-4 mb-2"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                  >
                    <FaUserCircle className="w-7 h-7" />
                    <span className="ml-4 whitespace-nowrap">{userInfo.username}</span>
                  </button>
                  {dropdownOpen && (
                    <div className="mt-2 w-64 bg-gray-800 text-white p-3 rounded-xl 
                    shadow-xl z-50 flex flex-col space-y-2 max-h-96 overflow-y-auto">
                      {/* روابط الأدمن */}
                      {userInfo.isAdmin && (
                        <>
                          <Link to="/admin/dashboard" className="flex items-center px-4 py-3 
                          hover:bg-gray-700 rounded-xl transition duration-200" 
                           onClick={() => { setOpen(false); setDropdownOpen(false); }}>
                            <FaTachometerAlt className="mr-2 w-5 h-5 text-pink-400" />
                            Dashboard
                          </Link>
                          <Link to="/admin/productlist" className="flex items-center px-4 py-3
                           hover:bg-gray-700 rounded-xl transition duration-200" 
                           onClick={() => { setOpen(false); setDropdownOpen(false); }}>
                            <FaBox className="mr-2 w-5 h-5 text-pink-400" />
                            Products
                          </Link>
                          <Link to="/admin/categorylist" className="flex items-center px-4 py-3 
                          hover:bg-gray-700 rounded-xl transition duration-200" 
                           onClick={() => { setOpen(false); setDropdownOpen(false); }}>
                            <FaBox className="mr-2 w-5 h-5 text-pink-400" />
                            Category
                          </Link>
                          <Link to="/admin/orderlist" className="flex items-center px-4 py-3
                           hover:bg-gray-700 rounded-xl transition duration-200"
                           onClick={() => { setOpen(false); setDropdownOpen(false); }}>
                            <FaClipboardList className="mr-2 w-5 h-5 text-pink-400" />
                            Orders
                          </Link>
                          <Link to="/admin/userlist" className="flex items-center px-4 py-3
                           hover:bg-gray-700 rounded-xl transition duration-200" 
                          onClick={() => { setOpen(false); setDropdownOpen(false); }}>
                            <FaUsers className="mr-2 w-5 h-5 text-pink-400" />
                            Users
                          </Link>
                          <div className="border-t border-gray-700 my-2"></div>
                        </>
                      )}
                      {/* روابط المستخدم */}
                      <Link to="/profile" className="flex items-center px-4 py-3 hover:bg-gray-700 
                      rounded-xl transition duration-200" 
                      onClick={() => { setOpen(false); setDropdownOpen(false); }}>
                        <FaUserCircle className="mr-2 w-5 h-5 text-pink-400" />
                        Profile
                      </Link>
                      {/* زر تسجيل الخروج */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-left text-red-400
                         hover:bg-gray-700 rounded-xl transition duration-200 mt-2"
                      >
                        <FaSignOutAlt className="mr-2 w-5 h-5" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
              {/* روابط الزائر */}
              {!userInfo && (
                <div className="flex flex-col items-center mt-auto">
                  <Link to="/login" className="flex items-center text-gray-300 hover:text-pink-500 
                  w-full justify-center p-4 mb-2" onClick={() => setOpen(false)}>
                    <AiOutlineLogin className="w-7 h-7" />
                    <span className="ml-4 whitespace-nowrap">Login</span>
                  </Link>
                  <Link to="/register" className="flex items-center p-4 rounded-xl font-bold 
                  text-gray-300 hover:bg-gray-800 hover:text-pink-400 w-full justify-center" 
                  onClick={() => setOpen(false)}>
                    <AiOutlineUserAdd size={28} />
                    <span className="ml-4">REGISTER</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
          {/* لإغلاق القائمة عند الضغط خارجها */}
          <div className="flex-1" onClick={() => setOpen(false)}></div>
        </div>
      )}
    </>
  );
};

export default MobileSidebar;
