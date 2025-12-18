import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FileModel from '@/models/File';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const projectId = searchParams.get('projectId');
    const customerId = searchParams.get('customerId');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = (page - 1) * limit;

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { fileName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) {
      query.category = category;
    }
    if (projectId) {
      query.projectId = projectId;
    }
    if (customerId) {
      query.customerId = customerId;
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const files = await FileModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const formattedFiles = files.map((file: any) => ({
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
    }));

    const total = await FileModel.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: formattedFiles,
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
        error: error.message || 'Failed to fetch files',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    if (!body.name || body.name.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'File name is required',
        },
        { status: 400 }
      );
    }

    if (!body.fileName || body.fileName.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'File name is required',
        },
        { status: 400 }
      );
    }

    if (!body.fileType || body.fileType.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'File type is required',
        },
        { status: 400 }
      );
    }

    if (body.fileSize === undefined || body.fileSize === null) {
      return NextResponse.json(
        {
          success: false,
          error: 'File size is required',
        },
        { status: 400 }
      );
    }

    if (!body.fileUrl || body.fileUrl.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'File URL is required',
        },
        { status: 400 }
      );
    }

    const file = await FileModel.create({
      name: body.name,
      fileName: body.fileName,
      fileType: body.fileType,
      fileSize: body.fileSize,
      fileUrl: body.fileUrl,
      description: body.description,
      category: body.category,
      projectId: body.projectId,
      customerId: body.customerId,
      uploadedBy: body.uploadedBy,
    });

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
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create file',
      },
      { status: 500 }
    );
  }
}

