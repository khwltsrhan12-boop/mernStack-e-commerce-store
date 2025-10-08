import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();

  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <section className="flex flex-col items-start gap-4 w-[15rem] mr-8">
        {/* التاب 1: Review Form */}
        <div className={`p-3 cursor-pointer text-lg rounded-lg transition-colors 
          duration-200 w-full text-center 
          ${activeTab === 1
          ? "bg-pink-600 text-white font-semibold" 
          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
          onClick={() => handleTabClick(1)}
        >
          Review Form
        </div>
        
        {/* التاب 2: All Reviews */}
        <div className={`p-3 cursor-pointer text-lg rounded-lg 
            transition-colors duration-200 w-full text-center 
            ${activeTab === 2
          ? "bg-pink-600 text-white font-semibold"
          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => handleTabClick(2)}
        >
          All Reviews
        </div>
        
        {/* التاب 3: Related Products */}
        <div className={`p-3 cursor-pointer text-lg rounded-lg 
          transition-colors duration-200 w-full text-center 
            ${activeTab === 3
            ? "bg-pink-600 text-white font-semibold"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          onClick={() => handleTabClick(3)}
        >
          Related Products
        </div>
      </section>

      {/* القسم الرئيسي للمحتوى */}
      <section className="pt-4 flex-shrink-0 min-h-[25rem]">
        
        {/* محتوى التاب 1: Write Your Review */}
        {activeTab === 1 && (
          <div className="xl:w-[50rem]"> {/* العرض الموحد والمحاذاة */}
            <h2 className="text-2xl font-bold mb-4 text-white border-b 
            border-pink-500/50 pb-2">
              Write Your Review
            </h2>
            {userInfo ? (
              <form onSubmit={submitHandler}>
                <div className="mt-4 mb-2">
                  <label htmlFor="rating" className="block text-xl mb-2">
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="p-3 border border-gray-600 rounded-lg xl:w-[40rem] bg-gray-800 
                      text-white focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="" className="text-black">Select</option>
                    <option value="1" className="text-black">Inferior</option>
                    <option value="2" className="text-black">Decent</option>
                    <option value="3" className="text-black">Great</option>
                    <option value="4" className="text-black">Excellent</option>
                    <option value="5" className="text-black">Exceptional</option>
                  </select>
                </div>
                <div className="my-2">
                  <label htmlFor="comment" className="block text-xl mb-2">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="3"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="p-3 border border-gray-600 rounded-lg xl:w-[40rem] bg-gray-800 
                      text-white focus:ring-pink-500 focus:border-pink-500"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 
                          rounded-lg transition-colors duration-200 font-semibold mt-4"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p>
                Please <Link to="/login">sign in</Link> to write a review
              </p>
            )}
          </div>
        )}

        {/* محتوى التاب 2: All Reviews */}
        {activeTab === 2 && (
          <div className="xl:w-[50rem]"> {/* العرض الموحد والمحاذاة */}
            <div>{product.reviews.length === 0 && <p>No Reviews</p>}</div>

            <div>
              {product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-gray-800 p-6 rounded-lg w-full mb-5 border border-pink-600/50"
                >
                  <div className="flex justify-between items-center border-b 
                      border-gray-700 pb-2 mb-3">
                    <strong className="text-pink-400 text-xl">{review.name}</strong>
                    <p className="text-gray-400 text-sm">
                      {review.createdAt.substring(0, 10)}
                    </p>
                  </div>
                  <p className="my-4 text-gray-200">{review.comment}</p> {/* تم تصحيح لون النص */}
                  <Ratings value={review.rating} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* محتوى التاب 3: Related Products */}
        {activeTab === 3 && (
          <div className="xl:w-[50rem]"> {/* العرض الموحد والمحاذاة */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {!data ? (
                <Loader />
              ) : (
                data.map((product) => (
                  <div key={product._id} className="w-full">
                    <SmallProduct product={product} />
                  </div>
                ))
              )}
            </section>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;