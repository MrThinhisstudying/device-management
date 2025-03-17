import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db'; // Điều chỉnh đường dẫn import
import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            employee_code, full_name, date_of_birth, gender, title,
            activity_group, team, avatar_url, password, role,username
        } = body;
        // Kiểm tra username đã tồn tại chưa
        const usernameCheck = await pool.query('SELECT * FROM employees WHERE username = $1', [username]);
        if (usernameCheck.rows.length > 0) {
        return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO employees (employee_code, full_name, date_of_birth, gender, title, 
             activity_group, team, avatar_url, password, role, username) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [employee_code, full_name, date_of_birth, gender, title, activity_group, team, avatar_url, hashedPassword, role, username || 'employee']
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error creating employee' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const result = await pool.query('SELECT * FROM employees');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.log("Error: ",error);
        return NextResponse.json({ error: 'Error fetching employees' }, { status: 500 });
    }
}