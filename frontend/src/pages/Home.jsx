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
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <div className=" min-h-screen p-4 md:p-8">
          <div className="flex justify-between items-center max-w-5xl 
            mx-auto mb-10 mt-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white 
              border-b-2 border-pink-600/50 pb-2">
              Special Products
            </h1>

            <Link
              to="/shop"
              className="bg-pink-600 text-white font-bold py-3 px-8 rounded-full 
                hover:bg-pink-700 transition duration-200 shadow-lg"
            >
              Shop
            </Link>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center flex-wrap gap-6">
              {data.products.map((product) => (
                <div key={product._id}
                >
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