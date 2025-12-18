import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FileModel from '@/models/File';
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
          error: 'Invalid file ID',
        },
        { status: 400 }
      );
    }

    const file = await FileModel.findById(id).lean();

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'File not found',
        },
        { status: 404 }
      );
    }

    const formattedFile = {
      id: file._id.toString(),
      name: file.name,
      fileName: file.fileName,
      fileType: file.fileType,
      fileSize: file.fileSize,
      fileUrl: file.fileUrl,
      description: file.description,
      category: file.category,
      projectId: file.projectId,
      customerId: file.customerId,
      uploadedBy: file.uploadedBy,
      createdAt: file.createdAt ? file.createdAt.toISOString() : undefined,
      updatedAt: file.updatedAt ? file.updatedAt.toISOString() : undefined,
    };

    return NextResponse.json(
      {
        success: true,
        data: formattedFile,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch file',
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
          error: 'Invalid file ID',
        },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.projectId !== undefined) updateData.projectId = body.projectId;
    if (body.customerId !== undefined) updateData.customerId = body.customerId;

    const file = await FileModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'File not found',
        },
        { status: 404 }
      );
    }

    const formattedFile = {
      id: file._id.toString(),
      name: file.name,
      fileName: file.fileName,
      fileType: file.fileType,
      fileSize: file.fileSize,
      fileUrl: file.fileUrl,
      description: file.description,
      category: file.category,
      projectId: file.projectId,
      customerId: file.customerId,
      uploadedBy: file.uploadedBy,
      createdAt: file.createdAt ? file.createdAt.toISOString() : undefined,
      updatedAt: file.updatedAt ? file.updatedAt.toISOString() : undefined,
    };

    return NextResponse.json(
      {
        success: true,
        data: formattedFile,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update file',
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
          error: 'Invalid file ID',
        },
        { status: 400 }
      );
    }

    const file = await FileModel.findById(id).lean();

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'File not found',
        },
        { status: 404 }
      );
    }

    await FileModel.findByIdAndDelete(id);


    const formattedFile = {
      id: file._id.toString(),
      name: file.name,
      fileName: file.fileName,
      fileType: file.fileType,
      fileSize: file.fileSize,
      fileUrl: file.fileUrl,
      description: file.description,
      category: file.category,
      projectId: file.projectId,
      customerId: file.customerId,
      uploadedBy: file.uploadedBy,
      createdAt: file.createdAt ? file.createdAt.toISOString() : undefined,
      updatedAt: file.updatedAt ? file.updatedAt.toISOString() : undefined,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'File deleted successfully',
        data: formattedFile,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete file',
      },
      { status: 500 }
    );
  }
}

