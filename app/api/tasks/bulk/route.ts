import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { operation, taskIds, updateData } = body;

    if (!operation || !taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Operation and taskIds array are required',
        },
        { status: 400 }
      );
    }

    let result;

    switch (operation) {
      case 'delete':
        result = await Task.deleteMany({ _id: { $in: taskIds } });
        return NextResponse.json(
          {
            success: true,
            message: `${result.deletedCount} task(s) deleted successfully`,
            deletedCount: result.deletedCount,
          },
          { status: 200 }
        );

      case 'updateStatus':
        if (!updateData?.status) {
          return NextResponse.json(
            {
              success: false,
              error: 'Status is required for updateStatus operation',
            },
            { status: 400 }
          );
        }
        result = await Task.updateMany(
          { _id: { $in: taskIds } },
          { $set: { status: updateData.status } }
        );
        return NextResponse.json(
          {
            success: true,
            message: `${result.modifiedCount} task(s) updated successfully`,
            modifiedCount: result.modifiedCount,
          },
          { status: 200 }
        );

      case 'updatePriority':
        if (!updateData?.priority) {
          return NextResponse.json(
            {
              success: false,
              error: 'Priority is required for updatePriority operation',
            },
            { status: 400 }
          );
        }
        result = await Task.updateMany(
          { _id: { $in: taskIds } },
          { $set: { priority: updateData.priority } }
        );
        return NextResponse.json(
          {
            success: true,
            message: `${result.modifiedCount} task(s) updated successfully`,
            modifiedCount: result.modifiedCount,
          },
          { status: 200 }
        );

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid operation. Supported: delete, updateStatus, updatePriority',
          },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to perform bulk operation',
      },
      { status: 500 }
    );
  }
}

