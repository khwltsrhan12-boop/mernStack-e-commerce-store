import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
   FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";



const NextArrow = (props) => {
  const {className,style, onClick } = props;
  return (
    <div
      className={`${className} slick-arrow !flex items-center justify-center !w-12 !h-12 !bg-pink-600 
        hover:!bg-pink-700 rounded-full transition-all duration-300 
        z-20 cursor-pointer !right-[10px] transform -translate-y-1/2
        !top-[8rem] sm:!top-[14rem]`}
      style={{ 
        display: "flex", 
         ...style
          }} 
      onClick={onClick}
    >
      <FaChevronRight className="text-white text-lg" />
    </div>
  );
};

const PrevArrow = (props) => {
  const {className, style, onClick } = props;
  return (
    <div
  className={`${className} slick-arrow !flex items-center justify-center !w-12 !h-12 !bg-pink-600 
  hover:!bg-pink-700 rounded-full transition-all duration-300 
  z-20 cursor-pointer !left-[10px] transform -translate-y-1/2
  !top-[8rem] sm:!top-[14rem]`}
      style={{ 
         display: "flex",
          ...style
       }} 
      onClick={onClick}
    >
      <FaChevronLeft className="text-white text-lg" />
    </div>
  );
};

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />, 
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="mb-8 w-full ">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider
          {...settings}
          className="w-full  relative"
        >
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div key={_id} className="focus:outline-none">
                <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
                    
                <img
                  src={image}
                  alt={name}
                  className="w-full rounded-t-xl object-cover h-56 sm:h-72 md:h-96 xl:h-[28rem] 
                  transition duration-300 hover:opacity-90"
                />

                <div className="p-6 text-white">
                  <div className="flex justify-between items-start mb-4 ">
                    <h2  className="text-xl sm:text-2xl md:text-3xl font-extrabold text-pink-400">
                      {name}
                    </h2>

                    <div className="flex items-center justify-center gap-1 bg-pink-600 text-white 
                    font-extrabold text-lg sm:text-xl md:text-3xl rounded-full shadow-lg px-4 
                    py-1 min-w-[64px] min-h-[44px]">
                      <span>$</span>
                      <span>{price}</span>
                    </div>
                  </div>

                    <p className="text-gray-400 mb-6 w-full">
                      {description.substring(0, 170)} ...
                    </p>
                  </div>

      <div className="flex flex-col sm:flex-row justify-between flex-wrap text-gray-300 
        border-t border-gray-800 pt-4 gap-4 sm:gap-x-12 px-4 pb-4">

                    <div className="space-y-4">
                       <h1 className="flex items-center text-lg ">
                      <FaStore className="mr-3 text-pink-500" />
                      <span className="font-medium">Brand:</span> {brand}
                      </h1>

                     <h1 className="flex items-center text-lg">
                        <FaClock className="mr-3 text-pink-500" /> 
                        <span className="font-medium">Added:</span> {moment(createdAt).fromNow()}
                      </h1>

                    <h1 className="flex items-center text-lg">
                        <FaStar className="mr-3 text-pink-500" /> 
                        <span className="font-medium">Reviews:</span> {numReviews}
                    </h1>
                    </div>

                    <div className="space-y-4">
                       <h1 className="flex items-center text-lg">
                        <FaStar className="mr-3 text-pink-500" /> 
                        <span className="font-medium">Rating:</span> {Math.round(rating)}
                        </h1>

                       <h1 className="flex items-center text-lg">
                          <FaShoppingCart className="mr-3 text-pink-500" /> 
                          <span className="font-medium">Quantity:</span> {quantity}
                        </h1>


                        <h1 className="flex items-center text-lg">
                            <FaBox className="mr-3 text-pink-500" /> 
                            <span className="font-medium">In Stock:</span> {countInStock}
                        </h1>
                    </div>     
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;