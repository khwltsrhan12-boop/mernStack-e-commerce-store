import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-full bg-gray-900 rounded-xl shadow-xl 
      border border-gray-800 hover:border-pink-600 
      transition duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <HeartIcon product={product} />

         <span className="absolute top-2 right-2 bg-pink-600 text-white text-md 
            font-bold px-3 py-1 rounded-full shadow-md">
            ${product.price}
        </span>
      </div>

         <div className="p-3">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div className="text-lg font-semibold text-white truncate 
              hover:text-pink-400 transition">
              {product.name}
            </div>
          </h2>
        </Link>
         <p className="text-sm text-gray-400 mt-1">{product.brand}</p>
      </div>

    </div>
  );
};

export default SmallProduct;