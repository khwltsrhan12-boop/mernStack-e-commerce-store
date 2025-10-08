const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  return (
    <div className="p-0">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="py-3 px-4 w-full 
          bg-gray-800 text-white border border-pink-500 rounded-lg 
          focus:ring-pink-500 focus:border-pink-500 shadow-inner outline-none"
          placeholder="Write category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="flex justify-between pt-2">
          <button className="bg-pink-600 text-white py-2 px-6
                  rounded-lg hover:bg-pink-700 transition duration-200 
                  focus:outline-none focus:ring-2 focus:ring-pink-500 
                  focus:ring-opacity-70">
            {buttonText}
          </button>

          {handleDelete && (
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white py-2 px-6
                rounded-lg hover:bg-red-700 transition duration-200 
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-70"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;