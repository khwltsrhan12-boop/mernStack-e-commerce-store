// دالة لمعالجة مسار الصورة
export function getProductImageSrc(image) {
  if (!image) return '/no-image.png';
  return image.startsWith('http') ? image : `/uploads/${image}`;
}
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import { useGetOrdersQuery, usePayDeliverMockOrderMutation }
 from "../../redux/api/orderApiSlice";
 import {toast} from 'react-toastify';

const OrderList = () => {
  const { data: orders, isLoading, error  } = useGetOrdersQuery();
  const [payDeliverMock ,{isLoading: isMockLoading}] 
    = usePayDeliverMockOrderMutation();

 const handleMockPaymentAndDelivery = async (orderId) => {
  try {
    await payDeliverMock(orderId).unwrap();
    toast.success('Order marked as Paid and Delivered');
    // RTK Query هيحدث الـ cache تلقائياً بسبب invalidatesTags

  } catch (err) {
     console.error("Mocking failed in unwrap:", err); 

     if (err.status !== 'FETCH_ERROR') {
      toast.error('Error updating order state. Please check console.');
     }else{
       toast.error(err?.data?.message || err.error || 'Connection failed.');
     }

  }
  
};

  return (
    <>
      <div className="p-2 md:p-4 min-h-screen">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="mb-4 sm:mb-0">
              <AdminMenu />
            </div>
            <div className="md:w-full">
              <h1 className="text-3xl font-extrabold mb-6 text-white border-b-2 border-pink-600/50 pb-2
               w-full max-w-full md:max-w-6xl mx-auto">
                Manage Orders
              </h1>
            
              <div className="max-w-full md:max-w-6xl mx-auto bg-gray-900 p-2 md:p-4 rounded-xl
               shadow-2xl border border-gray-800 overflow-x-auto">
                <table className="min-w-[600px] w-full border-collapse bg-transparent">
                  <thead className="border-b border-pink-600/50">
                    <tr className="text-white">
                      <th className="px-3 py-3 text-center text-sm font-bold uppercase text-pink-500 w-16">ITEMS</th>
                      <th className="px-3 py-3 text-center text-sm font-bold uppercase text-pink-500 w-32 hidden md:table-cell">ID</th>
                      <th className="px-3 py-3 text-center text-sm font-bold uppercase text-pink-500 w-24">USER</th>
                      <th className="px-3 py-3 text-center text-sm font-bold uppercase text-pink-500 w-24">DATE</th>
                      <th className="px-3 py-3 text-center text-sm font-bold uppercase text-pink-500 w-20">TOTAL</th>
                      <th className="px-3 py-3 text-center text-sm font-bold uppercase text-pink-500 w-24">STATUS</th>
                      <th className="px-3 py-3 text-center text-sm font-bold uppercase text-pink-500 w-32">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-700 hover:bg-gray-800 transition
                       duration-150 text-white text-center">
                        <td className="p-3 flex justify-center">
                          <img src={getProductImageSrc(order.orderItems[0]?.image)} alt={order._id}
                           className="w-12 h-12 object-cover rounded-md" />
                        </td>
                        <td className="p-3 text-gray-400 text-sm font-mono hidden md:table-cell">
                          {order._id.substring(0, 10)}...</td>
                        <td className="p-3 font-semibold text-white">{order.user ? order.user.username : "N/A"}</td>
                        <td className="p-3 text-gray-300 text-sm text-center whitespace-nowrap">
                          {order.createdAt 
                          ? `${new Date(order.createdAt).getDate()} ${new Date(order.createdAt).toLocaleString('en-GB',
                           { month: 'short' })} ${new Date(order.createdAt).getFullYear()}`
                          : "N/A"}</td>
                        <td className="p-3 font-bold text-pink-400 text-center">${Number(order.totalPrice).toFixed(2)}</td>
                        <td className="p-3 text-center align-middle">
                          <div className="flex flex-col gap-2 items-center w-full">
                            <span className={`w-full h-10 flex items-center justify-center text-sm 
                            md:text-base font-semibold rounded-lg
                              ${order.isPaid 
                                ? 'bg-green-600 text-white' 
                                : 'bg-red-600 text-white'}`}>
                              {order.isPaid ? 'Paid' : 'Pending'}
                            </span>
                            <span className={`w-full h-10 flex items-center justify-center text-sm 
                            md:text-base font-semibold rounded-lg
                              ${order.isDelivered 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-orange-600 text-white'}`}>
                              {order.isDelivered ? 'Delivered' : 'Shipping'}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-center align-middle">
                          <div className="flex flex-col gap-2 items-center w-full">
                            <Link to={`/order/${order._id}`} className="w-full">
                              <button className="bg-pink-600 text-white w-full h-10 rounded-lg 
                              text-sm md:text-base font-semibold hover:bg-pink-700 transition 
                              duration-150 flex items-center justify-center p-0">Details</button>
                            </Link>
                            {(!order.isPaid || !order.isDelivered) && (
                              <button
                                onClick={() => handleMockPaymentAndDelivery(order._id)}
                                disabled={isMockLoading}
                                className={`w-full h-10 rounded-lg text-sm md:text-base font-semibold 
                                  flex items-center justify-center transition duration-150 p-0
                                  ${isMockLoading 
                                    ? 'bg-gray-500 cursor-not-allowed text-white' 
                                    : 'bg-green-600 hover:bg-green-700 text-white'}`}
                              >
                                {isMockLoading ? 'Processing...' : 'Mark Complete'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderList;