import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Box, Snackbar, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { QRCodeCanvas } from 'qrcode.react';
import {
  getEquipments,
  addEquipment,
  updateEquipment,
  deleteEquipment,
  downloadReportFile,
  Equipment,
} from '../../services/equipmentService';
import { EquipmentForm } from "@/app/components/forms/EquipmentForm";
 // Component dùng chung cho form thêm/sửa

// Hàm khởi tạo giá trị Equipment ban đầu
const initialEquipment: Equipment = {
  name: '',
  brand: '',
  serial_number: '',
  purpose: '',
  operation_scope: '',
  manufacture_country: '',
  manufacture_year: 0,
  usage_start_year: 0,
  code: '',
  location: '',
  daily_operation_time: 0,
  relocation_origin: '',
  relocation_year: null,
  asset_code: '',
  unit: '',
  user: null,
};

const EquipmentList: React.FC = () => {
  const [equipments, setEquipments] = useState<Equipment>({
    name: "",
    type: "",
    manufacturer: "",
    serialNumber: "",
    purchaseDate: "",
    location: "",
    notes: "", // Nếu không bắt buộc, có thể bỏ qua
  });
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [currentEquipment, setCurrentEquipment] = useState<Equipment>(initialEquipment);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy dữ liệu thiết bị khi component mount
  useEffect(() => {
    fetchEquipmentData();
  }, []);

  const fetchEquipmentData = async () => {
    setLoading(true);
    try {
      const data = await getEquipments();
      setEquipments(data);
    } catch (error) {
      setError('Có lỗi xảy ra khi lấy dữ liệu!');
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };
 
  const handleAddEquipment = async (equipment: Equipment) => {
    if (!equipment.name || !equipment.code || !equipment.purpose ||
        !equipment.operation_scope || !equipment.manufacture_country ||
        !equipment.manufacture_year || !equipment.usage_start_year || equipment.user === null) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc!');
      return;
    }
    try {
      await addEquipment(equipment);
      setOpenAddDialog(false);
      setCurrentEquipment(initialEquipment);
      fetchEquipmentData();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Có lỗi khi thêm thiết bị!');
      }
      console.error('Error adding equipment:', error);
    }
  };

  const handleEditEquipment = async (equipment: Equipment) => {
    if (!equipment.name || !equipment.code || !equipment.purpose ||
        !equipment.operation_scope || !equipment.manufacture_country ||
        !equipment.manufacture_year || !equipment.usage_start_year || equipment.user === null) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc!');
      return;
    }
    try {
      await updateEquipment(equipment);
      setOpenEditDialog(false);
      fetchEquipmentData();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Có lỗi khi cập nhật thiết bị!');
      }
      console.error('Error adding equipment:', error);
    }
  };

  const handleDeleteEquipment = async (id?: number) => {
    if (!id) return;
    if (window.confirm('Bạn có chắc muốn xóa thiết bị này?')) {
      try {
        await deleteEquipment(id);
        fetchEquipmentData();
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Có lỗi khi xóa thiết bị!');
        }
        console.error('Error adding equipment:', error);
      }
    }
  };

  const handleDownloadReport = async (format: 'pdf' | 'excel' | 'word') => {
    try {
      const blobData = await downloadReportFile(format);
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `equipment_report.${format === 'excel' ? 'xlsx' : format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Có lỗi khi tải xuống file!');
      }
      console.error('Error adding equipment:', error);
    }
  };

  return (
    <>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
      <Box>
        <Box mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenAddDialog(true);
              setCurrentEquipment(initialEquipment);
            }}
            sx={{ mr: 1 }}
          >
            Thêm Thiết Bị
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleDownloadReport('pdf')}
            sx={{ mr: 1 }}
          >
            Tải PDF
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleDownloadReport('excel')}
            sx={{ mr: 1 }}
          >
            Tải Excel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleDownloadReport('word')}
          >
            Tải Word
          </Button>
        </Box>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên</TableCell>
                <TableCell>Nhãn hiệu</TableCell>
                <TableCell>Số máy</TableCell>
                <TableCell>Mục đích</TableCell>
                <TableCell>Phạm vi</TableCell>
                <TableCell>Nước SX</TableCell>
                <TableCell>Năm SX</TableCell>
                <TableCell>Năm SD</TableCell>
                <TableCell>Mã số</TableCell>
                <TableCell>Địa điểm</TableCell>
                <TableCell>Thời gian hoạt động</TableCell>
                <TableCell>Xuất xứ di dời</TableCell>
                <TableCell>Năm di dời</TableCell>
                <TableCell>Mã TSCD</TableCell>
                <TableCell>Đơn vị</TableCell>
                <TableCell>Người dùng</TableCell>
                <TableCell>Mã QR</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equipments.map((eq) => (
                <TableRow key={eq.id}>
                  <TableCell>{eq.name}</TableCell>
                  <TableCell>{eq.brand}</TableCell>
                  <TableCell>{eq.serial_number}</TableCell>
                  <TableCell>{eq.purpose}</TableCell>
                  <TableCell>{eq.operation_scope}</TableCell>
                  <TableCell>{eq.manufacture_country}</TableCell>
                  <TableCell>{eq.manufacture_year}</TableCell>
                  <TableCell>{eq.usage_start_year}</TableCell>
                  <TableCell>{eq.code}</TableCell>
                  <TableCell>{eq.location}</TableCell>
                  <TableCell>{eq.daily_operation_time}</TableCell>
                  <TableCell>{eq.relocation_origin}</TableCell>
                  <TableCell>{eq.relocation_year}</TableCell>
                  <TableCell>{eq.asset_code}</TableCell>
                  <TableCell>{eq.unit}</TableCell>
                  <TableCell>{eq.user}</TableCell>
                  <TableCell>
                    {eq.qr_code ? (
                      <QRCodeCanvas value={eq.qr_code} size={100} />
                    ) : (
                      'Không có QR'
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setCurrentEquipment(eq);
                        setOpenEditDialog(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteEquipment(eq.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Sử dụng EquipmentForm cho Dialog Thêm/Sửa */}
        {openAddDialog && (
          <EquipmentForm
            dialogTitle="Thêm Thiết Bị"
            equipment={currentEquipment}
            setEquipment={setCurrentEquipment}
            onSubmit={() => handleAddEquipment(currentEquipment)}
            onCancel={() => setOpenAddDialog(false)}
          />
        )}

        {openEditDialog && (
          <EquipmentForm
            dialogTitle="Sửa Thiết Bị"
            equipment={currentEquipment}
            setEquipment={setCurrentEquipment}
            onSubmit={() => handleEditEquipment(currentEquipment)}
            onCancel={() => setOpenEditDialog(false)}
          />
        )}
      </Box>
    </>
  );
};

export default EquipmentList;
