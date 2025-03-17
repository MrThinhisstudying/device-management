import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { device_id, length, width, height, weight, power_source, power_consumption, other_specs } = body;

        const result = await pool.query(
            `INSERT INTO device_specs (device_id, length, width, height, weight, power_source, power_consumption, other_specs) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [device_id, length, width, height, weight, power_source, power_consumption, other_specs]
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.log("Error: ",error);
        return NextResponse.json({ error: 'Error creating specs' }, { status: 500 });
    }
}