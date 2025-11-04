import  { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Eye
} from 'lucide-react';
const URL = import.meta.env.VITE_BACKEND_URL

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${URL}/api/orders`);
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.patch(`${URL}/api/orders/${orderId}/status`, { status });
      fetchOrders(); 
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status: ' + (error.response?.data?.message || error.message));
    }
  };

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      await axios.patch(`${URL}/api/orders/${orderId}/payment`, { 
        paymentStatus,
        method: 'card'
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Error updating payment status: ' + (error.response?.data?.message || error.message));
    }
  };

  const viewOrderDetails = async (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'Out for Delivery':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'In Kitchen':
        return <Package className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Kitchen':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Received':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Order Management</h1>
        <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm border">
          Total Orders: <span className="font-semibold text-blue-600">{orders.length}</span>
        </div>
      </div>

      <div className="hidden lg:block bg-white rounded-lg shadow-md border overflow-hidden">
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Order ID</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Items</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Payment</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-mono text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <p className="font-medium text-sm">{order.user?.name || 'Guest'}</p>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{order.user?.email || 'No email'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="max-w-xs space-y-1">
                        {order.pizzas?.slice(0, 2).map((pizza, index) => (
                          <div key={index} className="text-sm flex justify-between">
                            <span className="truncate">
                              {pizza.pizzaId?.name || 'Custom Pizza'}
                            </span>
                            <span className="font-medium ml-2">
                              x{pizza.quantity || 1}
                            </span>
                          </div>
                        ))}
                        {order.pizzas?.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{order.pizzas.length - 2} more items
                          </div>
                        )}
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="text-blue-600 text-xs hover:text-blue-700 mt-1 flex items-center space-x-1"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-900">₹{order.totalPrice}</div>
                      <div className="text-xs text-gray-500">
                        {order.pizzas?.length} item{order.pizzas?.length > 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentInfo?.status)}`}>
                          {order.paymentInfo?.status || 'pending'}
                        </span>
                        <div className="text-xs text-gray-500 capitalize">
                          {order.paymentInfo?.method}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-2 min-w-[140px]">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Received">Received</option>
                          <option value="In Kitchen">In Kitchen</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        
                        <select
                          value={order.paymentInfo?.status || 'pending'}
                          onChange={(e) => updatePaymentStatus(order._id, e.target.value)}
                          className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="pending">Payment Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No orders found.</p>
            <p className="text-gray-500 text-sm">Orders will appear here when customers place them.</p>
          </div>
        )}
      </div>

      <div className="lg:hidden space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md border p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-mono text-sm font-semibold text-gray-800">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => toggleOrderExpansion(order._id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {expandedOrder === order._id ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Customer</p>
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3 text-gray-400" />
                    <p className="text-sm font-medium truncate">{order.user?.name || 'Guest'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Amount</p>
                  <p className="text-sm font-semibold">₹{order.totalPrice}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(order.status)}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Payment</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentInfo?.status)}`}>
                    {order.paymentInfo?.status || 'pending'}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Items</p>
                <div className="space-y-1">
                  {order.pizzas?.slice(0, 2).map((pizza, index) => (
                    <div key={index} className="text-sm flex justify-between">
                      <span className="truncate flex-1">
                        {pizza.pizzaId?.name || 'Custom Pizza'}
                      </span>
                      <span className="font-medium ml-2">
                        x{pizza.quantity || 1}
                      </span>
                    </div>
                  ))}
                  {order.pizzas?.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{order.pizzas.length - 2} more items
                    </div>
                  )}
                </div>
              </div>

              {expandedOrder === order._id && (
                <div className="border-t pt-3 space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Customer Details</p>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span>{order.user?.email || 'No email'}</span>
                      </div>
                      {order.deliveryAddress?.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span>{order.deliveryAddress.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {order.deliveryAddress && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                      <div className="text-sm space-y-1">
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-3 w-3 text-gray-400 mt-0.5" />
                          <div>
                            <p>{order.deliveryAddress.street}</p>
                            <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
                            <p>{order.deliveryAddress.zipCode}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {order.specialInstructions && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Special Instructions</p>
                      <p className="text-sm bg-yellow-50 border border-yellow-200 rounded p-2">
                        {order.specialInstructions}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="w-full text-sm border border-gray-300 rounded px-2 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Placed">Placed</option>
                      <option value="Received">Received</option>
                      <option value="In Kitchen">In Kitchen</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    
                    <select
                      value={order.paymentInfo?.status || 'pending'}
                      onChange={(e) => updatePaymentStatus(order._id, e.target.value)}
                      className="w-full text-sm border border-gray-300 rounded px-2 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="pending">Payment Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>

                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Full Details</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md border">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">No orders found.</p>
            <p className="text-gray-500 text-sm">Orders will appear here when customers place them.</p>
          </div>
        )}
      </div>

      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Order Details - #{selectedOrder._id.slice(-8).toUpperCase()}
              </h2>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Customer Information</h3>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <User className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">{selectedOrder.user?.name}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.user?.email}</p>
                    </div>
                  </div>
                  
                  {selectedOrder.deliveryAddress && (
                    <div className="mt-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-sm">Delivery Address</span>
                      </div>
                      <div className="text-sm text-gray-600 ml-6">
                        <p>{selectedOrder.deliveryAddress.street}</p>
                        <p>{selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state}</p>
                        <p>{selectedOrder.deliveryAddress.zipCode}</p>
                        <p className="mt-1">📞 {selectedOrder.deliveryAddress.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Status:</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      <span className="ml-1">{selectedOrder.status}</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Payment:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.paymentInfo?.status)}`}>
                      {selectedOrder.paymentInfo?.status} ({selectedOrder.paymentInfo?.method})
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-semibold text-lg mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                    <span>Total Amount:</span>
                    <span>₹{selectedOrder.totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.pizzas?.map((pizza, index) => (
                  <div key={index} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      {pizza.pizzaId?.image ? (
                        <img 
                          src={pizza.pizzaId.image} 
                          alt={pizza.pizzaId.name}
                          className="h-12 w-12 sm:h-16 sm:w-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">{pizza.pizzaId?.name || 'Custom Pizza'}</p>
                        <p className="text-xs sm:text-sm text-gray-600">Quantity: {pizza.quantity}</p>
                        <p className="text-xs sm:text-sm text-gray-600">₹{pizza.price} each</p>
                        {pizza.customName && (
                          <p className="text-xs sm:text-sm text-blue-600 truncate">Custom: {pizza.customName}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm sm:text-base">₹{pizza.price * pizza.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.specialInstructions && (
              <div className="mt-4 sm:mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Special Instructions</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                  <p className="text-gray-700 text-sm sm:text-base">{selectedOrder.specialInstructions}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagement;