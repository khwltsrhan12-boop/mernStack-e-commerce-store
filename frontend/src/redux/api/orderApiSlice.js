import {apiSlice} from './apiSlice.js';
import {ORDERS_URL}  from '../constants.js';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: order,
      }),
    }),
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    payOrder: builder.mutation({
      query: ({orderId, details}) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT',
        body: details,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        'OrdersList'
      ],
    }),

    /*  getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
    }), */
   
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),

    getOrders : builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      providesTags: ['OrdersList'],
    }),

    getTotalOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/total-orders`,
      }),
      keepUnusedDataFor: 5,
    }),

    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, orderId) => [
        { type: 'Order', id: orderId },
        'OrdersList'
      ],
    }),

     payDeliverMockOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/pay-deliver-mock`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, orderId) => [
        { type: 'Order', id: orderId },
        'OrdersList'
      ],
    }),

    getTotalSales: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/total-sales`,
      }),
    }),

    getTotalSalesByDate: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/total-sales-by-date`,
      }),
    }),


     getSalesByMonth: builder.query({
        query: () => ({
            url: `${ORDERS_URL}/sales-by-month`, 
            method: "GET",
        }),
        providesTags: ["Order"], 
        keepUnusedDataFor: 60,
    }),
 }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetMyOrdersQuery,
  useGetTotalOrdersQuery,
  useDeliverOrderMutation,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
  useGetOrdersQuery,
  usePayDeliverMockOrderMutation,
  //useGetPaypalClientIdQuery,
  useGetSalesByMonthQuery,
} = orderApiSlice;