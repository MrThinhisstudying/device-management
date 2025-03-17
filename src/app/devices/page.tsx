'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faShoppingBag, faList, faArrowLeft, faBars, faSignOutAlt, faChevronDown, faBell, faCircleUser } from '@fortawesome/free-solid-svg-icons';

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

// Định nghĩa interface cho thông báo
interface Notification {
  id: number;
  message: string;
  category: string;
  time: string;
}

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [search, setSearch] = useState('');
  const [username, setUsername] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State để ẩn/hiện sidebar
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: "Mark Edwards mentioned you in the #warehouse channel.", category: "Collaboration", time: "28m ago" },
    { id: 2, message: "SAP Data Lake connection successfully connected", category: "Insights", time: "2h ago" },
  ]); // Danh sách thông báo (giả lập)
  const [showNotifications, setShowNotifications] = useState(false); // Hiển thị dropdown thông báo
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); // Hiển thị dropdown profile
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 10; // Số thiết bị mỗi trang
  const router = useRouter();

  // Refs để theo dõi các phần tử dropdown
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Lấy danh sách thiết bị từ API
  useEffect(() => {
    const fetchDevices = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const res = await fetch('/api/devices', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data: Device[] = await res.json();
          setDevices(data);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.log('Error: ', error);
        router.push('/login');
      }
    };
    fetchDevices();

    // Lấy username từ token (giả định API trả về username)
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUsername(decoded.username || 'User');
    }
  }, [router]);

  // Xử lý click ra ngoài để ẩn dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node) && !(event.target as HTMLElement).closest('button[aria-label="Notifications"]')) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node) && !(event.target as HTMLElement).closest('button[aria-label="Profile"]')) {
        setShowProfileDropdown(false);
      }
    };

    if (showNotifications || showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showProfileDropdown]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMarkAllAsRead = () => {
    setNotifications([]); // Xóa tất cả thông báo (giả lập)
  };

  // Lọc thiết bị dựa trên tìm kiếm
  const filteredDevices = devices.filter(
    (device) =>
      device.device_name.toLowerCase().includes(search.toLowerCase()) ||
      device.asset_code.toLowerCase().includes(search.toLowerCase())
  );

  // Phân trang
  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
  const paginatedDevices = filteredDevices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
//update image
const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
const [selectedImage, setSelectedImage] = useState<File | null>(null);
const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

const handleImageUpload = async () => {
  if (!selectedImage || !selectedDeviceId) return;
  const formData = new FormData();
  formData.append('image', selectedImage);
  formData.append('device_id', selectedDeviceId.toString());
console.log("example: ",setSelectedDeviceId, setSelectedImage, isUploadModalOpen );
  const res = await fetch('/api/devices/upload-image', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (data.message) {
    // Làm mới dữ liệu
    const res = await fetch('/api/devices', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const updatedDevices: Device[] = await res.json();
    setDevices(updatedDevices);
    setIsUploadModalOpen(false);
  }
};

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-md h-full transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-16'
        } md:${isSidebarOpen ? 'w-64' : 'w-16'} ${isSidebarOpen ? 'overflow-y-auto' : 'overflow-y-auto scrollbar-none'}`}
        style={{
          ...(isSidebarOpen
            ? {}
            : {
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE/Edge
              }),
        }}
      >
        <style jsx>{`
          .scrollbar-none::-webkit-scrollbar {
            display: none; // Chrome, Safari, Opera
          }
        `}</style>
        <div className="p-4 flex items-center h-19 justify-between border-b border-gray-200">
          {isSidebarOpen && (
            <div className="flex items-center">
              <Image
                src="/acv-logo.png"
                alt="ACV Logo"
                width={150}
                height={24}
                className="mr-2"
              />
            </div>
          )}
          {!isSidebarOpen && <div />}
          <button
            className="text-gray-500 hover:text-[#001EFF] cursor-pointer"
            onClick={toggleSidebar}
          >
            <FontAwesomeIcon icon={isSidebarOpen ? faArrowLeft : faBars} className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li className="group relative">
              <Link
                href="/home"
                className={`flex items-center ${isSidebarOpen ? 'text-gray-600 hover:text-[#001EFF] hover:bg-gray-100' : 'justify-center'} p-2 rounded ${
                  !isSidebarOpen ? 'hover:text-[#001EFF] hover:bg-gray-200 cursor-pointer' : ''
                }`}
              >
                <FontAwesomeIcon icon={faHome} className="w-5 h-5" />
                {isSidebarOpen && <span className="ml-2">Tổng quan</span>}
              </Link>
              {!isSidebarOpen && (
                <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-purple-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Tổng quan
                </span>
              )}
            </li>
            <li className="group relative">
              <Link
                href="/all-orders"
                className={`flex items-center ${isSidebarOpen ? 'text-white bg-[#001EFF]' : 'justify-center'} p-2 rounded ${
                  !isSidebarOpen ? 'hover:text-[#001EFF] hover:bg-gray-200 cursor-pointer' : ''
                }`}
              >
                <FontAwesomeIcon icon={faShoppingBag} className="w-5 h-5" />
                {isSidebarOpen && <span className="ml-2">Thiết bị</span>}
              </Link>
              {!isSidebarOpen && (
                <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-purple-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Thiết bị
                </span>
              )}
            </li>
            <li className="group relative">
              <Link
                href="/menu"
                className={`flex items-center ${isSidebarOpen ? 'text-gray-600 hover:text-[#001EFF] hover:bg-gray-100' : 'justify-center'} p-2 rounded ${
                  !isSidebarOpen ? 'hover:text-[#001EFF] hover:bg-gray-200 cursor-pointer' : ''
                }`}
              >
                <FontAwesomeIcon icon={faList} className="w-5 h-5" />
                {isSidebarOpen && <span className="ml-2">Nhân viên</span>}
              </Link>
              {!isSidebarOpen && (
                <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-purple-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Nhân viên
                </span>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-md h-19 ml-2 p-4 flex justify-between items-center">
        {/* // Thêm nút mở modal trong header */}
<button
  onClick={() => {
    setSelectedDeviceId(1); // Chọn device_id (cần logic chọn thiết bị)
    setIsUploadModalOpen(true);
  }}
  className="px-4 py-2 bg-[#001EFF] text-white rounded-lg ml-4"
>
  Upload Image
</button>
       {/* upload image start */}
        {isUploadModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-md w-96">
      <h3 className="text-lg font-bold mb-4">Upload Image</h3>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setSelectedImage(e.target.files ? e.target.files[0] : null)}
        className="mb-4"
      />
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setIsUploadModalOpen(false)}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleImageUpload}
          className="px-4 py-2 bg-[#001EFF] text-white rounded-lg"
        >
          Upload
        </button>
      </div>
    </div>
  </div>
)}
{/* upload image */}
          <div className="flex items-center">
            {!isSidebarOpen && (
              <button
                className="text-gray-500 hover:text-[#001EFF] cursor-pointer md:hidden mr-4"
                onClick={toggleSidebar}
              >
                <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
              </button>
            )}
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="xe cấp điện, xe khách,..."
                className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001EFF]"
              />
              <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="group flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-[#001EFF] cursor-pointer transition-colors"
                aria-label="Notifications"
              >
                <FontAwesomeIcon icon={faBell} className="w-5 h-5 text-gray-600 group-hover:text-white" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                    {notifications.length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-10">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-gray-700 font-semibold">Notifications</h3>
                    {notifications.length > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-[#001EFF] text-sm hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="p-4 border-b hover:bg-gray-50"
                        >
                          <p className="text-gray-700">{notification.message}</p>
                          <p className="text-gray-500 text-sm">
                            {notification.category} • {notification.time}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Không có thông báo nào cả
                      </div>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-4">
                      <button className="w-full bg-[#001EFF] text-white py-2 rounded-lg hover:bg-[#0033FF]">
                        Show all
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="group flex items-center space-x-2 p-2 rounded-full hover:bg-[#001EFF] cursor-pointer transition-colors"
                aria-label="Profile"
              >
                <div className="relative">
                  <Image
                    src="/avatar-placeholder.png"
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
                <span className="text-gray-700 group-hover:text-white">{username}</span>
                <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3 text-gray-700 group-hover:text-white" />
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10">
                  <div className="p-4 border-b">
                    <div className="flex items-center space-x-2">
                      <Image
                        src="/avatar-placeholder.png"
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <span className="text-gray-700 font-semibold">{username}</span>
                    </div>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <FontAwesomeIcon icon={faCircleUser} className="w-4 h-4 mr-2" />
                      My Profile
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setShowProfileDropdown(false); }}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Bảng hiển thị thông tin thiết bị */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Danh sách thiết bị</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Mã số tài sản</th>
                  <th className="border p-2 text-left">Đơn vị sử dụng</th>
                  <th className="border p-2 text-left">Ngày tạo</th>
                  <th className="border p-2 text-left">Trạng thái</th>
                  <th className="border p-2 text-left">Mục đích sử dụng</th>
                  <th className="border p-2 text-left">Địa điểm</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDevices.map((device) => (
                  <tr key={device.device_id} className="hover:bg-gray-50">
                    <td className="border p-2">{device.asset_code}</td>
                    <td className="border p-2">{device.usage_unit || 'N/A'}</td>
                    <td className="border p-2">
              {device.image_data ? (
                <img
                  src={`data:image/jpeg;base64,${device.image_data.toString('base64')}`}
                  alt={device.device_name}
                  width={50}
                  height={50}
                  className="rounded"
                />
              ) : (
                'N/A'
              )}
            </td>
                    <td className="border p-2">
                      {device.daily_operation_time && device.daily_operation_time > 0 ? 'Hoạt động' : 'Không hoạt động'}
                    </td>
                    <td className="border p-2">{device.purpose || 'N/A'}</td>
                    <td className="border p-2">{device.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-between items-center">
                <div className="text-gray-600">
                  Hiển thị {paginatedDevices.length} / {filteredDevices.length} thiết bị
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#001EFF] text-white hover:bg-[#0033FF]'}`}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-lg ${currentPage === page ? 'bg-[#001EFF] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-lg ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#001EFF] text-white hover:bg-[#0033FF]'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}