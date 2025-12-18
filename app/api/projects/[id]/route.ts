import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import Customer from '@/models/Customer';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid project ID',
        },
        { status: 400 }
      );
    }

    const project = await Project.findById(id).lean();

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: 'Project not found',
        },
        { status: 404 }
      );
    }

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
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch project',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid project ID',
        },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.customer !== undefined) {
      if (mongoose.Types.ObjectId.isValid(body.customer)) {
        const customer = await Customer.findById(body.customer).lean();
        updateData.customer = customer?.name || body.customer;
      } else {
        updateData.customer = body.customer;
      }
    }
    if (body.location !== undefined) updateData.location = body.location;
    if (body.projectType !== undefined) updateData.projectType = body.projectType;
    if (body.openInvoice !== undefined) updateData.openInvoice = body.openInvoice;
    if (body.paidInvoice !== undefined) updateData.paidInvoice = body.paidInvoice;
    if (body.created !== undefined) updateData.created = body.created;
    if (body.projectNumber !== undefined) updateData.projectNumber = body.projectNumber;
    if (body.budgetVariance !== undefined) updateData.budgetVariance = body.budgetVariance;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.coverPhoto !== undefined) updateData.coverPhoto = body.coverPhoto;

    const project = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: 'Project not found',
        },
        { status: 404 }
      );
    }

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
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update project',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid project ID',
        },
        { status: 400 }
      );
    }

    const project = await Project.findByIdAndDelete(id).lean();

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: 'Project not found',
        },
        { status: 404 }
      );
    }

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
        message: 'Project deleted successfully',
        data: formattedProject,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete project',
      },
      { status: 500 }
    );
  }
}

