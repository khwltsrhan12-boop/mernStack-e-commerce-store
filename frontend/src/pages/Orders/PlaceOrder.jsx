import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
       if (cart.paymentMethod === "TestPayment") {
          dispatch(clearCartItems());
          navigate(`/order/${res._id}`)
        } else{
          dispatch(clearCartItems());
          navigate(`/order/${res._id}`)
          }
    } catch (error) {
      toast.error(error);
    }
  };

 return (
    <>
      <ProgressSteps step1 step2 step3 />

      <div className="max-w-6xl mx-auto mt-8 p-4">
        
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
      <>
        <h2 className="text-3xl font-extrabold mb-6 
        text-white border-b-2 border-gray-700 pb-2">
            Order Items
        </h2>
        <div className="overflow-x-auto bg-gray-900 p-6 rounded-xl
         shadow-2xl border border-gray-800">
          <table className="w-full border-collapse">
            
            <thead className="border-b border-pink-600/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-bold uppercase text-pink-500">Image</th>
                <th className="px-4 py-3 text-left text-sm font-bold uppercase text-pink-500">Product</th>
                <th className="px-4 py-3 text-center text-sm font-bold uppercase text-pink-500">Quantity</th>
                <th className="px-4 py-3 text-right text-sm font-bold uppercase text-pink-500">Price</th>
                <th className="px-4 py-3 text-right text-sm font-bold uppercase text-pink-500">Total</th>
              </tr>
            </thead>

            <tbody>
              {cart.cartItems.map((item, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-800 transition duration-150">
                  
                  <td className="p-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>

                  <td className="p-4">
                    <Link 
                      to={`/product/${item._id || item.product}`} 
                      className="text-white hover:text-pink-400 font-semibold"
                    >
                      {item.name}
                    </Link>
                  </td>
            
                  <td className="p-4 text-center text-white">{item.qty}</td>
                  <td className="p-4 text-right text-gray-300">$ {item.price.toFixed(2)}</td>
                  <td className="p-4 text-right font-bold text-pink-400">
                    $ {(item.qty * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )}

    <div className="mt-12">
      <h2 className="text-3xl font-extrabold mb-6 text-white border-b-2 border-pink-600/50 pb-2">
          Order Summary
      </h2>
      <div className="flex flex-col md:flex-row justify-between p-6 bg-gray-900
       rounded-xl shadow-2xl border border-gray-800 gap-8">
        
  <div className="w-full md:w-1/3 space-y-3 p-4 md:border-r md:border-r-pink-600/30">
            <h3 className="text-xl font-bold text-white mb-2">Billing Details</h3>
            
            <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="font-semibold text-gray-400">Items:</span>
                <span className="font-semibold text-white">$ {cart.itemsPrice}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="font-semibold text-gray-400">Shipping:</span>
                <span className="font-semibold text-white">$ {cart.shippingPrice}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="font-semibold text-gray-400">Tax:</span>
                <span className="font-semibold text-white">$ {cart.taxPrice}</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-pink-600/50">
                <span className="text-2xl font-extrabold text-white">Total:</span>
                <span className="text-2xl font-extrabold text-pink-500">$ {cart.totalPrice}</span>
            </div>
        </div>

  <div className="w-full md:w-1/3 space-y-2 p-4 md:border-r md:border-r-pink-600/30">
            <h3 className="text-xl font-bold text-white mb-2">Shipping Address</h3>
            <p className="text-gray-300">
              {cart.shippingAddress.address}, {cart.shippingAddress.city}
            </p>
            <p className="text-gray-300">
              {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
        </div>

        <div className="w-full md:w-1/3 space-y-2 p-4">
            <h3 className="text-xl font-bold text-white mb-2">Payment Method</h3>
            <p className="text-gray-300">
                <strong>Method:</strong> {cart.paymentMethod}
            </p>
        </div>
      </div>

      {error && <Message variant="danger" className="mt-4">{error.data.message}</Message>}

      <button
        type="button"
        className="bg-pink-600 text-white py-3 px-4 rounded-lg text-xl font-bold 
                    w-full mt-8 hover:bg-pink-700 transition duration-200 shadow-lg"
        disabled={cart.cartItems === 0 || isLoading}
        onClick={placeOrderHandler}
      >
        Place Order
      </button>

      {isLoading && <Loader />}
    </div>
  </div>
    </>
);
};

export default PlaceOrder;