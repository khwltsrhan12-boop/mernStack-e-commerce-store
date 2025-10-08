import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };


  return (
  <div className="p-2 md:p-4 min-h-screen">

   <div className="flex flex-col md:flex-row md:space-x-8">
        <AdminMenu />
    <div className="md:w-full overflow-x-auto">

    <div className="max-w-full md:max-w-6xl mx-auto 
      bg-gray-900 p-4 md:p-6 rounded-xl shadow-2xl border border-gray-800">
       <h1 className="text-3xl font-extrabold mb-8 text-white border-b-2 border-pink-600/50 pb-2">
          Create / Update Product
        </h1>

      {imageUrl && (
        <div className="text-center mb-6">
          <img
            src={imageUrl}
            alt="product"
            className="block mx-auto max-h-[250px] object-cover rounded-xl border border-gray-700"
          />
        </div>
      )}

      <div className="mb-6">
        <label
          className="border-2 border-dashed border-pink-600/70 
          text-pink-400 block w-full text-center rounded-lg 
          cursor-pointer font-bold py-10 transition duration-200 
          hover:bg-gray-800"
        >
          {image ? image.name : "Click to Upload Image"}

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={uploadFileHandler}
            className="hidden"
                />
            </label>
            </div>
            <div className="pt-2">

             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
              <div>
                <label htmlFor="name" className="text-white mb-1 block">Name</label>
                <input
                  type="text"
                  className="p-3 w-full border rounded-lg bg-gray-800 text-white border-gray-700 
                                              focus:border-pink-500 focus:ring-pink-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="price" className="text-white mb-1 block">Price</label>
                <input
                  type="number"
                  className="p-3 w-full border rounded-lg bg-gray-800 text-white border-gray-700 
                                              focus:border-pink-500 focus:ring-pink-500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                <div>
                  <label htmlFor="quantity" className="text-white mb-1 block">Quantity</label>
                  <input
                    type="number"
                    className="p-3 w-full border rounded-lg bg-gray-800 text-white border-gray-700 
                                               focus:border-pink-500 focus:ring-pink-500"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="brand" className="text-white mb-1 block">Brand</label>
                  <input
                    type="text"
                    className="p-3 w-full border rounded-lg bg-gray-800 text-white border-gray-700 
                                               focus:border-pink-500 focus:ring-pink-500"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="text-white my-1 block">Description</label>
                <textarea
                  type="text"
                  rows="5"
                  className="p-3 w-full border rounded-lg bg-gray-800 text-white border-gray-700 
                   focus:border-pink-500 focus:ring-pink-500 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                <div>
                  <label htmlFor="stock" className="text-white mb-1 block">Count In Stock</label>
                  <input
                    type="text"
                    className="p-3 w-full border rounded-lg bg-gray-800 text-white border-gray-700 
                                               focus:border-pink-500 focus:ring-pink-500"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="category" className="text-white mb-1 block">Category</label>
                  <select
                    value={category}
                   
                    className="p-3 w-full border rounded-lg bg-gray-800 text-white border-gray-700 
                    focus:border-pink-500 focus:ring-pink-500 appearance-none"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Choose Category</option>
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

          
              <button
                onClick={handleSubmit}
                className="py-3 px-8 mt-5 rounded-lg text-lg font-bold text-white 
                 bg-pink-600 hover:bg-pink-700 transition duration-200"
              >
                Submit
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;