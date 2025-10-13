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
     <div className="mb-20 sm:mb-0">
        <AdminMenu />
      </div>
      <div className="md:w-full overflow-x-auto"> 
         <h1 className="text-3xl font-extrabold mb-6 text-white
          border-b-2 border-pink-600/50 pb-2 
         w-full max-w-full md:max-w-6xl mx-auto"> 
             Manage Orders 
          </h1>
         <div className="max-w-full md:max-w-6xl mx-auto 
         bg-gray-900 p-2 md:p-4 rounded-xl shadow-2xl border border-gray-800"
          >
        <table className="w-full border-collapse">
         

          <thead className="border-b border-pink-600/50">
            <tr className="text-white">
              <th className="px-3 py-3 text-left text-sm font-bold uppercase text-pink-500 w-16">ITEMS</th>
              <th className="px-3 py-3 text-left text-sm font-bold uppercase text-pink-500 w-32">ID</th>
              <th className="px-3 py-3 text-left text-sm font-bold uppercase text-pink-500 w-24">USER</th>
              <th className="px-3 py-3 text-left text-sm font-bold uppercase text-pink-500 w-24">DATE</th>
              <th className="px-3 py-3 text-left text-sm font-bold uppercase text-pink-500 w-20">TOTAL</th>
              <th className="px-3 py-3 text-center text-sm font-bold uppercase text-pink-500 w-24">STATUS</th>
              <th className="px-3 py-3 text-center text-sm font-bold uppercase text-pink-500 w-32">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}
               className="border-b border-gray-700 hover:bg-gray-800 transition duration-150 text-white">
                
                {/* صورة المنتج */}
                <td className="p-3">
                  <img
                    src={order.orderItems[0].image}
                    alt={order._id}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                </td>

                {/* معرف الطلب */}
                <td className="p-3 text-gray-400 text-sm font-mono">
                  {order._id.substring(0, 10)}...
                </td>

                {/* اسم المستخدم */}
                <td className="p-3 font-semibold text-white">
                  {order.user ? order.user.username : "N/A"}
                </td>

                {/* التاريخ */}
                <td className="p-3 text-gray-300 text-sm">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-CA') : "N/A"}
                </td>

                {/* المبلغ الإجمالي */}
                <td className="p-3 font-bold text-pink-400">
                  $ {order.totalPrice}
                </td>
                {/* الحالة */}
                <td className="p-3 text-center">
                  <div className="flex flex-col gap-1">
                    {/* حالة الدفع */}
                    <span className={`inline-block py-1 px-2 text-xs font-semibold rounded-full ${
                      order.isPaid 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white'
                    }`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </span>
                    
                    {/* حالة التسليم */}
                    <span className={`inline-block py-1 px-2 text-xs font-semibold rounded-full ${
                      order.isDelivered 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-orange-600 text-white'
                    }`}>
                      {order.isDelivered ? 'Delivered' : 'Shipping'}
                    </span>
                  </div>
                </td>

                {/* الإجراءات */}
                <td className="p-3 text-center">
                  <div className="flex flex-col gap-2">
                    {/* زر التفاصيل */}
                    <Link to={`/order/${order._id}`}>
                      <button className="bg-pink-600 text-white px-3 py-1 rounded-lg 
                        hover:bg-pink-700 transition duration-150 text-xs w-full">
                        Details
                      </button>
                    </Link>
                    
                    {/* زر تحديث الحالة */}
                    {(!order.isPaid || !order.isDelivered) && (
                      <button 
                        onClick={() => handleMockPaymentAndDelivery(order._id)}
                        disabled={isMockLoading}
                        className={`px-3 py-1 rounded-lg text-xs transition duration-150 w-full ${
                          isMockLoading 
                            ? 'bg-gray-500 cursor-not-allowed text-white' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
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