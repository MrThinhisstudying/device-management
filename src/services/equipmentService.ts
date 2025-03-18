import axios from 'axios';

// Lấy API URL từ biến môi trường
const API_URL = process.env.REACT_APP_API_URL;

export interface Equipment {
  id?: number;
  name: string;
  brand: string;
  serial_number: string;
  purpose: string;
  operation_scope: string;
  manufacture_country: string;
  manufacture_year: number;
  usage_start_year: number;
  code: string;
  location: string;
  daily_operation_time: number;
  relocation_origin: string;
  relocation_year: number | null;
  asset_code: string;
  unit: string;
  user: number | null;
  qr_code?: string;
}

// Hàm lấy danh sách thiết bị
export const getEquipments = async (): Promise<Equipment[]> => {
  try {
    const response = await axios.get<Equipment[]>(`${API_URL}/equipment/`);
    return response.data;
  } catch (error) {
    // Ném lỗi để component gọi xử lý
    throw error;
  }
};

// Hàm thêm thiết bị
export const addEquipment = async (equipment: Equipment): Promise<Equipment> => {
  try {
    const response = await axios.post<Equipment>(`${API_URL}/equipment/`, equipment);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Hàm cập nhật thiết bị
export const updateEquipment = async (equipment: Equipment): Promise<Equipment> => {
  if (!equipment.id) throw new Error('Thiết bị không có ID!');
  try {
    const response = await axios.put<Equipment>(`${API_URL}/equipment/${equipment.id}/`, equipment);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Hàm xóa thiết bị
export const deleteEquipment = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/equipment/${id}/`);
  } catch (error) {
    throw error;
  }
};

// Hàm tải báo cáo
export const downloadReportFile = async (format: 'pdf' | 'excel' | 'word'): Promise<Blob> => {
    try {
      // Chỉ định kiểu dữ liệu trả về là Blob
      const response = await axios.get<Blob>(`${API_URL}/export/${format}/`, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
