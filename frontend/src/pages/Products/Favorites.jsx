import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-10 mt-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white 
            border-b-2 border-pink-600/50 pb-2">
            FAVORITE PRODUCTS
        </h1>
    </div>

       <div className="max-w-7xl mx-auto">
        {favorites.length === 0 ? (
          <p className="text-xl text-gray-400 mt-10">
            Your favorites list is empty. Start exploring!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
           xl:grid-cols-4 gap-6"> 
            {favorites.map((product) => (
              <div key={product._id} className="w-full">
                <Product product={product} /> 
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;