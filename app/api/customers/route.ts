import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Customer from '@/models/Customer';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = (page - 1) * limit;

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const customers = await Customer.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const formattedCustomers = customers.map((customer: any) => ({
      id: customer._id.toString(),
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    }));

    const total = await Customer.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: formattedCustomers,
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
        error: error.message || 'Failed to fetch customers',
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
          error: 'Customer name is required',
        },
        { status: 400 }
      );
    }

    if (!body.email || body.email.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'Email is required',
        },
        { status: 400 }
      );
    }

    const existingCustomer = await Customer.findOne({ email: body.email.toLowerCase() });
    if (existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          error: 'A customer with this email already exists',
        },
        { status: 400 }
      );
    }

    const customer = await Customer.create({
      name: body.name,
      email: body.email.toLowerCase(),
      phone: body.phone,
      address: body.address,
    });

    const formattedCustomer = {
      id: customer._id.toString(),
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    };

    return NextResponse.json(
      {
        success: true,
        data: formattedCustomer,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: 'A customer with this email already exists',
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create customer',
      },
      { status: 500 }
    );
  }
}

