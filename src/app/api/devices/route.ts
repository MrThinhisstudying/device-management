import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            device_name, brand, purpose, operating_range, country_of_origin, manufacture_year,
            serial_number, technical_code, location, daily_operation_time, relocation_history,
            relocation_year, asset_code, usage_unit
        } = body;

        const result = await pool.query(
            `INSERT INTO devices (device_name, brand, purpose, operating_range, country_of_origin, 
             manufacture_year, serial_number, technical_code, location, daily_operation_time, 
             relocation_history, relocation_year, asset_code, usage_unit) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
            [device_name, brand, purpose, operating_range, country_of_origin, manufacture_year, serial_number,
             technical_code, location, daily_operation_time, relocation_history, relocation_year, asset_code, usage_unit]
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.log("Error: ",error);
        return NextResponse.json({ error: 'Error creating device' }, { status: 500 });
    }
}
// Định nghĩa interface Device dựa theo câu query SQL
interface Device {
    device_id: number;
    device_name: string;
    brand?: string;
    purpose?: string; // Mục đích sử dụng
    operating_range?: string; // Phạm vi hoạt động
    country_of_origin?: string;
    manufacture_year?: number;
    serial_number?: string;
    technical_code?: string; // Mã số kỹ thuật
    location: string;
    daily_operation_time?: number; // Thời gian hoạt động hàng ngày (phút)
    relocation_history?: string; // Xuất xứ di dời
    relocation_year?: number;
    asset_code: string;
    usage_unit?: string; // Đơn vị sử dụng
    created_at: string;
    image_data?: Buffer;
  }
export async function GET(req: Request) {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    try {
      const res = await pool.query('SELECT * FROM devices');
      const devices: Device[] = res.rows.map((row) => ({
        ...row,
        image_data: row.image_data ? Buffer.from(row.image_data) : undefined,
      }));
  
      return NextResponse.json(devices, { status: 200 });
    } catch (error) {
      console.error('Error fetching devices:', error);
      return NextResponse.json({ error: 'Failed to fetch devices' }, { status: 500 });
    }
  }