import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  //useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
  useGetSalesByMonthQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  //const { data: salesDetail } = useGetTotalSalesByDateQuery();
   const { data: salesDetail } = useGetSalesByMonthQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
        background: 'transparent',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      theme: {
        mode: 'dark'
      },
      tooltip: {
        theme: "dark",
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (val) {
            return "$" + val.toFixed(2)
          }
        }
      },
      colors: ["#EC4899"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 4,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#8B5CF6'],
          shadeIntensity: 1,
          type: 'vertical',
          opacityFrom: 0.8,
          opacityTo: 0.1,
        }
      },
      grid: {
        borderColor: "#374151",
        strokeDashArray: 3,
      },
      markers: {
        size: 6,
        colors: ["#EC4899"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 8
        }
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: "#9CA3AF",
            fontSize: '12px'
          }
        },
        axisBorder: {
          color: "#374151"
        },
        axisTicks: {
          color: "#374151"
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: "#9CA3AF",
            fontSize: '12px'
          },
          formatter: function (val) {
            return "$" + val.toFixed(0)
          }
        },
        min: 0,
      },
    },
    series: [{ name: "Revenue", data: [] }],
  });

  useEffect(() => {
    if (salesDetail  && salesDetail.length > 0) {
      const formattedSalesDate = salesDetail.map((item) => ({
        //x: item._id,
        //y: item.totalSales,
         x: item.formattedDate,
         y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
            title: { text: "Month" },
          },
        },

        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

return (
   
  <div className="p-2 md:p-4 min-h-screen"> 
      <div className="flex flex-col md:flex-row md:space-x-8"> 
        <div className="mb-16 sm:mb-0">
        <AdminMenu />
        </div> 
        <section className="md:w-full">
        <h1 className="text-3xl font-extrabold mb-8 text-white border-b-2 border-pink-600/50 pb-2
         max-w-full md:max-w-6xl mx-auto">
            Admin Dashboard
        </h1>           
        {/* Grid الإحصائيات الرئيسية */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 
           max-w-full md:max-w-6xl mx-auto">
           
          {/* بطاقة إجمالي المبيعات */}
          <div className="rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 p-6 shadow-xl
             text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                  <div>
                      <p className="text-pink-100 text-sm font-medium">💰 Total Revenue</p>
                      <h1 className="text-3xl font-bold mt-2">
                          {isLoading
                           ? <div className="animate-pulse bg-pink-300 h-8 w-24 rounded"></div>
                           : `$${sales?.totalSales ? sales.totalSales.toFixed(2) : '0.00'}`}
                      </h1>
                      <p className="text-pink-100 text-xs mt-1">+12% from last month</p>
                  </div>
                  <div className="text-4xl opacity-20">💵</div>
              </div>
          </div>

          {/* بطاقة إجمالي العملاء */}
          <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-xl 
            text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                  <div>
                      <p className="text-blue-100 text-sm font-medium">👥 Total Customers</p>
                      <h1 className="text-3xl font-bold mt-2">
                          {loading 
                          ? <div className="animate-pulse bg-blue-300 h-8 w-16 rounded"></div> 
                          : customers?.length || 0}
                      </h1>
                      <p className="text-blue-100 text-xs mt-1">+5 new this week</p>
                  </div>
                  <div className="text-4xl opacity-20">👨‍👩‍👧‍👦</div>
              </div>
          </div>

          {/* بطاقة إجمالي الطلبات */}
          <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-6 shadow-xl 
            text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                  <div>
                      <p className="text-green-100 text-sm font-medium">📦 Total Orders</p>
                      <h1 className="text-3xl font-bold mt-2">
                          {loadingTwo 
                          ? <div className="animate-pulse bg-green-300 h-8 w-16 rounded"></div> 
                          : orders?.totalOrders || 0}
                      </h1>
                      <p className="text-green-100 text-xs mt-1">+8 orders today</p>
                  </div>
                  <div className="text-4xl opacity-20">🛒</div>
              </div>
          </div>

          {/* بطاقة متوسط قيمة الطلب */}
          <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 shadow-xl text-white
             transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                  <div>
                      <p className="text-purple-100 text-sm font-medium">📊 Avg Order Value</p>
                      <h1 className="text-3xl font-bold mt-2">
                          {(isLoading || loadingTwo) ? (
                              <div className="animate-pulse bg-purple-300 h-8 w-20 rounded"></div>
                          ) : (
                              `$${sales?.totalSales && orders?.totalOrders 
                                  ? (sales.totalSales / orders.totalOrders).toFixed(2) 
                                  : '0.00'}`
                          )}
                      </h1>
                      <p className="text-purple-100 text-xs mt-1">+3% improvement</p>
                  </div>
                  <div className="text-4xl opacity-20">📈</div>
              </div>
          </div>
      </div>

      {/* مخطط المبيعات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 max-w-full md:max-w-6xl mx-auto">
          
          {/* المخطط الرئيسي */}
          <div className="lg:col-span-2 bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                  <div>
                      <h2 className="text-xl font-bold text-white">📈 Sales Analytics</h2>
                      <p className="text-gray-400 text-sm">Monthly revenue trends</p>
                  </div>
                  <div className="flex space-x-2">
                      <span className="px-3 py-1 bg-pink-600 text-white text-xs rounded-full">Last 6 Months</span>
                  </div>
              </div>
              <div className="w-full" style={{minHeight: '350px'}}>
                  <Chart
                      options={state.options}
                      series={state.series}
                      type="line"
                      height={350}
                  />
              </div>
          </div>

          {/* إحصائيات جانبية */}
          <div className="space-y-4">
              {/* أفضل الأشهر */}
              <div className="bg-gray-900 p-4 rounded-xl shadow-xl border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-3">🏆 Best Performance</h3>
                  <div className="space-y-3">
                      <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-sm">Highest Month:</span>
                          <span className="text-green-400 font-bold">{salesDetail && salesDetail.length > 0 ? 
                              salesDetail.reduce((max, item) => item.totalSales > max.totalSales ? item : max).formattedDate 
                              : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-sm">Peak Sales:</span>
                          <span className="text-green-400 font-bold">${salesDetail && salesDetail.length > 0 ? 
                              salesDetail.reduce((max, item) => item.totalSales > max.totalSales ? item : max)
                                          .totalSales.toFixed(2)
                              : '0.00'}</span>
                      </div>
                  </div>
              </div>

              {/* إحصائيات سريعة */}
              <div className="bg-gray-900 p-4 rounded-xl shadow-xl border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-3">⚡ Quick Stats</h3>
                  <div className="space-y-3">
                      <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-sm">Growth Rate:</span>
                          <span className="text-blue-400 font-bold">+15.3%</span>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-sm">Active Users:</span>
                          <span className="text-purple-400 font-bold">{customers
                           ? Math.floor(customers.length * 0.8)
                          : 0}
                          </span>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-sm">Conversion Rate:</span>
                          <span className="text-pink-400 font-bold">23.4%</span>
                      </div>
                  </div>
              </div>

              {/* تنبيهات */}
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-xl shadow-xl text-white">
                  <h3 className="text-lg font-semibold mb-2">🔔 Alerts</h3>
                  <p className="text-sm opacity-90">Low inventory on 3 products</p>
                  <button className="mt-2 px-3 py-1 bg-white bg-opacity-20 rounded text-xs hover:bg-opacity-30 transition">
                      View Details
                  </button>
              </div>
          </div>
      </div>

      {/* قسم الطلبات الأخيرة */}
      <div className="max-w-full md:max-w-6xl mx-auto">
          <div className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                  <div>
                      <h2 className="text-2xl font-bold text-white">📋 Recent Orders</h2>
                      <p className="text-gray-400 text-sm">Latest customer orders and transactions</p>
                  </div>
                  <div className="flex space-x-3">
                      <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition 
                        text-sm font-medium">
                          📊 View All
                      </button>
                      <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600
                         transition text-sm font-medium">
                          📤 Export
                      </button>
                  </div>
              </div>
              <OrderList /> 
          </div>
      </div>

    </section>
   </div>
</div>
);
};

export default AdminDashboard;