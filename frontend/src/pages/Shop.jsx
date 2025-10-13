import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import FilterModal from "../components/FilterModal";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";


const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
    const [showFilters, setShowFilters] = useState(false);

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        // Filter products based on both checked categories and price filter
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            // Check if the product price includes the entered price filter value
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10)
            );
          }
        );

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  // Add "All Brands" option to uniqueBrands
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    // Update the price filter state when the user types in the input filed
    setPriceFilter(e.target.value);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-4">
        {/* زر فلترة للجوال فقط */}
        <div className="block md:hidden mb-4">
          <button
            className="bg-pink-600 text-white py-2 px-4 rounded-lg font-bold w-full"
            onClick={() => setShowFilters(true)}
          >
            Filter Products
          </button>
        </div>
        {/* استدعاء FilterModal للجوال فقط */}
        <FilterModal
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          categories={categories}
          uniqueBrands={uniqueBrands}
          priceFilter={priceFilter}
          handleCheck={handleCheck}
          handleBrandClick={handleBrandClick}
          handlePriceChange={handlePriceChange}
          onReset={() => window.location.reload()}
        />
        <div className="flex flex-col md:flex-row gap-6">
          {/* الفلاتر للشاشات الاكبر */}
          <div className="hidden md:block bg-gray-900 p-4 mt-2 mb-2 w-full md:w-1/5 rounded-xl shadow-2xl">
            <h2 className="h4 text-center py-3 text-white font-bold tracking-wider 
                   bg-gray-800/50 rounded-lg mb-4 border-b border-pink-600/50">
              Filter by Categories
            </h2>

            <div className="p-5 w-full">
              {categories?.map((c) => (
                <div key={c._id} className="mb-2">
                  <div className="flex items-center mr-4 mb-3">
                    <input
                      type="checkbox"
                      id="red-checkbox"
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                      className="w-4 h-4 text-pink-500 bg-gray-900 border-gray-600 rounded 
                          focus:ring-pink-500 focus:ring-offset-gray-900"
                    />

                    <label
                      htmlFor="pink-checkbox"
                      className="ml-2 text-md font-medium text-gray-200 cursor-pointer"
                    >
                      {c.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="h4 text-center py-3 text-white font-bold tracking-wider 
                   bg-gray-800/50 rounded-lg mb-4 mt-8 border-b border-pink-600/50">
              Filter by Brands
            </h2>

            <div className="p-5">
              {uniqueBrands?.map((brand) => (
                <>
                  <div className="flex items-center mr-4 mb-3" key={brand}>
                    <input
                      type="radio"
                      id={brand}
                      name="brand"
                      onChange={() => handleBrandClick(brand)}
                      className="w-4 h-4 text-pink-500 bg-gray-900 border-gray-600 rounded 
                          focus:ring-pink-500 focus:ring-offset-gray-900"
                    />

                    <label
                      htmlFor="pink-radio"
                      className="ml-2 text-md font-medium text-gray-200 cursor-pointer"
                    >
                      {brand}
                    </label>
                  </div>
                </>
              ))}
            </div>

            <h2 className="h4 text-center py-3 text-white font-bold tracking-wider 
                   bg-gray-800/50 rounded-lg mb-4 mt-8 border-b border-pink-600/50">
              Filter by Price
            </h2>

            <div className="p-5 w-full">
              <input
                type="text"
                placeholder="Enter Price"
                value={priceFilter}
                onChange={handlePriceChange}
                className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-700 
                      rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 
                      focus:border-pink-500 transition duration-200"
              />
            </div>

            <div className="p-5 pt-0">
              <button
                className="w-full py-2 bg-gray-800 text-gray-200 hover:bg-gray-700 
               rounded-lg transition duration-200 font-semibold my-4 border border-gray-700"
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="p-3 w-full md:w-4/5">
            <h2 className="text-3xl font-extrabold text-white text-center md:text-left mb-6 
                   py-2 border-b-2 border-pink-600/50">
                  <span className="text-pink-600"> Products</span>{" "}
                  {products?.length}
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start -mx-2">
              {products.length === 0 ? (
                <Loader />
              ) : (
                products?.map((p) => (
                  <div className="p-3 w-full sm:w-1/2 lg:w-1/3 px-2"
                   key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;