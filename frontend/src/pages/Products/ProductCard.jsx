import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="max-w-sm relative bg-gray-900 rounded-xl shadow-lg 
    hover:shadow-pink-500/10 transition duration-300 overflow-hidden 
    border border-gray-800">
      <section className="relative">
        <Link to={`/product/${p._id}`}>
          <span className="absolute bottom-3 right-3 bg-pink-600/90 text-white
            text-xs font-semibold px-3 py-1 rounded-full z-10">
            {p?.brand}
          </span>
          <img
            className="cursor-pointer w-full object-cover rounded-t-xl"
            src={p.image}
            alt={p.name}
            style={{ height: "170px", objectFit: "cover" }}
          />
        </Link>
        <HeartIcon product={p} />
      </section>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h5 className="text-xl font-semibold text-white truncate">{p?.name}</h5>

          <p className="font-bold text-pink-400 text-lg ml-2">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>

        <p className="mb-4 font-light text-gray-400 text-sm">
          {p?.description?.substring(0, 60)} ...
        </p>

        <section className="flex justify-between items-center">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium 
                  text-center text-white bg-pink-600 rounded-lg hover:bg-pink-700 
                  transition duration-200 font-semibold"
                          >
            Read More
            <svg
              className="w-3.5 h-3.5 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>

          <button
            className="p-2 rounded-full border border-pink-600 text-pink-400 
               hover:bg-pink-600 hover:text-white transition duration-200"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart size={25} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;