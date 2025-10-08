import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="text-white bg-red-800 p-4 rounded-lg m-10">
        Error loading products. Please check the API connection.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 text-white">
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        
        {/* شريط الأدمن الجانبي */}
        <div className="md:w-1/4 p-3 mb-6 md:mb-0">
          <AdminMenu />
        </div>

        {/* قائمة المنتجات الرئيسية */}
        <div className="md:w-3/4 p-4 flex flex-col items-center">
          
          {/* العنوان */}
          <div className="mb-8 w-full max-w-5xl">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white 
                           border-b-2 border-pink-600/50 pb-2">
              All Products ({products.length})
            </h1>
          </div>

           <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> 
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/admin/product/update/${product._id}`}
                className="block h-full"
              >
                <div 
                  className="flex bg-gray-900 rounded-xl shadow-lg 
                             overflow-hidden transition duration-300 h-full 
                             hover:shadow-pink-500/20 hover:border-pink-600 border border-gray-800"
                >
                  
                  {/*الصورة */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-32 h-32 object-cover flex-shrink-0" 
                  />
                  
                  {/* التفاصيل */}
                  <div className="p-4 flex flex-col justify-between w-full">
                    
                    {/* الاسم والسعر والتاريخ*/}
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-1">
                      <h5 className="text-lg font-semibold text-white mb-1 sm:mb-0 truncate max-w-[70%]">
                        {product?.name}
                      </h5>
                      <p className="text-lg font-extrabold text-pink-500 flex-shrink-0">
                        $ {product?.price}
                      </p>
                    </div>

                    {/* الوصف */}
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                      {product?.description?.substring(0, 100)}... 
                    </p>
                    
                    {/* زر التحديث والتاريخ */}
                    <div className="flex justify-between items-center mt-auto">
                        <Link
                            to={`/admin/product/update/${product._id}`}
                            className="inline-flex items-center px-3 py-1 
                                       text-sm font-medium text-center text-white 
                                       bg-pink-600 rounded-lg hover:bg-pink-700 
                                       transition duration-200"
                        >
                            Update Product
                        </Link>
                        <p className="text-gray-400 text-xs flex-shrink-0">
                            {moment(product.createdAt).format("MMM Do, YYYY")}
                        </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
</div>
  );
};

export default AllProducts;