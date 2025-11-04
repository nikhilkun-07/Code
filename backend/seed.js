import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Pizza from './models/Pizza.js';
import Order from './models/Order.js';
import Ingredient from './models/Ingredient.js';

const seed = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Pizza.deleteMany();
    await Order.deleteMany();
    await Ingredient.deleteMany();

    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@pizza.com',
        password: 'password123',
        role: 'admin',
        isVerified: true,
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
        isVerified: true,
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        password: 'password123',
        role: 'user',
        isVerified: true,
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'password123',
        role: 'user',
        isVerified: true,
      }
    ]);


    const ingredients = await Ingredient.create([
    
      {
        name: 'Thin Crust',
        category: 'base',
        price: 0,
        image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop'
      },
      {
        name: 'Thick Crust',
        category: 'base',
        price: 20,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop'
      },
      {
        name: 'Whole Wheat',
        category: 'base',
        price: 25,
        image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop'
      },
      {
        name: 'Cheese Burst',
        category: 'base',
        price: 50,
        image: 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?w=400&h=300&fit=crop'
      },

    
      {
        name: 'Tomato Sauce',
        category: 'sauce',
        price: 0,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
      },
      {
        name: 'BBQ Sauce',
        category: 'sauce',
        price: 15,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop'
      },
      {
        name: 'White Sauce',
        category: 'sauce',
        price: 20,
        image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop'
      },
      {
        name: 'Pesto Sauce',
        category: 'sauce',
        price: 30,
        image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop'
      },

      
      {
        name: 'Mozzarella',
        category: 'cheese',
        price: 0,
        image: 'https://images.unsplash.com/photo-1551817948-c82d5770d2e3?w=400&h=300&fit=crop'
      },
      {
        name: 'Cheddar',
        category: 'cheese',
        price: 25,
        image: 'https://images.unsplash.com/photo-1618164430635-d8f0d159fb33?w=400&h=300&fit=crop'
      },
      {
        name: 'Parmesan',
        category: 'cheese',
        price: 35,
        image: 'https://images.unsplash.com/photo-1618164430635-d8f0d159fb33?w=400&h=300&fit=crop'
      },
      {
        name: 'Provolone',
        category: 'cheese',
        price: 30,
        image: 'https://images.unsplash.com/photo-1551817948-c82d5770d2e3?w=400&h=300&fit=crop'
      },

    
      {
        name: 'Bell Peppers',
        category: 'veggie',
        price: 15,
        image: 'https://images.unsplash.com/photo-1525607551107-68e20c75b1a9?w=400&h=300&fit=crop'
      },
      {
        name: 'Onions',
        category: 'veggie',
        price: 10,
        image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=400&h=300&fit=crop'
      },
      {
        name: 'Mushrooms',
        category: 'veggie',
        price: 20,
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop'
      },
      {
        name: 'Olives',
        category: 'veggie',
        price: 25,
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop'
      },
      {
        name: 'Tomatoes',
        category: 'veggie',
        price: 15,
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop'
      },
      {
        name: 'Jalapenos',
        category: 'veggie',
        price: 20,
        image: 'https://images.unsplash.com/photo-1596642533665-8b3e131ec74f?w=400&h=300&fit=crop'
      },
      {
        name: 'Spinach',
        category: 'veggie',
        price: 25,
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop'
      },
      {
        name: 'Corn',
        category: 'veggie',
        price: 15,
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop'
      },

      
      {
        name: 'Pepperoni',
        category: 'meat',
        price: 50,
        image: 'https://images.unsplash.com/photo-1625122386515-8559562f3db7?w=400&h=300&fit=crop'
      },
      {
        name: 'Chicken',
        category: 'meat',
        price: 45,
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop'
      },
      {
        name: 'Bacon',
        category: 'meat',
        price: 55,
        image: 'https://images.unsplash.com/photo-1621944190310-e3cca1566bd5?w=400&h=300&fit=crop'
      },
      {
        name: 'Sausage',
        category: 'meat',
        price: 40,
        image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop'
      },
      {
        name: 'Ham',
        category: 'meat',
        price: 35,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop'
      }
    ]);

    console.log('🧀 Created ingredients');

   
    const pizzas = await Pizza.create([
      {
        name: 'Margherita Classic',
        base: 'Thin Crust',
        sauce: 'Tomato Sauce',
        cheese: 'Mozzarella',
        veggie: ['Tomatoes', 'Basil'],
        price: 299,
        description: 'Classic Italian pizza with fresh tomatoes and basil',
        image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&h=400&fit=crop'
      },
      {
        name: 'Pepperoni Feast',
        base: 'Thick Crust',
        sauce: 'Tomato Sauce',
        cheese: 'Mozzarella',
        meat: ['Pepperoni'],
        price: 449,
        description: 'Loaded with spicy pepperoni and extra cheese',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&h=400&fit=crop'
      },
      {
        name: 'Veggie Supreme',
        base: 'Whole Wheat',
        sauce: 'Tomato Sauce',
        cheese: 'Mozzarella',
        veggie: ['Bell Peppers', 'Onions', 'Mushrooms', 'Olives', 'Corn'],
        price: 399,
        description: 'Loaded with fresh vegetables and herbs',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop'
      },
      {
        name: 'BBQ Chicken',
        base: 'Thin Crust',
        sauce: 'BBQ Sauce',
        cheese: 'Cheddar',
        meat: ['Chicken'],
        veggie: ['Onions'],
        price: 499,
        description: 'Smoky BBQ sauce with grilled chicken and onions',
        image: 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?w=600&h=400&fit=crop'
      },
      {
        name: 'Hawaiian Paradise',
        base: 'Thick Crust',
        sauce: 'Tomato Sauce',
        cheese: 'Mozzarella',
        meat: ['Ham'],
        veggie: ['Pineapple'],
        price: 429,
        description: 'Sweet pineapple and savory ham combination',
        image: 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?w=600&h=400&fit=crop'
      },
      {
        name: 'Meat Lovers',
        base: 'Thick Crust',
        sauce: 'BBQ Sauce',
        cheese: 'Mozzarella',
        meat: ['Pepperoni', 'Chicken', 'Bacon', 'Sausage'],
        price: 599,
        description: 'For true meat enthusiasts - loaded with four types of meat',
        image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&h=400&fit=crop'
      },
      {
        name: 'Four Cheese',
        base: 'Thin Crust',
        sauce: 'White Sauce',
        cheese: 'Mozzarella, Cheddar, Parmesan, Provolone',
        price: 479,
        description: 'Rich blend of four premium cheeses',
        image: 'https://images.unsplash.com/photo-1551817948-c82d5770d2e3?w=600&h=400&fit=crop'
      },
      {
        name: 'Spicy Delight',
        base: 'Thin Crust',
        sauce: 'Tomato Sauce',
        cheese: 'Mozzarella',
        meat: ['Chicken'],
        veggie: ['Jalapenos', 'Bell Peppers'],
        price: 459,
        description: 'Perfect for spice lovers with jalapenos and herbs',
        image: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=600&h=400&fit=crop'
      },
      {
        name: 'Mediterranean',
        base: 'Whole Wheat',
        sauce: 'Pesto Sauce',
        cheese: 'Mozzarella',
        veggie: ['Olives', 'Spinach', 'Tomatoes'],
        price: 429,
        description: 'Fresh Mediterranean flavors with pesto and olives',
        image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&h=400&fit=crop'
      },
      {
        name: 'Supreme Overload',
        base: 'Cheese Burst',
        sauce: 'Tomato Sauce',
        cheese: 'Mozzarella',
        meat: ['Pepperoni', 'Chicken'],
        veggie: ['Bell Peppers', 'Onions', 'Mushrooms', 'Olives'],
        price: 649,
        description: 'The ultimate pizza with everything you love',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop'
      },
      {
        name: 'Farm Fresh',
        base: 'Thin Crust',
        sauce: 'Tomato Sauce',
        cheese: 'Mozzarella',
        veggie: ['Bell Peppers', 'Onions', 'Mushrooms', 'Tomatoes', 'Corn'],
        price: 379,
        description: 'Fresh from the farm vegetables on crispy crust',
        image: 'https://images.unsplash.com/photo-1571066811602-716837d681de?w=600&h=400&fit=crop'
      },
      {
        name: 'Buffalo Chicken',
        base: 'Thick Crust',
        sauce: 'BBQ Sauce',
        cheese: 'Cheddar',
        meat: ['Chicken'],
        veggie: ['Onions', 'Jalapenos'],
        price: 489,
        description: 'Spicy buffalo chicken with tangy BBQ sauce',
        image: 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?w=600&h=400&fit=crop'
      }
    ]);

    console.log('🍕 Created pizzas');

   
const orders = await Order.create([
  {
    user: users[1]._id,
    pizzas: [
      { 
        pizzaId: pizzas[0]._id, 
        quantity: 1,
        price: pizzas[0].price 
      },
      { 
        pizzaId: pizzas[2]._id, 
        quantity: 2,
        price: pizzas[2].price 
      }
    ],
    totalPrice: 299 + (399 * 2), 
    status: 'Delivered',
    paymentInfo: {
      method: 'card',
      status: 'paid',
      transactionId: 'txn_123456',
      paidAt: new Date()
    },
    deliveryAddress: {
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      phone: '+91 9876543210'
    },
    specialInstructions: 'Please ring the bell twice',
    deliveredAt: new Date()
  },
  {
    user: users[2]._id,
    pizzas: [
      { 
        pizzaId: pizzas[1]._id, 
        quantity: 1,
        price: pizzas[1].price 
      },
      { 
        pizzaId: pizzas[5]._id, 
        quantity: 1,
        price: pizzas[5].price 
      }
    ],
    totalPrice: 449 + 599, 
    status: 'Out for Delivery',
    paymentInfo: {
      method: 'upi',
      status: 'paid',
      transactionId: 'txn_123457',
      paidAt: new Date()
    },
    deliveryAddress: {
      street: '456 Oak Avenue',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      phone: '+91 9876543211'
    },
    specialInstructions: 'Call before delivery'
  },
  {
    user: users[3]._id,
    pizzas: [
      { 
        pizzaId: pizzas[3]._id, 
        quantity: 1,
        price: pizzas[3].price 
      },
      { 
        pizzaId: pizzas[7]._id, 
        quantity: 1,
        price: pizzas[7].price 
      }
    ],
    totalPrice: 499 + 459, 
    status: 'In Kitchen',
    paymentInfo: {
      method: 'card',
      status: 'paid',
      transactionId: 'txn_123458',
      paidAt: new Date()
    },
    deliveryAddress: {
      street: '789 Park Road',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001',
      phone: '+91 9876543212'
    },
    estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000) 
  },
  {
    user: users[1]._id,
    pizzas: [
      { 
        pizzaId: pizzas[4]._id, 
        quantity: 2,
        price: pizzas[4].price 
      }
    ],
    totalPrice: 429 * 2, 
    status: 'Placed',
    paymentInfo: {
      method: 'cash',
      status: 'pending'
    },
    deliveryAddress: {
      street: '321 Garden Lane',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400002',
      phone: '+91 9876543213'
    },
    specialInstructions: 'Extra cheese please',
    estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000) 
  },
  {
    user: users[2]._id,
    pizzas: [
      { 
        pizzaId: pizzas[9]._id, 
        quantity: 1,
        price: pizzas[9].price 
      },
      { 
        pizzaId: pizzas[6]._id, 
        quantity: 1,
        price: pizzas[6].price 
      }
    ],
    totalPrice: 649 + 479,
    status: 'Received',
    paymentInfo: {
      method: 'card',
      status: 'paid',
      transactionId: 'txn_123459',
      paidAt: new Date()
    },
    deliveryAddress: {
      street: '654 Hillside Road',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110002',
      phone: '+91 9876543214'
    },
    specialInstructions: 'No onions please'
  },
  {
    user: users[3]._id,
    pizzas: [
      { 
        pizzaId: pizzas[8]._id, 
        quantity: 1,
        price: pizzas[8].price 
      },
      { 
        pizzaId: pizzas[10]._id, 
        quantity: 1,
        price: pizzas[10].price 
      },
      { 
        pizzaId: pizzas[11]._id, 
        quantity: 1,
        price: pizzas[11].price 
      }
    ],
    totalPrice: 429 + 379 + 489, 
    status: 'Cancelled',
    paymentInfo: {
      method: 'upi',
      status: 'refunded',
      transactionId: 'txn_123460'
    },
    deliveryAddress: {
      street: '987 Lake View',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560002',
      phone: '+91 9876543215'
    },
    specialInstructions: 'Cancel order - change of plans'
  },
  {
    user: users[1]._id,
    pizzas: [
      { 
        pizzaId: pizzas[1]._id, 
        quantity: 3,
        price: pizzas[1].price 
      }
    ],
    totalPrice: 449 * 3, 
    status: 'Delivered',
    paymentInfo: {
      method: 'wallet',
      status: 'paid',
      transactionId: 'txn_123461',
      paidAt: new Date()
    },
    deliveryAddress: {
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      phone: '+91 9876543210'
    },
    deliveredAt: new Date(Date.now() - 2 * 60 * 60 * 1000) 
  }
]);

console.log('📦 Created orders');
    console.log('📦 Created orders');

    console.log('\n✅ Database seeded successfully!');
    console.log('================================');
    console.log(`👥 Users created: ${users.length}`);
    console.log(`🧀 Ingredients created: ${ingredients.length}`);
    console.log(`🍕 Pizzas created: ${pizzas.length}`);
    console.log('\n🔑 Admin Login:');
    console.log('   Email: admin@pizza.com');
    console.log('   Password: password123');
    console.log('\n👤 User Login:');
    console.log('   Email: john@example.com');
    console.log('   Password: password123');
    console.log('================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();