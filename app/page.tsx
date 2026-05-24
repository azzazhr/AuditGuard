'use client';

import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedRole, setSelectedRole] = useState('user');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const supabase = createClient();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (isRegister) {
      const name = formData.get('name') as string;
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, role: selectedRole },
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
      } else {
        // Simpan role ke tabel profiles menggunakan service role via API
        if (signUpData.user) {
          await fetch('/api/set-role', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: signUpData.user.id,
              name,
              email,
              role: selectedRole,
            }),
          });
        }
        setIsRegister(false);
        setError('');
        setSuccess('Akun berhasil dibuat! Silakan login.');
        setIsLoading(false);
      }
    } else {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError('Email atau kata sandi salah.');
        setIsLoading(false);
      } else {
        // Ambil role dari profiles
        if (signInData.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', signInData.user.id)
            .single();
          // Simpan role ke localStorage untuk dipakai di halaman lain
          if (profile?.role) {
            localStorage.setItem('userRole', profile.role);
          }
        }
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#dad7cd] flex">
      {/* Left Side - Image and Description */}
      <div className="hidden lg:flex lg:w-1/2 flex-col p-12">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-[#344e41] rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[24px]">
              shield
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">AuditGuard</h1>
            <p className="text-[9px] font-medium text-gray-600 uppercase tracking-[0.15em]">
              Kepatuhan Perusahaan
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <p className="text-base font-medium text-black">
            Platform monitoring kepatuhan perusahaan untuk audit sistem,
            pelacakan aktivitas, dan deteksi anomali secara real-time.
          </p>
        </div>

        {/* Image Card */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-md">
            {/* Dashboard Preview Card */}
            <div className="bg-white rounded-3xl p-6 shadow-2xl border border-green-100">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Ringkasan Sistem</p>
                  <p className="text-base font-bold text-[#166534]">AuditGuard Dashboard</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[11px] text-green-600 font-semibold">Live</span>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Insiden</p>
                  <p className="text-xl font-bold text-[#166534]">7</p>
                </div>
                <div className="bg-red-50 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Alert</p>
                  <p className="text-xl font-bold text-red-600">4</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Aman</p>
                  <p className="text-xl font-bold text-emerald-600">98%</p>
                </div>
              </div>

              {/* Chart Bars */}
              <div className="mb-5">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Tren Aktivitas</p>
                <div className="flex items-end gap-1.5 h-16">
                  {[40, 65, 45, 80, 55, 90, 60, 75, 50, 85, 70, 95].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-sm ${i === 11 ? 'bg-[#166534]' : i % 3 === 0 ? 'bg-green-300' : 'bg-green-100'}`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Aktivitas Terbaru</p>
                {[
                  { icon: 'verified_user', label: 'Firewall diperbarui', time: '10:15', color: 'text-green-600 bg-green-50' },
                  { icon: 'warning', label: 'Gagal Login terdeteksi', time: '09:45', color: 'text-red-500 bg-red-50' },
                  { icon: 'fact_check', label: 'Audit log diperiksa', time: '09:30', color: 'text-emerald-600 bg-emerald-50' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${item.color}`}>
                      <span className="material-symbols-outlined text-[14px]">{item.icon}</span>
                    </div>
                    <p className="text-[12px] text-gray-700 flex-1 font-medium">{item.label}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{item.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Badge */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-4 py-2 shadow-lg border border-green-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-600 text-[20px]">
                  verified_user
                </span>
                <div className="text-[10px] text-gray-600">
                  <div className="font-semibold">PLATFORM BERSERTIFIKAT</div>
                  <div>SOC2 TYPE II</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10">
          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-2">
              {isRegister ? "Buat Akun Baru" : "Selamat Datang"}
            </h2>
            <p className="text-[14px] text-gray-600">
              {isRegister 
                ? "Daftarkan akun Anda untuk mengakses dashboard audit." 
                : "Silakan masukkan kredensial Anda untuk mengakses dashboard audit."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
                <label 
                  className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider" 
                  htmlFor="name"
                >
                  Nama Lengkap
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                    person
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400"
                    id="name"
                    name="name"
                    placeholder="Nama Anda"
                    required={isRegister}
                    type="text"
                  />
                </div>
              </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label 
                className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider" 
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                  mail
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400"
                  id="email"
                  name="email"
                  placeholder="Email Anda"
                  required
                  type="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label 
                className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider" 
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                  lock
                </span>
                <input
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400"
                  id="password"
                  name="password"
                  placeholder="Password Anda"
                  required
                  type={showPassword ? "text" : "password"}
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm Password (Register Only) */}
            {isRegister && (
              <div className="space-y-2">
                <label 
                  className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider" 
                  htmlFor="confirmPassword"
                >
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                    lock_reset
                  </span>
                  <input
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Konfirmasi Password Anda"
                    required={isRegister}
                    type="password"
                  />
                </div>
              </div>
            )}

            {/* Remember Me & Forgot Password (Login Only) */}
            {!isRegister && (
              <div className="flex items-center justify-between text-[13px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer" 
                    type="checkbox" 
                  />
                  <span className="text-gray-600">Ingat perangkat ini</span>
                </label>
                <a className="text-black hover:underline font-medium" href="#">
                  Lupa kata sandi?
                </a>
              </div>
            )}

            {/* Role Dropdown (Register Only) */}
            {isRegister && (
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider">
                  Daftar Sebagai
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                >
                  <option value="admin">Admin — akses penuh (CRUD)</option>
                  <option value="user">User — hanya bisa melihat</option>
                </select>
              </div>
            )}

            {/* Terms (Register Only) */}
            {isRegister && (
              <div className="flex items-start gap-2 pt-1">
                <input 
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer mt-0.5" 
                  type="checkbox" 
                  id="terms" 
                  required 
                />
                <label htmlFor="terms" className="text-[13px] text-gray-600 cursor-pointer">
                  Saya menyetujui{" "}
                  <a href="#" className="text-black hover:underline font-medium">
                    Syarat & Ketentuan
                  </a>
                  {" "}dan{" "}
                  <a href="#" className="text-black hover:underline font-medium">
                    Kebijakan Privasi
                  </a>
                </label>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="px-4 py-3 rounded-lg text-[13px] font-medium bg-green-50 text-green-700 border border-green-200">
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="px-4 py-3 rounded-lg text-[13px] font-medium bg-red-50 text-red-700 border border-red-200">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              className="w-full bg-[#344e41] text-white py-3.5 rounded-lg font-semibold text-[15px] hover:bg-[#588157] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? (
                isRegister ? "Mendaftarkan..." : "Masuk..."
              ) : (
                <>
                  {isRegister ? "Register" : "Login"}
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_forward
                  </span>
                </>
              )}
            </button>

            {/* Toggle Link */}
            <div className="text-center pt-4">
              <p className="text-[13px] text-gray-600">
                {isRegister ? "Sudah punya akun?" : "Belum memiliki akun?"}
                {" "}
                <button 
                  onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess(''); }} 
                  className="text-black font-semibold hover:underline"
                  type="button"
                >
                  {isRegister ? "Login" : "Register"}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
