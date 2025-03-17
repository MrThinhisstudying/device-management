import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { username } = await req.json();
        const result = await pool.query('SELECT * FROM employees WHERE employee_code = $1', [username]);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Gửi thông báo đến admin (giả lập bằng log, bạn có thể tích hợp email/slack sau)
        console.log(`Admin notification: Reset password request for ${username}`);
        return NextResponse.json({ message: 'Reset request sent to admin' });
    } catch (error) {
        console.log("Error: ",error);
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}