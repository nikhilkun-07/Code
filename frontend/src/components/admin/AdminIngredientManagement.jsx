import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';
const URL = import.meta.env.VITE_BACKEND_URL
const AdminIngredientManagement = () => {
  const [ingredients, setIngredients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    image: null
  });

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const { data } = await axios.get(`${URL}/api/ingredients`);
      setIngredients(data.ingredients || []);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('category', formData.category);
      submitData.append('price', formData.price);
      if (formData.image) {
        submitData.append('file', formData.image);
      }

      if (editingIngredient) {
        await axios.put(`${URL}/api/ingredients/${editingIngredient._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post(`${URL}/api/ingredients`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setShowForm(false);
      setEditingIngredient(null);
      setFormData({ name: '', category: '', price: '', image: null });
      fetchIngredients();
    } catch (error) {
      console.error('Error saving ingredient:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ingredient?')) {
      try {
        await axios.delete(`${URL}/api/ingredients/${id}`);
        fetchIngredients();
      } catch (error) {
        console.error('Error deleting ingredient:', error);
      }
    }
  };

  const categories = ['base', 'sauce', 'cheese', 'veggies', 'meat'];

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
        <h1 className="text-3xl font-bold text-gray-800">Ingredient Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mr-6 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add Ingredient</span>
        </button>
      </div>

    
      {showForm && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingIngredient ? 'Edit Ingredient' : 'Add New Ingredient'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Ingredient Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border rounded-lg"
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 border rounded-lg"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                className="w-full p-3 border rounded-lg"
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                >
                  {editingIngredient ? 'Update' : 'Create'} Ingredient
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingIngredient(null);
                    setFormData({ name: '', category: '', price: '', image: null });
                  }}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {categories.map(category => {
          const categoryIngredients = ingredients.filter(ing => ing.category === category);
          
          if (categoryIngredients.length === 0) return null;

          return (
            <div key={category} className="bg-white rounded-lg shadow-md border p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categoryIngredients.map(ingredient => (
                  <div key={ingredient._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    {ingredient.image && (
                      <img
                        src={ingredient.image}
                        alt={ingredient.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h3 className="font-semibold text-gray-800">{ingredient.name}</h3>
                    <p className="text-blue-600 font-bold">₹{ingredient.price}</p>
                    <div className="flex justify-end space-x-2 mt-3">
                      <button
                        onClick={() => {
                          setEditingIngredient(ingredient);
                          setFormData({
                            name: ingredient.name,
                            category: ingredient.category,
                            price: ingredient.price.toString(),
                            image: null
                          });
                          setShowForm(true);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ingredient._id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {ingredients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No ingredients found. Add your first ingredient!</p>
        </div>
      )}
    </div>
  );
};

export default AdminIngredientManagement;