

const FilterModal = ({ isOpen, onClose, categories, uniqueBrands,
   priceFilter, handleCheck, handleBrandClick, handlePriceChange, onReset }) => {
  if (!isOpen) return null;

  // دوال تغلق المودال تلقائيًا عند تغيير الفلتر
  const handleCheckAndClose = (checked, id) => {
    handleCheck(checked, id);
    onClose();
  };
  const handleBrandClickAndClose = (brand) => {
    handleBrandClick(brand);
    onClose();
  };
  const handlePriceChangeAndClose = (e) => {
    handlePriceChange(e);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-80" onClick={onClose}></div>
      <div className="relative bg-gray-900 max-w-xs w-full mx-4 p-4 rounded-xl shadow-2xl 
      border-2 border-pink-700/50 z-10 overflow-y-auto max-h-[90vh]">
        <div className="sticky top-0 left-0 bg-gray-900 z-20 pb-2">
          <button
            className="text-pink-500 text-xl font-bold hover:text-pink-400 focus:outline-none"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="pt-2">
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
                    id={`cat-${c._id}`}
                    onChange={(e) => handleCheckAndClose(e.target.checked, c._id)}
                    className="w-4 h-4 text-pink-500 bg-gray-900 border-gray-600 rounded
                     focus:ring-pink-500 focus:ring-offset-gray-900"
                  />
                  <label htmlFor={`cat-${c._id}`} className="ml-2 text-md font-medium text-gray-200 
                  cursor-pointer">
                    {c.name}
                  </label>
                </div>
              </div>
            ))}
          </div>
          <h2 className="h4 text-center py-3 text-white font-bold tracking-wider bg-gray-800/50
           rounded-lg mb-4 mt-8 border-b border-pink-600/50">
            Filter by Brands
          </h2>
          <div className="p-5">
            {uniqueBrands?.map((brand) => (
              <div className="flex items-center mr-4 mb-3" key={brand}>
                <input
                  type="radio"
                  id={`brand-${brand}`}
                  name="brand"
                  onChange={() => handleBrandClickAndClose(brand)}
                  className="w-4 h-4 text-pink-500 bg-gray-900 border-gray-600 rounded 
                  focus:ring-pink-500 focus:ring-offset-gray-900"
                />
                <label htmlFor={`brand-${brand}`} className="ml-2 text-md font-medium text-gray-200 
                cursor-pointer">
                  {brand}
                </label>
              </div>
            ))}
          </div>
          <h2 className="h4 text-center py-3 text-white font-bold tracking-wider bg-gray-800/50 
          rounded-lg mb-4 mt-8 border-b border-pink-600/50">
            Filter by Price
          </h2>
          <div className="p-5 w-full">
            <input
              type="text"
              placeholder="Enter Price"
              value={priceFilter}
              onChange={handlePriceChangeAndClose}
              className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-700 
              rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500
               transition duration-200"
            />
          </div>
          <div className="p-5 pt-0">
            <button
              className="w-full py-2 bg-gray-800 text-gray-200 hover:bg-gray-700 rounded-lg
               transition duration-200 font-semibold my-4 border border-gray-700"
              onClick={onReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
