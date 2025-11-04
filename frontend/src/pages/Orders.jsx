import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Pizza, Clock, CheckCircle, Truck, Home, XCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

import toast from 'react-hot-toast'
const URL = import.meta.env.VITE_BACKEND_URL

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancellingOrder, setCancellingOrder] = useState(null)
  const { user } = useAuth()
  
  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${URL}/api/orders/my-orders`)
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const cancelOrder = async (orderId) => {
    setCancellingOrder(orderId)
    try {
      await axios.patch(`${URL}/api/orders/${orderId}/cancel`)
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: 'Cancelled' }
          : order
      ))
      toast.success('Order cancelled successfully')
    } catch (error) {
      console.error('Error cancelling order:', error)
      toast.error(error.response?.data?.message || 'Failed to cancel order')
    } finally {
      setCancellingOrder(null)
    }
  }

  const handleCancelClick = (orderId) => {
    toast((t) => (
      <div className="text-center">
        <p className="font-semibold mb-3">Are you sure you want to cancel this order?</p>
        <div className="flex justify-center space-x-3">
          <button
            onClick={() => {
              cancelOrder(orderId)
              toast.dismiss(t.id)
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Yes, Cancel
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            No, Keep It
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Placed':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'Received':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case 'In Kitchen':
        return <Pizza className="h-5 w-5 text-orange-500" />
      case 'Out for Delivery':
        return <Truck className="h-5 w-5 text-purple-500" />
      case 'Delivered':
        return <Home className="h-5 w-5 text-green-500" />
      case 'Cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Placed':
        return 'bg-yellow-100 text-yellow-800'
      case 'Received':
        return 'bg-blue-100 text-blue-800'
      case 'In Kitchen':
        return 'bg-orange-100 text-orange-800'
      case 'Out for Delivery':
        return 'bg-purple-100 text-purple-800'
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const canCancelOrder = (order) => {
    const nonCancellableStatuses = ['Delivered', 'Cancelled', 'Out for Delivery']
    return !nonCancellableStatuses.includes(order.status)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Orders</h1>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </h3>
                    <p className="text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </div>
                    
                    {canCancelOrder(order) && (
                      <button
                        onClick={() => handleCancelClick(order._id)}
                        disabled={cancellingOrder === order._id}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors"
                      >
                        {cancellingOrder === order._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="border-t border-b border-gray-200 py-4 mb-4">
                  {order.pizzas.map((pizzaItem, index) => (
                    <div key={index} className="flex justify-between items-center mb-3 last:mb-0">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {pizzaItem.customName || (pizzaItem.pizzaId?.name || 'Custom Pizza')}
                        </h4>
                        {pizzaItem.selectedOptions && (
                          <div className="text-sm text-gray-600 mt-1">
                            <p><strong>Base:</strong> {pizzaItem.selectedOptions.base}</p>
                            <p><strong>Sauce:</strong> {pizzaItem.selectedOptions.sauce}</p>
                            <p><strong>Cheese:</strong> {pizzaItem.selectedOptions.cheese}</p>
                            {pizzaItem.selectedOptions.veggies && pizzaItem.selectedOptions.veggies.length > 0 && (
                              <p><strong>Veggies:</strong> {pizzaItem.selectedOptions.veggies.join(', ')}</p>
                            )}
                            {pizzaItem.selectedOptions.meat && pizzaItem.selectedOptions.meat.length > 0 && (
                              <p><strong>Meat:</strong> {pizzaItem.selectedOptions.meat.join(', ')}</p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          ₹{pizzaItem.pizzaId?.price || pizzaItem.selectedOptions?.price || '0'} x {pizzaItem.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Payment ID: {order.paymentInfo?.paymentId || 'DEMO-PAYMENT'}
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    Total: ₹{order.totalPrice}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Pizza className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">Start building your perfect pizza!</p>
            <a
              href="/build-pizza"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Build Your Pizza
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders