import 'dotenv/config';
import mongoose from 'mongoose';
import Project from '../models/Project';
import { mockProjects } from '../lib/data';

const MONGODB_URI = process.env.NEXT_APP_DB || '';

if (!MONGODB_URI) {
  throw new Error('Please define the NEXT_APP_DB environment variable');
}

async function seedProjects() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Clear existing projects (optional - comment out if you want to keep existing data)
    console.log('Clearing existing projects...');
    await Project.deleteMany({});
    console.log('Existing projects cleared');

    // Insert seed data
    console.log('Inserting seed projects...');
    const projectsToInsert = mockProjects.map((project) => ({
      name: project.name,
      customer: project.customer,
      location: project.location,
      projectType: project.projectType,
      openInvoice: project.openInvoice,
      paidInvoice: project.paidInvoice,
      created: project.created,
      projectNumber: project.projectNumber,
      budgetVariance: project.budgetVariance,
      description: project.description,
      coverPhoto: project.coverPhoto,
    }));

    const insertedProjects = await Project.insertMany(projectsToInsert);
    console.log(`Successfully inserted ${insertedProjects.length} projects`);

    // Display inserted projects
    console.log('\nInserted projects:');
    insertedProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.name} (${project.projectNumber}) - ${project.customer}`);
    });

    console.log('\n✅ Seed data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
seedProjects();

