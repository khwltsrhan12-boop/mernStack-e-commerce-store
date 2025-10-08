import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredientials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      console.log(res);
      dispatch(setCredientials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

return (
    <div className=" min-h-screen flex items-center justify-center p-4">
      <div 
        className="max-w-md w-full bg-gray-900 p-8 rounded-xl shadow-2xl 
            border border-gray-800 text-white">
 
        <h1 className="text-3xl font-extrabold mb-8 text-white border-b-2 
           border-pink-600/50 pb-2 text-center">
            Sign In
        </h1>

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-3 border rounded-lg w-full bg-gray-800 text-white 
              border-gray-700 focus:border-pink-500 focus:ring-pink-500"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-3 border rounded-lg w-full bg-gray-800 text-white 
              border-gray-700 focus:border-pink-500 focus:ring-pink-500"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-pink-600 text-white px-4 py-3 rounded-lg font-bold 
            hover:bg-pink-700 transition duration-200 disabled:opacity-50">
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          {isLoading && <Loader />}
        </form>

        <div className="text-center mt-6">
          <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-8 h-8 mx-auto mb-1 text-pink-500" 
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
          >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h2l.4 2M7 13h10l4-8H5.4" 
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
             
          <span className="text-pink-400 text-base font-semibold block">
              Start your smart shopping journey now! 🛒
          </span>
        </div>

        <div className="mt-6 text-center pt-4 border-t border-gray-800">
          <p className="text-gray-300">
            New Customer?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-pink-500 font-semibold hover:text-pink-400 
              transition duration-150"
            >
              Register
            </Link>
          </p>
        </div>

      </div>
    </div>
);
};

export default Login;