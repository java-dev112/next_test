import 'dotenv/config';
import mongoose from 'mongoose';
import Customer from '../models/Customer';
import { mockCustomers } from '../lib/data';

const MONGODB_URI = process.env.NEXT_APP_DB || '';

if (!MONGODB_URI) {
  throw new Error('Please define the NEXT_APP_DB environment variable');
}

async function seedCustomers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Check existing customers
    const existingCount = await Customer.countDocuments();
    console.log(`Found ${existingCount} existing customers`);

    // Prepare customers to insert
    const customersToInsert = mockCustomers.map((customer) => ({
      name: customer.name,
      email: customer.email.toLowerCase(),
      phone: customer.phone,
      address: customer.address,
    }));

    // Check which customers already exist by email
    const existingEmails = await Customer.find({
      email: { $in: customersToInsert.map(c => c.email) }
    }).select('email').lean();

    const existingEmailSet = new Set(existingEmails.map((c: any) => c.email));
    const newCustomers = customersToInsert.filter(c => !existingEmailSet.has(c.email));

    if (newCustomers.length === 0) {
      console.log('All customers already exist in the database');
      console.log('\n✅ No new customers to seed!');
      process.exit(0);
    }

    // Insert new customers
    console.log(`Inserting ${newCustomers.length} new customers...`);
    const inserted = await Customer.insertMany(newCustomers);
    console.log(`Successfully inserted ${inserted.length} customers`);

    // Display inserted customers
    console.log('\nInserted customers:');
    inserted.forEach((customer, index) => {
      console.log(`${index + 1}. ${customer.name} (${customer.email})`);
    });

    console.log('\n✅ Seed data inserted successfully!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
seedCustomers();

