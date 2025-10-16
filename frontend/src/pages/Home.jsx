import { Link, useParams } from "react-router-dom";
import { useGetProductQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductQuery({ keyword });

  return (
    <>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError?.message || "حدث خطأ"}
        </Message>
      ) : (
        <div className="min-h-screen p-2 sm:p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-center max-w-5xl 
          mx-auto mb-6 md:mb-10 mt-8 md:mt-16 gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white border-b-2
             border-pink-600/50 pb-2 w-full md:w-auto text-center md:text-left">
              Special Products
            </h1>

            <Link
              to="/shop"
              className="bg-pink-600 text-white font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-full
               hover:bg-pink-700 transition duration-200 shadow-lg w-full md:w-auto text-center"
            >
              Shop
            </Link>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
             gap-6 justify-items-center">
              {data.products.map((product) => (
                <div key={product._id} className="w-full flex justify-center">
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;