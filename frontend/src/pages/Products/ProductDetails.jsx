import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <>
      <div className="pt-4 pl-20">
        <Link
          to="/"
          className="text-white font-semibold hover:underline"
        >
          Go Back
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <>
          <div className="flex flex-wrap relative items-start gap-4 max-w-7xl mx-auto p-4">
            <div className="w-full md:w-1/2 lg:w-2/5">
              <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-[4/3] object-cover rounded-lg"
              />

              <HeartIcon product={product} />
            </div>

            <div className="flex flex-col justify-between">
              <h2 className="text-2xl font-semibold">{product.name}</h2>
              <p className="my-4 xl:w-[35rem] lg:w-[35rem] md:w-[30rem] text-[#B0B0B0]">
                {product.description}
              </p>

              <p className="text-5xl my-4 font-extrabold">$ {product.price}</p>

               <div className="p-4 mt-4 bg-gray-900 rounded-lg shadow-xl
                w-full md:w-[35rem] mb-6">

              <div className="flex flex-wrap items-start justify-between">
                <div className="one w-full md:w-1/2 p-2">
                  <h1 className="flex items-center  pb-2 border-b border-gray-700 mb-2">
                    <FaStore className="mr-2 text-pink-500" /> 
               <span className="font-semibold text-gray-400">Brand:</span> {product.brand}

                  </h1>

                  <h1 className="flex items-center pb-2 border-b border-gray-700 mb-2">
                    <FaClock className="mr-2 text-pink-500" /> 
                      <span className="font-semibold text-gray-400">Added:</span>{" "}
                        {moment(product.createAt).fromNow()}
                  </h1>

                  <h1 className="flex items-center pb-2 border-b border-gray-700 mb-2">
                    <FaStar className="mr-2 text-pink-500" /> 
                     <span className="font-semibold text-gray-400">Reviews:</span>{" "}
                      {product.numReviews}
                    
                  </h1>
                </div>

                <div className="two w-full md:w-1/2 p-2">
                  <h1 className="flex items-center pb-2 border-b border-gray-700 mb-2">
                    <FaStar className="mr-2 text-pink-500" />
                     <span className="font-semibold text-gray-400">Ratings:</span>{" "}
                     {rating}
                  </h1>
                  <h1 className="flex items-center pb-2 border-b border-gray-700 mb-2">
                    <FaShoppingCart className="mr-2 text-pink-500" /> 
                    <span className="font-semibold text-gray-400">Quantity:</span>{" "}
                       {product.quantity}
                  </h1>

                  <h1 className="flex items-center pb-2 mb-2">
                    <FaBox className="mr-2 text-pink-500" />
                     <span className="font-semibold text-gray-400">In Stock:</span>{" "}
                        {product.countInStock}
                  </h1>
                </div>
              </div>
            </div>

              <div className="flex flex-wrap items-center justify-start gap-4 mt-6">
                <Ratings
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />

                {product.countInStock > 0 && (
                  <div>
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                       className="p-2 w-[6rem] rounded-lg text-white border border-gray-700 bg-gray-700"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className={`py-2 px-4 rounded-lg text-white font-semibold
                     transition-colors duration-200  w-auto           
                     ${product.countInStock === 0
                        ? "bg-gray-700 cursor-not-allowed"
                        : "bg-pink-600 hover:bg-pink-700" 
                           }`}
                >
                  {product.countInStock === 0 ? "Out Of Stock" : "Add To Cart"}
                </button>
              </div>

              
             
            </div>

            <div className="mt-[3rem] w-full max-w-7xl mx-auto p-4 bg-gray-900 rounded-lg shadow-xl">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;