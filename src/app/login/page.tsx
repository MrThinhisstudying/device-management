'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Login() {
  // Đổi tên biến state và setter cho rõ ràng
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reset lỗi trước khi gọi API
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push('/devices');
      } else {
        if (data.error === 'User not found') {
          setError('Tài khoản không tồn tại');
        } else if (data.error === 'Invalid password') {
          setError('Sai thông tin tên tài khoản hoặc mật khẩu');
        } else {
          setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
        }
      }
    } catch (err) {
      console.log("Error: ", err);
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  const handleForgotPassword = async () => {
    if (!username) {
      setError('Vui lòng nhập tên đăng nhập để khôi phục mật khẩu');
      return;
    }
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_code: username }),
      });
      const data = await res.json();
      alert(data.message || 'Yêu cầu đã được gửi đến admin');
    } catch (err) {
      console.log("Error: ", err);
      alert('Có lỗi khi gửi yêu cầu');
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/airport-bg.jpg')" }}
    >
      {/* Overlay để làm mờ nền */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Nội dung */}
      <div className="relative flex items-center justify-center min-h-screen">
        {/* Form đăng nhập */}
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          {/* Logo và thông tin công ty */}
          <div className="mb-6">
            <Image
              src="/acv-logo.png"
              alt="ACV Logo"
              width={300}
              height={60}
              className="mb-2"
            />
            <p className="text-sm text-gray-600">Tổng công ty Cảng hàng không Việt Nam - CTCP</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin}>
            {error && <p className="text-red-500 mb-6 text-center">{error}</p>}
            <div className="mb-4">
              <label className="block mb-1 text-xl text-gray-700 font-bold">Tên đăng nhập</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tài khoản"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-1 text-xl text-gray-700 font-bold">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mật khẩu"
                required
              />
            </div>
            <p
              onClick={handleForgotPassword}
              className="text-sm text-gray-700 mb-4 cursor-pointer hover:underline"
            >
              Tôi quên mật khẩu
            </p>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded cursor-pointer hover:bg-blue-600 transition"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-white text-sm">
          Tổng công ty Cảng hàng không Việt Nam - CTCP
        </p>
      </div>
    </div>
  );
}
