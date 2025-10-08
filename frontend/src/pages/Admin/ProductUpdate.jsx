import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const ProductUpdate = () => {
  const params = useParams();

  const { data: productData } = useGetProductByIdQuery(params._id);

  console.log(productData);

  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock);


  const navigate = useNavigate();


  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();


  const [updateProduct] = useUpdateProductMutation();


  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.categories?._id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Item added successfully");
      setImage(res.image);
    } catch (err) {
      console.log(err);
      toast.error("Image upload failed. Try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      // Update product using the RTK Query mutation
      const data = await updateProduct({ productId: params._id, formData });

      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`Product successfully updated`);
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      console.log(err);
      toast.error("Product update failed. Try again.");
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      const { data } = await deleteProduct(params._id);
      toast.success(`"${data.name}" is deleted`);
      navigate("/admin/allproductslist");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed. Try again.");
    }
  };

  return (
   
    <div className=" min-h-screen p-4 md:p-8 text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">

        {/* شريط الأدمن الجانبي */}
         <div className="md:w-1/4 p-3 mb-6 md:mb-0">
          <AdminMenu />
          </div>

        {/* المحتوى الرئيسي لنموذج التعديل */}
        <div className="md:w-3/4 p-3 md:pl-8">

          {/* العنوان */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white 
                                       border-b-2 border-pink-600/50 pb-2">
              Update / Delete Product
            </h1>
          </div>

          {/* 2. قسم الصورة */}
          <div className="mb-8 p-6 bg-gray-900 rounded-lg shadow-xl">

            {/* عرض الصورة الحالية */}
            {image && (
              <div className="text-center mb-4">
                <img
                  src={image.url || image} 
                  alt="product"
                  className="block mx-auto w-full max-h-96 object-contain rounded-lg border-2 border-gray-700"
                />
              </div>
            )}

            {/* زر تحميل/تغيير الصورة */}
            <label className="border-2 border-dashed border-gray-600 
                                          text-white px-4 block w-full text-center 
                                          rounded-lg cursor-pointer font-bold py-6 
                                          hover:bg-gray-800 transition duration-200">
              {image ? (image.name || "Change Image") : "Upload Image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
              />
            </label>
          </div>

          <div className="p-0"> 
            <form onSubmit={handleSubmit}>
              {/* الصف الأول (الاسم والسعر) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                {[{ label: "Name", value: name, setter: setName, type: "text" },
                { label: "Price", value: price, setter: setPrice, type: "number" }]
                  .map((field, index) => (
                    <div key={index}>
                      <label htmlFor={field.label} className="block mb-2 text-sm font-medium text-gray-300">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        id={field.label}
                        className="w-full p-3 border border-gray-700 rounded-lg 
                                                   bg-gray-800 text-white focus:ring-pink-500 
                                                   focus:border-pink-500"
                        value={field.value}
                        onChange={(e) => field.setter(e.target.value)}
                      />
                    </div>
                  ))}
              </div>

              {/* الصف الثاني (الكمية والبراند) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                {[{ label: "Quantity", value: quantity, setter: setQuantity, type: "number" },
                { label: "Brand", value: brand, setter: setBrand, type: "text" }]
                  .map((field, index) => (
                    <div key={index}>
                      <label htmlFor={field.label} className="block mb-2 text-sm font-medium text-gray-300">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        id={field.label}
                        className="w-full p-3 border border-gray-700 rounded-lg 
                                                   bg-gray-800 text-white focus:ring-pink-500 
                                                   focus:border-pink-500"
                        value={field.value}
                        onChange={(e) => field.setter(e.target.value)}
                      />
                    </div>
                  ))}
              </div>

              {/* الوصف */}
              <div className="mb-4">
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-300">
                  Description
                </label>
                <textarea
                  id="description"
                  rows="5"
                  className="w-full p-3 border border-gray-700 rounded-lg 
                                               bg-gray-800 text-white focus:ring-pink-500 
                                               focus:border-pink-500 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              {/* الصف الثالث (المخزون والفئة) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label htmlFor="stock" className="block mb-2 text-sm font-medium text-gray-300">
                    Count In Stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    className="w-full p-3 border border-gray-700 rounded-lg 
                                                   bg-gray-800 text-white focus:ring-pink-500 
                                                   focus:border-pink-500"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-300">
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    className="w-full p-3 border border-gray-700 rounded-lg 
                                                   bg-gray-800 text-white focus:ring-pink-500 
                                                   focus:border-pink-500 appearance-none"
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

              {/* أزرار الإجراءات */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="py-3 px-8 rounded-lg text-lg font-bold 
                                               text-white bg-green-600 hover:bg-green-700 
                                               transition duration-200 flex-1"
                >
                  Update
                </button>
                <button
                  type="button" 
                  onClick={handleDelete}
                  className="py-3 px-8 rounded-lg text-lg font-bold 
                                               text-white bg-pink-600 hover:bg-pink-700 
                                               transition duration-200 flex-1"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;