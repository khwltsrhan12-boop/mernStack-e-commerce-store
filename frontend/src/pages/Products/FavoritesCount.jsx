import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites);
  const favoriteCount = favorites.length;

  return (
    <>
      {favoriteCount > 0 && (
        <span className="min-w-4 h-4 flex items-center justify-center 
              text-xs font-bold text-white bg-pink-600 rounded-full 
              shadow-md">
          {favoriteCount}
        </span>
      )}
    </>
  );
};

export default FavoritesCount;
