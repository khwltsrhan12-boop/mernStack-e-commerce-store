import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

 return (
      <> 
        <div className="max-w-3xl mx-auto p-4 md:p-8 mt-8">
        
        {cartItems.length === 0 ? (
          
          <div className="text-center py-20 bg-gray-900 rounded-xl shadow-2xl">
            <h2 className="text-2xl text-white mb-4">Your cart is empty</h2>
            <Link to="/shop"
                 className="text-pink-500 hover:text-pink-400 font-semibold text-lg">
                 Go To Shop
            </Link>
          </div>
        ) : (
          <div className="flex flex-col w-full"> 
            <h1 className="text-3xl font-extrabold mb-8 text-white
               border-b-2 border-pink-600/50 pb-2">
                Shopping Cart
            </h1>

            <div className="bg-gray-900 p-6 rounded-xl shadow-2xl 
            border border-gray-800 space-y-4">
              
              {cartItems.map((item) => (
                <div 
                  key={item._id} 
                  className="flex items-center justify-between py-4 
                  border-b border-gray-700 last:border-b-0"
                >
                  
                <div className="flex items-center flex-1 min-w-0">
                  <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg border border-gray-700"
                      />
                    </div>

                  <div className="ml-4 flex-1 truncate">
                      <Link 
                        to={`/product/${item._id}`} 
                        className="text-lg font-semibold text-pink-400
                         hover:text-pink-300 transition block truncate"
                         >
                        {item.name}
                      </Link>
                      <div className="text-sm text-gray-400">{item.brand}</div>
                      <div className="text-md font-bold text-white mt-1">
                        $ {item.price}
                      </div>
                    </div>
                  </div>      
                  <div className="flex items-center space-x-4 ml-4">
                    
                    <div className="w-24">
                      <select
                        className="w-full p-2 border border-gray-700 rounded-lg text-white 
                        bg-gray-800 focus:ring-pink-500 focus:border-pink-500 appearance-none"
                        value={item.qty}
                        onChange={(e) =>
                          addToCartHandler(item, Number(e.target.value))
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      className="p-2 text-red-500 hover:text-red-400 transition"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>

                </div>
              ))}
              
              <div className="mt-6 pt-4 border-t border-gray-700">
                
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xl font-semibold text-gray-300">
                        Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                    </span>
                    <span className="text-xl font-semibold text-white">
                        $ {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                    </span>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-pink-600/50">
                    <span className="text-3xl font-bold text-white">Total:</span>
                    <span className="text-3xl font-extrabold text-pink-500">
                        $ {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                    </span>
                </div>

                <button
                    className="bg-pink-600 mt-6 py-3 px-4 rounded-lg text-xl font-bold w-full 
                               text-white hover:bg-pink-700 transition duration-200 disabled:bg-gray-600"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                >
                    Proceed To Checkout
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </>
);
};

export default Cart;