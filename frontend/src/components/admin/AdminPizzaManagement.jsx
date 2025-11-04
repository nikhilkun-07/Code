import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Pizza, Upload, X } from 'lucide-react';
const URL = import.meta.env.VITE_BACKEND_URL


const AdminPizzaManagement = () => {
  const [pizzas, setPizzas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPizza, setEditingPizza] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    base: '',
    sauce: '',
    cheese: '',
    veggies: '',
    meat: '',
    price: '',
    description: '',
    image: null
  });

  useEffect(() => {
    fetchPizzas();
  }, []);

  const fetchPizzas = async () => {
    try {
      const { data } = await axios.get(`${URL}/api/pizzas`);
      setPizzas(data.pizzas || []);
    } catch (error) {
      console.error('Error fetching pizzas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('base', formData.base);
      submitData.append('sauce', formData.sauce);
      submitData.append('cheese', formData.cheese);
      submitData.append('veggies', JSON.stringify(formData.veggies.split(',').map(v => v.trim()).filter(v => v)));
      submitData.append('meat', JSON.stringify(formData.meat.split(',').map(m => m.trim()).filter(m => m)));
      submitData.append('price', formData.price);
      submitData.append('description', formData.description);
      
      if (formData.image) {
        submitData.append('file', formData.image);
      }

      if (editingPizza) {
        await axios.put(`${URL}/api/pizzas/${editingPizza._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post(`${URL}/api/pizzas`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setShowForm(false);
      setEditingPizza(null);
      setFormData({ 
        name: '', 
        base: '', 
        sauce: '', 
        cheese: '', 
        veggies: '', 
        meat: '', 
        price: '',
        description: '',
        image: null 
      });
      setImagePreview(null);
      fetchPizzas();
    } catch (error) {
      console.error('Error saving pizza:', error);
      alert('Error saving pizza: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (pizza) => {
    setEditingPizza(pizza);
    setFormData({
      name: pizza.name,
      base: pizza.base,
      sauce: pizza.sauce,
      cheese: pizza.cheese,
      veggies: pizza.veggies?.join(', ') || '',
      meat: pizza.meat?.join(', ') || '',
      price: pizza.price.toString(),
      description: pizza.description || '',
      image: null
    });
    setImagePreview(pizza.image || null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pizza?')) {
      try {
        await axios.delete(`${URL}/api/pizzas/${id}`);
        fetchPizzas();
      } catch (error) {
        console.error('Error deleting pizza:', error);
        alert('Error deleting pizza: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingPizza(null);
    setFormData({ 
      name: '', 
      base: '', 
      sauce: '', 
      cheese: '', 
      veggies: '', 
      meat: '', 
      price: '',
      description: '',
      image: null 
    });
    setImagePreview(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Pizza Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mr-6 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add Pizza</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingPizza ? 'Edit Pizza' : 'Add New Pizza'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img 
                      src={imagePreview} 
                      alt="Pizza preview" 
                      className="h-32 w-32 object-cover rounded-lg mx-auto"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Pizza className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 mb-2">Upload pizza image</p>
                  </div>
                )}
                
                <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2 mt-2">
                  <Upload className="h-4 w-4" />
                  <span>Choose Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG, JPEG up to 5MB</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Pizza Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Base"
                  value={formData.base}
                  onChange={(e) => setFormData({ ...formData, base: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Sauce"
                  value={formData.sauce}
                  onChange={(e) => setFormData({ ...formData, sauce: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Cheese"
                  value={formData.cheese}
                  onChange={(e) => setFormData({ ...formData, cheese: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Veggies (comma separated)"
                  value={formData.veggies}
                  onChange={(e) => setFormData({ ...formData, veggies: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Meat (comma separated)"
                  value={formData.meat}
                  onChange={(e) => setFormData({ ...formData, meat: e.target.value })}
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              <textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full p-3 border rounded-lg"
              />

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                >
                  {editingPizza ? 'Update' : 'Create'} Pizza
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pizzas.map((pizza) => (
          <div key={pizza._id} className="bg-white rounded-lg shadow-md border p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4 h-32">
              {pizza.image ? (
                <img 
                  src={pizza.image} 
                  alt={pizza.name}
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-lg">
                  <Pizza className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">{pizza.name}</h3>
            
            {pizza.description && (
              <p className="text-gray-600 text-sm mb-3 text-center">{pizza.description}</p>
            )}
            
            <div className="text-sm text-gray-600 mb-4 space-y-1">
              <p><strong>Base:</strong> {pizza.base}</p>
              <p><strong>Sauce:</strong> {pizza.sauce}</p>
              <p><strong>Cheese:</strong> {pizza.cheese}</p>
              {pizza.veggies?.length > 0 && (
                <p><strong>Veggies:</strong> {pizza.veggies.join(', ')}</p>
              )}
              {pizza.meat?.length > 0 && (
                <p><strong>Meat:</strong> {pizza.meat.join(', ')}</p>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-blue-600">₹{pizza.price}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(pizza)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Edit pizza"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(pizza._id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Delete pizza"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pizzas.length === 0 && (
        <div className="text-center py-12">
          <Pizza className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No pizzas found. Create your first pizza!</p>
        </div>
      )}
    </div>
  );
};

export default AdminPizzaManagement;