import  { useState, useEffect } from 'react';
import axios from 'axios';
import { Pizza, Package, Users, DollarSign, AlertTriangle } from 'lucide-react';
const URL = import.meta.env.VITE_BACKEND_URL
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalPizzas: 0,
    lowStockItems: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, pizzasRes, ingredientsRes] = await Promise.all([
        axios.get(`${URL}/api/orders`),
        axios.get(`${URL}/api/pizzas`),
        axios.get(`${URL}/api/ingredients`)
      ]);

      const orders = ordersRes.data.orders || [];
      const pizzas = pizzasRes.data.pizzas || [];
      const ingredients = ingredientsRes.data.ingredients || [];

      const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
      const pendingOrders = orders.filter(order => !['Delivered', 'Cancelled'].includes(order.status)).length;
            const lowStockItems = ingredients.filter(ingredient => ingredient.quantity < 10).length;

      setStats({
        totalOrders: orders.length,
        pendingOrders,
        totalRevenue,
        totalPizzas: pizzas.length,
        lowStockItems
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <Package className="h-8 w-8" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: <AlertTriangle className="h-8 w-8" />,
      color: 'bg-orange-500'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue}`,
      icon: <DollarSign className="h-8 w-8" />,
      color: 'bg-green-500'
    },
    {
      title: 'Total Pizzas',
      value: stats.totalPizzas,
      icon: <Pizza className="h-8 w-8" />,
      color: 'bg-purple-500'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: <AlertTriangle className="h-8 w-8" />,
      color: 'bg-red-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-center">
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md border p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">#{order._id.slice(-6)}</td>
                    <td className="py-3 px-4">{order.user?.name || 'Guest'}</td>
                    <td className="py-3 px-4">₹{order.totalPrice}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;