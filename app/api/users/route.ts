import { NextRequest, NextResponse } from 'next/server';
import { createUser, getAllUsers, updateUser, deleteUser } from '@/lib/services/userService';

export async function GET(request: NextRequest) {
  try {
    // In Single-Tenant, we just get all users
    const users = await getAllUsers();
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, unit, jobTitle, phone, sendInvite } = body;

    if (!name || !email || !role) {
      return NextResponse.json({
        success: false,
        error: 'Campos requeridos: name, email, role'
      }, { status: 400 });
    }

    const result = await createUser({
      name,
      email,
      password,
      role,
      unit,
      jobTitle,
      phone,
      sendInvite,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      tempPassword: result.tempPassword,
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...updates } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const result = await updateUser(userId, updates);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const result = await deleteUser(userId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
