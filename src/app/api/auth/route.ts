import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    // Sử dụng trường username để truy vấn
    const result = await pool.query('SELECT * FROM employees WHERE username = $1', [username.trim()]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const employee = result.rows[0];
    const isValid = await bcrypt.compare(password, employee.password);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: employee.employee_id, role: employee.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ token, role: employee.role });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json({ error: 'Error logging in' }, { status: 500 });
  }
}
