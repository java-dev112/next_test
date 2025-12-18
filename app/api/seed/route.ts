import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import Customer from '@/models/Customer';
import { mockProjects, mockCustomers } from '@/lib/data';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json().catch(() => ({}));
    const clear = body.clear === true;
    const seedType = body.type || 'all'; // 'all', 'customers', 'projects'

    let customerResults = null;
    let projectResults = null;

    if (seedType === 'all' || seedType === 'customers') {
      if (clear) {
        await Customer.deleteMany({});
      }

      const customersToInsert = mockCustomers.map((customer) => ({
        name: customer.name,
        email: customer.email.toLowerCase(),
        phone: customer.phone,
        address: customer.address,
      }));

      const existingEmails = await Customer.find({ 
        email: { $in: customersToInsert.map(c => c.email) } 
      }).select('email').lean();
      
      const existingEmailSet = new Set(existingEmails.map((c: any) => c.email));
      const newCustomers = customersToInsert.filter(c => !existingEmailSet.has(c.email));

      if (newCustomers.length > 0) {
        customerResults = await Customer.insertMany(newCustomers);
      } else if (!clear) {
        return NextResponse.json(
          {
            success: true,
            message: 'All customers already exist in the database',
            customers: {
              count: 0,
              skipped: customersToInsert.length,
            },
            projects: null,
          },
          { status: 200 }
        );
      }
    }

    if (seedType === 'all' || seedType === 'projects') {
      const existingProjects = await Project.countDocuments();
      
      if (existingProjects > 0 && !clear) {
        return NextResponse.json(
          {
            success: false,
            error: `Database already contains ${existingProjects} projects. Send { "clear": true } in the request body to clear and reseed.`,
            existingCount: existingProjects,
          },
          { status: 400 }
        );
      }

      if (clear && existingProjects > 0) {
        await Project.deleteMany({});
      }

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

      projectResults = await Project.insertMany(projectsToInsert);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully seeded database',
        customers: customerResults ? {
          count: customerResults.length,
          data: customerResults.map((c) => ({
            id: c._id.toString(),
            name: c.name,
            email: c.email,
          })),
        } : null,
        projects: projectResults ? {
          count: projectResults.length,
          data: projectResults.map((p) => ({
            id: p._id.toString(),
            name: p.name,
            projectNumber: p.projectNumber,
            customer: p.customer,
          })),
        } : null,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Some records already exist in the database. Clear existing data first.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to seed database',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const customerCount = await Customer.countDocuments();
    const projectCount = await Project.countDocuments();
    
    const customers = await Customer.find({})
      .select('name email')
      .limit(10)
      .lean();
    
    const projects = await Project.find({})
      .select('name projectNumber customer')
      .limit(10)
      .lean();

    return NextResponse.json(
      {
        success: true,
        customers: {
          count: customerCount,
          data: customers.map((c: any) => ({
            id: c._id.toString(),
            name: c.name,
            email: c.email,
          })),
        },
        projects: {
          count: projectCount,
          data: projects.map((p: any) => ({
            id: p._id.toString(),
            name: p.name,
            projectNumber: p.projectNumber,
            customer: p.customer,
          })),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to check seed status',
      },
      { status: 500 }
    );
  }
}

