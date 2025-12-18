import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import Customer from '@/models/Customer';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const customer = searchParams.get('customer');
    const location = searchParams.get('location');
    const projectType = searchParams.get('projectType');
    const sortBy = searchParams.get('sortBy') || 'created';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = (page - 1) * limit;

    const query: any = {};
    if (customer) {
      query.customer = customer;
    }
    if (location) {
      query.location = location;
    }
    if (projectType) {
      query.projectType = projectType;
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const projects = await Project.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const formattedProjects = projects.map((project: any) => ({
      id: project._id.toString(),
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

    const total = await Project.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: formattedProjects,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch projects',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    if (!body.projectName || body.projectName.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'Project name is required',
        },
        { status: 400 }
      );
    }

    if (!body.customer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Customer is required',
        },
        { status: 400 }
      );
    }

    if (!body.remodelType) {
      return NextResponse.json(
        {
          success: false,
          error: 'Remodel type is required',
        },
        { status: 400 }
      );
    }

    let customerName = 'Unknown';
    if (body.customer && mongoose.Types.ObjectId.isValid(body.customer)) {
      const customer = await Customer.findById(body.customer).lean();
      customerName = customer?.name || 'Unknown';
    }

    const projectNumber = `PRJ-${String(Date.now()).slice(-4)}`;

    const project = await Project.create({
      name: body.projectName,
      customer: customerName,
      location: body.location || 'TBD',
      projectType: body.remodelType,
      openInvoice: body.openInvoice || 0,
      paidInvoice: body.paidInvoice || 0,
      created: body.created || new Date().toISOString().split('T')[0],
      projectNumber,
      budgetVariance: body.budgetVariance,
      description: body.projectDescription || body.description,
      coverPhoto: body.coverPhoto,
    });

    const formattedProject = {
      id: project._id.toString(),
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
    };

    return NextResponse.json(
      {
        success: true,
        data: formattedProject,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create project',
      },
      { status: 500 }
    );
  }
}

