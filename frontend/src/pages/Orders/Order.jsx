import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  //useGetPaypalClientIdQuery,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  // حالات محلية للتحديث الفوري في الواجهة
  const [localOrderState, setLocalOrderState] = useState({
    isPaid: false,
    paidAt: null,
    isDelivered: false,
    deliveredAt: null
  });

  // تحديث الحالة المحلية عند تحميل البيانات
  useEffect(() => {
    if (order) {
      setLocalOrderState({
        isPaid: order.isPaid,
        paidAt: order.paidAt,
        isDelivered: order.isDelivered,
        deliveredAt: order.deliveredAt
      });
    }
  }, [order]);
/*
  const {
    data: paypal,
    isLoading: loadingPaPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();
   */


  useEffect(() => {
    //if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadingPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
           // "client-id":paypal?.clientId 
            "client-id": "test",
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadingPayPalScript();
        }
      }
    //}
  }, [ order, paypalDispatch
    //, paypal, loadingPayPal, errorPayPal
  ]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    try {
      // تحديث فوري للواجهة
      const currentTime = new Date().toISOString();
      setLocalOrderState(prev => ({
        ...prev,
        isDelivered: true,
        deliveredAt: currentTime
      }));
      
      toast.success("🚚 Order Marked as Delivered!");
      
      
      // RTK Query هيحدث الـ cache تلقائياً بسبب invalidatesTags
      await deliverOrder(orderId);
    } catch (error) {
      // إذا فشلت العملية، إرجاع الحالة كما كانت
      setLocalOrderState(prev => ({
        ...prev,
        isDelivered: false,
        deliveredAt: null
      }));
      toast.error(error?.data?.message || error.message);
    }
  };

  const handleTestPayment = async () => {
    try {
      // تحديث فوري للواجهة
      const currentTime = new Date().toISOString();
      setLocalOrderState(prev => ({
        ...prev,
        isPaid: true,
        paidAt: currentTime
      }));
      
      toast.success("💳 Test Payment Confirmed!");
      
      // إرسال التحديث للسيرفر في الخلفية
      // RTK Query هيحدث الـ cache تلقائياً بسبب invalidatesTags
      await payOrder({ orderId, details: { id: "test_payment" } });
    } catch (error) {
      // إذا فشلت العملية، إرجاع الحالة كما كانت
      setLocalOrderState(prev => ({
        ...prev,
        isPaid: false,
        paidAt: null
      }));
      toast.error(error?.data?.message || error.message);
    }
  };

 return isLoading ? (
    <Loader />
) : error ? (
    <Message variant="danger">{error.data.message}</Message>
) : (
    <div className="w-full max-w-7xl mx-auto p-4 mt-6">
        {/* شريط تقدم الطلب */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-800 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Order Progress</h2>
            <div className="flex items-center justify-between">
                {/* المرحلة 1: الطلب */}
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mb-2">
                        <span className="text-white font-bold">✓</span>
                    </div>
                    <span className="text-green-400 text-sm font-semibold">Order Placed</span>
                </div>
                
                {/* خط الاتصال 1 */}
                <div className={`flex-1 h-1 mx-4 transition-colors duration-500
                 ${localOrderState.isPaid 
                    ? 'bg-green-600'
                    : 'bg-gray-600'}`}></div>
                
                {/* المرحلة 2: الدفع */}
                <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2
                     transition-all duration-500 ${
                        localOrderState.isPaid ? 'bg-green-600 scale-110' : 'bg-gray-600'
                    }`}>
                        <span className="text-white font-bold">{localOrderState.isPaid ? '✓' : '💳'}</span>
                    </div>
                    <span className={`text-sm font-semibold ${
                        localOrderState.isPaid ? 'text-green-400' : 'text-gray-400'
                    }`}>Payment</span>
                </div>
                
                {/* خط الاتصال 2 */}
                <div className={`flex-1 h-1 mx-4 transition-colors duration-500
                     ${localOrderState.isDelivered 
                     ? 'bg-green-600'
                    : 'bg-gray-600'}`}></div>
                
                {/* المرحلة 3: التسليم */}
                <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
                    transition-all duration-500 ${
                        localOrderState.isDelivered ? 'bg-green-600 scale-110' : 'bg-gray-600'
                    }`}>
                        <span className="text-white font-bold">{localOrderState.isDelivered ? '✓' : '📦'}</span>
                    </div>
                    <span className={`text-sm font-semibold ${
                        localOrderState.isDelivered ? 'text-green-400' : 'text-gray-400'
                    }`}>Delivered</span>
                </div>
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
        
        {/* العمود الأيسر: تفاصيل المنتجات */}
        <div className="md:w-2/3">
            <h1 className="text-3xl font-extrabold mb-6 text-white border-b-2 border-gray-700 pb-2">
                Order Items
            </h1>

            {/* بطاقة جدول المنتجات */}
        <div className="bg-gray-900 p-2 sm:p-6 rounded-xl shadow-2xl border border-gray-800">
                {order.orderItems.length === 0 ? (
                        <Message>Order is empty</Message>
                ) : (
                        <>
                            {/* للجوال: بطاقات عمودية */}
                            <div className="block sm:hidden">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex flex-col gap-2 mb-4 p-2 rounded-lg border border-gray-800 bg-gray-950">
                                        <div className="flex items-center gap-2 mb-2">
                                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                                            <Link to={`/product/${item.product}`} className="text-white text-sm font-semibold hover:text-pink-400">
                                                {item.name}
                                            </Link>
                                        </div>
                                        <div className="flex flex-wrap justify-between text-xs text-gray-300">
                                            <span>Quantity: <span className="text-white font-bold">{item.qty}</span></span>
                                            <span>Unit Price: <span className="text-white">$ {item.price.toFixed(2)}</span></span>
                                            <span>Total: <span className="text-pink-400 font-bold">
                                                $ {(item.qty * item.price).toFixed(2)}</span></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* للديسكتوب: جدول */}
                            <div className="hidden sm:block">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead className="border-b border-pink-600/50">
                                            <tr>
                                                <th className="p-3 text-left text-sm font-bold uppercase text-pink-500">Image</th>
                                                <th className="p-3 text-left text-sm font-bold uppercase text-pink-500">Product</th>
                                                <th className="p-3 text-center text-sm font-bold uppercase text-pink-500">Quantity</th>
                                                <th className="p-3 text-right text-sm font-bold uppercase text-pink-500">Unit Price</th>
                                                <th className="p-3 text-right text-sm font-bold uppercase text-pink-500">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.orderItems.map((item, index) => (
                                                <tr 
                                                    key={index}
                                                    className="border-b border-gray-700 last:border-b-0 hover:bg-gray-800 transition duration-150"
                                                >
                                                    <td className="p-3">
                                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                                                    </td>
                                                    <td className="p-3">
                                                        <Link to={`/product/${item.product}`} className="text-white hover:text-pink-400 
                                                        font-semibold">
                                                            {item.name}
                                                        </Link>
                                                    </td>
                                                    <td className="p-3 text-center text-white">{item.qty}</td>
                                                    <td className="p-3 text-right text-gray-300">$ {item.price.toFixed(2)}</td>
                                                    <td className="p-3 text-right font-bold text-pink-400">
                                                        $ {(item.qty * item.price).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                )}
        </div>
            
            {/* حالة التوصيل */}
            <div className="mt-8">
                <h2 className="text-xl font-bold text-white mb-3 border-b border-gray-700 pb-2">Delivery Status</h2>
                {localOrderState.isDelivered ? (
                    <div className="p-4 rounded-lg bg-blue-100 border border-blue-300">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                            <div>
                                <p className="text-blue-800 font-semibold">🚚 Order Delivered</p>
                                <p className="text-blue-600 text-sm">
                                    Delivered on {new Date(localOrderState.deliveredAt || order.deliveredAt)
                                                    .toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 rounded-lg bg-orange-100 border border-orange-300">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
                            <div>
                                <p className="text-orange-800 font-semibold">📦 Preparing for Delivery</p>
                                <p className="text-orange-600 text-sm">
                                    {localOrderState.isPaid ? 
                                        "Your order is being prepared and will be shipped soon" : 
                                        "Order will be prepared after payment confirmation"
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
        </div>

        {/* العمود الأيمن: ملخص الطلب */}
        <div className="md:w-1/3 mt-6 md:mt-0">
            
            {/* بطاقة الشحن والدفع (Shipping & Payment) */}
            <div className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-800 mb-8 space-y-4">
                <h2 className="text-xl font-bold text-white mb-3 border-b border-pink-600/50 pb-2">
                    Shipping & Payment
                </h2>
                
                {/* تفاصيل الشحن */}
                <div className="flex flex-col gap-1">
                  <span className="text-gray-300"><strong className="text-pink-500">Name:</strong> {order.user.username}</span>
                  <span className="text-gray-300"><strong className="text-pink-500">Email:</strong> {order.user.email}</span>
                  <span className="text-gray-300"><strong className="text-pink-500">Address:</strong>
                   {order.shippingAddress.address}, 
                   {order.shippingAddress.city} {order.shippingAddress.postalCode},
                    {order.shippingAddress.country}</span>
                </div>

                {/* طريقة الدفع */}
                                <div className="text-gray-300 pt-4 border-t border-gray-700 flex flex-col">
                                    <span><strong className="text-pink-500">Method:</strong> {order.paymentMethod}</span>
                                </div>
                
                {/* حالة الدفع */}
                <div className="mt-4">
                    {localOrderState.isPaid ? (
                        <div className="p-3 rounded-lg bg-green-100 border border-green-300">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                <div>
                                    <p className="text-green-800 font-semibold">✅ Payment Confirmed</p>
                                    <p className="text-green-600 text-sm">
                                        Paid on {new Date(localOrderState.paidAt || order.paidAt)
                                        .toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-3 rounded-lg bg-red-100 border border-red-300">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                                <div>
                                    <p className="text-red-800 font-semibold">❌ Payment Pending</p>
                                    <p className="text-red-600 text-sm">Payment is required to process this order</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* بطاقة ملخص الأسعار (Order Summary) */}
            <div className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-800 space-y-3">
                <h2 className="text-xl font-bold text-white mb-3 border-b border-pink-600/50 pb-2">
                    Order Summary
                </h2>

            <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between items-center">
                    <span className="text-gray-400">Items:</span>
                    <span className="text-white">$ {order.itemsPrice}</span>
                </div>
                <div className="flex flex-row justify-between items-center">
                    <span className="text-gray-400">Shipping:</span>
                    <span className="text-white">$ {order.shippingPrice}</span>
                </div>
                <div className="flex flex-row justify-between items-center">
                    <span className="text-gray-400">Tax:</span>
                    <span className="text-white">$ {order.taxPrice}</span>
                </div>
                <div className="flex flex-row justify-between items-center pt-4 border-t border-gray-700">
                    <span className="text-2xl font-extrabold text-white">Total:</span>
                    <span className="text-2xl font-extrabold text-pink-500">$ {order.totalPrice}</span>
                </div>
                </div>
            </div>

            {/* منطقة الدفع وزر Admin */}
            <div className="mt-6">
                
                {/* منطق الدفع */}
                {!localOrderState.isPaid && (
                    <div className="mt-4">
                        {order.paymentMethod === "PayPal" ? (
                            // ... (PayPal integration code)
                            <div>
                                {loadingPay && <Loader />}{" "}
                                {isPending ? (
                                    <Loader />
                                ) : (
                                    <PayPalButtons
                                        createOrder={createOrder}
                                        onApprove={onApprove}
                                        onError={onError}
                                    ></PayPalButtons>
                                )}
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleTestPayment}
                                disabled={loadingPay}
                                className={`w-full py-3 rounded-lg text-lg font-bold transition duration-200 shadow-lg ${
                                    loadingPay 
                                        ? 'bg-gray-500 cursor-not-allowed' 
                                        : 'bg-pink-600 hover:bg-pink-700'
                                } text-white`}
                            >
                                {loadingPay ? '💳 Processing Payment...' : '💳 Confirm Test Payment'}
                            </button>
                        )}
                    </div>
                )}
                
                {loadingPay && <Loader />}
                {loadingDeliver && <Loader />}

                {/* زر مسؤول التوصيل */}
                {userInfo && userInfo.isAdmin && localOrderState.isPaid && !localOrderState.isDelivered && (
                    <div className="mt-4">
                        <button
                            type="button"
                            className="bg-green-600 text-white w-full py-3 rounded-lg text-lg font-bold 
                                       hover:bg-green-700 transition duration-200 shadow-lg"
                            onClick={deliverHandler}
                        >
                            Mark As Delivered
                        </button>
                    </div>
                )}
            </div>
        </div>
        </div>
    </div>
);
};

export default Order;

