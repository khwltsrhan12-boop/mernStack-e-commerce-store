import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="p-4 min-h-screen text-white">
      <div className="max-w-6xl mx-auto bg-gray-900 p-6
       rounded-xl shadow-2xl border border-gray-800">
      <h2 className="text-3xl font-extrabold mb-6
       text-white border-b-2 border-pink-600/50 pb-2">
        My Orders
      </h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : (
        <>
          {/* جدول الطلبات للشاشات الكبيرة */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800 text-pink-400">
                <tr>
                  <th className="py-4 px-4 text-left text-sm font-bold uppercase w-24">IMAGE</th>
                  <th className="py-4 px-4 text-left text-sm font-bold uppercase w-32">ORDER ID</th>
                  <th className="py-4 px-4 text-left text-sm font-bold uppercase w-28">DATE</th>
                  <th className="py-4 px-4 text-left text-sm font-bold uppercase w-24">TOTAL</th>
                  <th className="py-4 px-4 text-center text-sm font-bold uppercase w-24">PAYMENT</th>
                  <th className="py-4 px-4 text-center text-sm font-bold uppercase w-28">DELIVERY</th>
                  <th className="py-4 px-4 text-center text-sm font-bold uppercase w-32">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-white">
                {orders.map((order) => (
                  <tr key={order._id}
                    className="hover:bg-gray-800/70 hover:shadow-lg transition-all duration-200
                     border-l-4 border-l-transparent hover:border-l-pink-500">
                    <td className="py-4 px-4 whitespace-nowrap">
                      <img
                        src={order.orderItems[0].image}
                        alt={order.user}
                        className="w-20 h-20 object-cover rounded-lg border-2 border-gray-600 
                        shadow-md hover:border-pink-500 transition-colors duration-200"
                      />
                    </td>
                    <td className="py-4 px-4 text-sm whitespace-nowrap text-gray-400 font-mono">
                      {order._id.substring(0, 10)}...
                    </td>
                    <td className="py-4 px-4 text-sm whitespace-nowrap text-gray-300">
                      <div className="flex flex-col">
                        <span className="font-medium">{new Date(order.createdAt).toLocaleDateString('en-CA')}</span>
                        <span className="text-xs text-gray-500">{new Date(order.createdAt)
                        .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm whitespace-nowrap">
                      <span className="text-lg font-bold text-pink-400 bg-pink-400/10 px-3 py-1 rounded-lg">
                        $ {order.totalPrice}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      {order.isPaid ? (
                        <span className="inline-flex items-center px-3 py-2 text-xs font-bold 
                        text-white bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-md">
                          ✅ Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-2 text-xs font-bold
                         text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-md">
                          ❌ Pending
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      {order.isDelivered ? (
                        <span className="inline-flex items-center px-3 py-2 text-xs font-bold text-white
                         bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-md">
                          🚚 Delivered
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-2 text-xs font-bold text-white
                         bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-md">
                          📦 Shipping
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <Link to={`/order/${order._id}`}>
                        <button className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2.5
                         px-5 rounded-lg hover:from-pink-600 hover:to-pink-700 transform hover:scale-105 
                         transition-all duration-200 shadow-lg font-semibold">
                          📄 View Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* بطاقات الطلبات للجوال فقط */}
          <div className="sm:hidden flex flex-col gap-4 mt-2">
            {orders.map((order) => (
              <div key={order._id} className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-4">
                <div className="flex gap-3 items-center mb-2">
                  <img src={order.orderItems[0].image} alt={order.user} 
                  className="w-16 h-16 object-cover rounded-lg border-2 border-gray-600 shadow-md" />
                  <div>
                    <div className="text-xs text-gray-400 font-mono">{order._id.substring(0, 10)}...</div>
                    <div className="text-sm text-gray-300 font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-CA')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt)
                      .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="block text-base font-bold text-pink-400 bg-pink-400/10 px-3 
                  py-1 rounded-lg mb-2">$ {order.totalPrice}</span>
                  <div className="flex flex-row gap-2 items-center">
                    {order.isPaid ? (
                      <span className="inline-flex items-center px-3 py-2 text-xs font-bold 
                      text-white bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-md">✅ Paid</span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-2 text-xs font-bold text-white 
                      bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-md">❌ Pending</span>
                    )}
                    {order.isDelivered ? (
                      <span className="inline-flex items-center px-3 py-2 text-xs font-bold text-white 
                      bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-md">🚚 Delivered</span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-2 text-xs font-bold text-white
                       bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-md">📦 Shipping</span>
                    )}
                  </div>
                </div>
                <Link to={`/order/${order._id}`}>
                  <button className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2 w-full 
                  rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200 shadow-lg
                   font-semibold">
                    📄 View Details
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
    </div>
  );
};

export default UserOrder;

