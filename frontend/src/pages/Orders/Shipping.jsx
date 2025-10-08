import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps.jsx";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState( shippingAddress.postalCode || "" );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="max-w-xl mx-auto p-4 md:p-8 mt-10">
      <ProgressSteps step1 step2 />
      <div className="mt-10 p-8 bg-gray-900 rounded-xl 
        shadow-2xl border border-gray-800">
        <form onSubmit={submitHandler} className="w-full">
          <h1 className="text-3xl font-extrabold mb-8 text-white
           border-b-2 border-pink-600/50 pb-2">
            Shipping
          </h1>
          <div className="mb-4">
            <label className="block text-white mb-2 font-semibold">
              Address
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-700 rounded-lg text-white 
               bg-gray-800 focus:ring-pink-500 focus:border-pink-500
               placeholder-gray-500 transition"
              placeholder="Enter address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2 font-semibold">
              City
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-700 rounded-lg text-white 
              bg-gray-800 focus:ring-pink-500 focus:border-pink-500
              placeholder-gray-500 transition"
              placeholder="Enter city"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2 font-semibold">Postal Code</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-700 rounded-lg text-white 
              bg-gray-800 focus:ring-pink-500 focus:border-pink-500
              placeholder-gray-500 transition"
              placeholder="Enter postal code"
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2 font-semibold">Country</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-700 rounded-lg text-white 
              bg-gray-800 focus:ring-pink-500 focus:border-pink-500
              placeholder-gray-500 transition"
              placeholder="Enter country"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div className="mb-6 border-t pt-4 border-gray-700">
            <label className="block text-white mb-4 font-extrabold text-lg">
              Select Method
            </label>
            <div className="mt-2">
              <label className="inline-flex items-center text-white cursor-pointer">
                <input
                  type="radio"
                  className="form-radio h-5 w-5 text-pink-500 bg-gray-700
                   border-gray-600 focus:ring-pink-500"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />

                <span className="ml-3 text-lg">PayPal or Credit Card</span>
              </label>
            </div>
             <div className="mt-2 mb-8">
                  <label className="inline-flex items-center text-white cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-pink-500 bg-gray-700 
                      border-gray-600 focus:ring-pink-500"
                      name="paymentMethod"
                      value="TestPayment"
                      checked={paymentMethod === "TestPayment"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="ml-3 text-lg">Test Payment</span>
                  </label>
             </div>
          </div>

          <button
            className="bg-pink-600 text-white py-3 px-4 rounded-lg text-xl font-bold w-full 
            hover:bg-pink-700 transition duration-200 shadow-lg"
            type="submit"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;