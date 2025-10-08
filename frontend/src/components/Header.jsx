import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1 className="text-red-600 text-center py-10">
             Failed to load top products.
           </h1>;
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex flex-wrap justify-between gap-6 ">
        <div className="hidden xl:block w-full xl:w-[48%]">
          <div className="grid grid-cols-2 gap-4">
            {data.map((product) => (
              <div key={product._id}>
                <SmallProduct product={product} />
              </div>
            ))}
          </div>
        </div>
         <div className="w-full xl:w-[48%]">
        <ProductCarousel />
      </div>
    </div>
  </div>
  );
};

export default Header;