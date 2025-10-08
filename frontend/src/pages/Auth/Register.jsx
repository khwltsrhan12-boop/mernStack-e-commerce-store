import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import  {setCredientials}  from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

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

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ username, email, password }).unwrap();
        dispatch(setCredientials({ ...res }));
        navigate(redirect);
        toast.success("User successfully registered");
      } catch (err) {
        console.log(err);
        toast.error(err?.data?.message || err.error);
      }
    }
  };

return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div 
        className="max-w-md w-full bg-gray-900 p-8 rounded-xl shadow-2xl 
        border border-gray-800 text-white">
  
        <h1 className="text-3xl font-extrabold mb-8 text-white border-b-2 
                       border-pink-600/50 pb-2 text-center">
            Register
        </h1>

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 p-3 border rounded-lg w-full bg-gray-800 text-white 
              border-gray-700 focus:border-pink-500 focus:ring-pink-500"
              placeholder="Enter name"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 p-3 border rounded-lg w-full bg-gray-800 text-white 
                border-gray-700 focus:border-pink-500 focus:ring-pink-500"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-pink-600 text-white px-4 py-3 rounded-lg font-bold 
            hover:bg-pink-700 transition duration-200 disabled:opacity-50 mt-8"
          >
            {isLoading ? "Registering..." : "Register"}
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
              Start your journey with us! 🛒
          </span>
        </div>

        <div className="mt-6 text-center pt-4 border-t border-gray-800">
          <p className="text-gray-300">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-pink-500 font-semibold hover:text-pink-400
               transition duration-150"
            >
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
);
};

export default Register;