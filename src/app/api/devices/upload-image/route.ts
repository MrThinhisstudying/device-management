import { NextResponse } from 'next/server';
import multer from 'multer';
import { Pool } from 'pg'; // Sử dụng pg cho PostgreSQL, cài đặt: npm install pg

// Cấu hình kết nối database
const pool = new Pool({
  user: 'your_user',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

// Cấu hình multer (không lưu file, chỉ lấy buffer)
const upload = multer({
  storage: multer.memoryStorage(), // Lưu tạm trong memory dưới dạng buffer
}).single('image');
console.log("Upload: ",upload);
export async function POST(req: Request) {
  try {
    // Xử lý upload file
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const deviceId = formData.get('device_id') as string; // Giả định gửi device_id cùng form

    if (!deviceId) {
      return NextResponse.json({ error: 'Device ID is required' }, { status: 400 });
    }

    // Lưu vào database
    await pool.query(
      'UPDATE devices SET image_data = $1 WHERE device_id = $2',
      [buffer, parseInt(deviceId)]
    );

    return NextResponse.json({ message: 'Image uploaded successfully' }, { status: 200 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false, // Tắt body parser mặc định
  },
};