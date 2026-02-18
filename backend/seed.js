const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding');

        await User.deleteMany();
        await Product.deleteMany();

        // Password will be hashed by the pre-save hook in User model
        const password = 'password123';

        const user1 = await User.create({
            username: 'john_doe',
            email: 'john@example.com',
            password: password
        });

        const user2 = await User.create({
            username: 'jane_doe',
            email: 'jane@example.com',
            password: password
        });

        const products = [];
        for (let i = 1; i <= 10; i++) {
            products.push({
                title: `Book Title ${i}`,
                price: 10 + i * 5,
                description: `This is the description for book ${i}. It is a very interesting book about subject ${i}.`,
                image: `https://via.placeholder.com/150?text=Book+${i}`,
                owner: user1._id
            });
        }

        await Product.insertMany(products);

        console.log('Data seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
