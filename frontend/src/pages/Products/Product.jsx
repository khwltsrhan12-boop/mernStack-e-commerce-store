import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
  <div className="w-full max-w-xs sm:max-w-sm md:max-w-xs bg-gray-900 rounded-xl
   shadow-2xl border border-gray-800 hover:border-pink-600 
   transition duration-300 overflow-hidden mb-4 sm:mb-6">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 sm:h-56 md:h-64 object-cover"
        />
        <HeartIcon product={product} />

         <span className="absolute bottom-2 right-2 bg-pink-600 text-white
          text-lg font-bold px-4 py-1 rounded-full shadow-lg">
          $ {product.price}
        </span>

      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-start items-center">
            <div className="text-xl font-semibold text-white truncate
                 hover:text-pink-400 transition">
              {product.name}
            </div>
           
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default Product;